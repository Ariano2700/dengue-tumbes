import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
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

    // Obtener síntomas desde la base de datos
    const symptoms = await prisma.symptom.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        severity: true,
      },
      orderBy: [
        { severity: 'desc' }, // Primero los más severos
        { name: 'asc' }       // Luego alfabéticamente
      ]
    });

    // Formatear la respuesta para que coincida con el frontend
    const formattedSymptoms = symptoms.map(symptom => ({
      id: symptom.code,      // Usar code como id para compatibilidad
      label: symptom.name,   // Usar name como label
      severity: symptom.severity.toLowerCase() as "mild" | "moderate" | "severe",
      dbId: symptom.id       // Mantener el ID real de la BD para referencias
    }));

    return NextResponse.json({
      success: true,
      data: formattedSymptoms,
      count: formattedSymptoms.length,
      user: {
        email: token.email,
        name: token.name
      }
    });

  } catch (error) {
    console.error('Error al obtener síntomas:', error);
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor al obtener síntomas',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}