import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Obtener última evaluación
    const lastEvaluation = await prisma.autoevaluation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        riskLevel: true,
        createdAt: true,
        temperature: true,
        daysSick: true,
        symptoms: {
          include: {
            symptom: true
          }
        }
      }
    });

    // Contar evaluaciones totales y del mes actual
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const [totalCount, monthlyCount] = await Promise.all([
      prisma.autoevaluation.count({
        where: { userId }
      }),
      prisma.autoevaluation.count({
        where: {
          userId,
          createdAt: {
            gte: startOfMonth
          }
        }
      })
    ]);

    // Obtener casos cercanos (simulado por ahora)
    // En una implementación real, esto podría basarse en la ubicación del usuario
    const nearbyCases = {
      count: Math.floor(Math.random() * 8), // Simulado entre 0-7 casos
      zone: 'tu zona'
    };

    // Procesar última evaluación
    let processedLastEvaluation = null;
    if (lastEvaluation) {
      const daysAgo = Math.floor(
        (now.getTime() - new Date(lastEvaluation.createdAt).getTime()) / (1000 * 60 * 60 * 24)
      );
      
      // Determinar resultado basado en nivel de riesgo y síntomas
      let result = 'Sin Síntomas';
      if (lastEvaluation.riskLevel === 'high') {
        result = 'Síntomas Graves';
      } else if (lastEvaluation.riskLevel === 'medium') {
        result = 'Síntomas Moderados';
      } else if (lastEvaluation.symptoms && lastEvaluation.symptoms.length > 0) {
        result = 'Síntomas Leves';
      }

      processedLastEvaluation = {
        result,
        date: lastEvaluation.createdAt.toISOString(),
        daysAgo
      };
    }

    const stats = {
      lastEvaluation: processedLastEvaluation,
      totalEvaluations: {
        count: totalCount,
        thisMonth: monthlyCount
      },
      nearbyCases
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return NextResponse.json(
    { error: 'Método no permitido' },
    { status: 405 }
  );
}
