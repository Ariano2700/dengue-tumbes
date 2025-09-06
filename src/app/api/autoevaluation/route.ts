import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { RiskLevel } from '@prisma/client';

interface AutoevaluationRequest {
  symptoms: string[];
  temperature: string;
  daysSick: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
}

// Función para calcular el nivel de riesgo basado en síntomas
function calculateRiskLevel(symptoms: string[], temperature: number): RiskLevel {
  // Síntomas graves que indican riesgo alto
  const severeSymptoms = ['bleeding', 'abdominal_pain', 'breathing'];
  
  // Síntomas moderados
  const moderateSymptoms = ['fever', 'headache', 'nausea', 'eye_pain'];
  
  // Contar síntomas por severidad
  const severeCount = symptoms.filter(symptom => severeSymptoms.includes(symptom)).length;
  const moderateCount = symptoms.filter(symptom => moderateSymptoms.includes(symptom)).length;
  
  // Lógica de evaluación de riesgo
  if (severeCount > 0) {
    return RiskLevel.high;
  }
  
  if (temperature >= 38.5 && moderateCount >= 2) {
    return RiskLevel.high;
  }
  
  if (temperature >= 38.0 || moderateCount >= 2) {
    return RiskLevel.medium;
  }
  
  if (symptoms.length >= 2) {
    return RiskLevel.medium;
  }
  
  return RiskLevel.low;
}

export async function POST(req: NextRequest) {
  try {
    // Validar JWT token
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      return NextResponse.json(
        { error: 'No autorizado. Token JWT requerido.' }, 
        { status: 401 }
      );
    }

    // Verificar que el token tenga email (usuario válido)
    if (!token.email) {
      return NextResponse.json(
        { error: 'Token JWT inválido. Email requerido.' }, 
        { status: 401 }
      );
    }

    // Obtener datos del cuerpo de la petición
    const body: AutoevaluationRequest = await req.json();
    
    const { symptoms, temperature, daysSick, location } = body;

    // Validaciones básicas
    if (!symptoms || !Array.isArray(symptoms)) {
      return NextResponse.json(
        { error: 'Síntomas requeridos y deben ser un array' },
        { status: 400 }
      );
    }

    const tempFloat = parseFloat(temperature);
    if (isNaN(tempFloat) || tempFloat < 30 || tempFloat > 45) {
      return NextResponse.json(
        { error: 'Temperatura inválida' },
        { status: 400 }
      );
    }

    const daysInt = parseInt(daysSick);
    if (isNaN(daysInt) || daysInt < 0 || daysInt > 365) {
      return NextResponse.json(
        { error: 'Días de enfermedad inválidos' },
        { status: 400 }
      );
    }

    // Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      );
    }

    // Verificar que los síntomas existan en la base de datos
    const validSymptoms = await prisma.symptom.findMany({
      where: {
        code: {
          in: symptoms
        }
      }
    });

    if (validSymptoms.length !== symptoms.length) {
      const validCodes = validSymptoms.map(s => s.code);
      const invalidSymptoms = symptoms.filter(s => !validCodes.includes(s));
      return NextResponse.json(
        { 
          error: 'Síntomas inválidos encontrados',
          invalidSymptoms 
        },
        { status: 400 }
      );
    }

    // Calcular nivel de riesgo
    const riskLevel = calculateRiskLevel(symptoms, tempFloat);

    // Crear la autoevaluación en una transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear autoevaluación
      const autoevaluation = await tx.autoevaluation.create({
        data: {
          userId: user.id,
          riskLevel,
          temperature: tempFloat,
          daysSick: daysInt,
          latitude: location?.lat || null,
          longitude: location?.lng || null,
          address: location?.address || null,
        }
      });

      // Crear relaciones con síntomas
      if (symptoms.length > 0) {
        await tx.autoevaluationSymptom.createMany({
          data: symptoms.map(symptomCode => {
            const symptom = validSymptoms.find(s => s.code === symptomCode);
            return {
              autoevaluationId: autoevaluation.id,
              symptomId: symptom!.id
            };
          })
        });
      }

      return autoevaluation;
    });

    // Obtener la autoevaluación completa con síntomas para la respuesta
    const completeAutoevaluation = await prisma.autoevaluation.findUnique({
      where: { id: result.id },
      include: {
        symptoms: {
          include: {
            symptom: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Formatear respuesta
    const response = {
      success: true,
      data: {
        id: completeAutoevaluation!.id,
        riskLevel: completeAutoevaluation!.riskLevel,
        temperature: completeAutoevaluation!.temperature,
        daysSick: completeAutoevaluation!.daysSick,
        location: completeAutoevaluation!.latitude && completeAutoevaluation!.longitude ? {
          lat: completeAutoevaluation!.latitude,
          lng: completeAutoevaluation!.longitude,
          address: completeAutoevaluation!.address
        } : null,
        symptoms: completeAutoevaluation!.symptoms.map(as => ({
          code: as.symptom.code,
          name: as.symptom.name,
          severity: as.symptom.severity
        })),
        createdAt: completeAutoevaluation!.createdAt,
        user: completeAutoevaluation!.user
      },
      message: getRiskLevelMessage(completeAutoevaluation!.riskLevel)
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error al guardar autoevaluación:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al guardar la autoevaluación',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}

// Función para obtener mensaje según el nivel de riesgo
function getRiskLevelMessage(riskLevel: RiskLevel): string {
  switch (riskLevel) {
    case RiskLevel.high:
      return 'Riesgo ALTO: Te recomendamos buscar atención médica inmediata. Tus síntomas podrían indicar dengue grave.';
    case RiskLevel.medium:
      return 'Riesgo MEDIO: Te sugerimos consultar con un médico pronto. Mantente hidratado y observa la evolución de los síntomas.';
    case RiskLevel.low:
      return 'Riesgo BAJO: Tus síntomas son leves. Mantente hidratado, descansa y consulta un médico si los síntomas empeoran.';
    default:
      return 'Evaluación completada. Consulta con un profesional médico para obtener un diagnóstico preciso.';
  }
}
