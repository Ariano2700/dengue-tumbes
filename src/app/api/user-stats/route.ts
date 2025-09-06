import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { getDaysAgoInPeru, getStartOfMonthInPeru } from '@/utils/dateUtils';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const googleId = session.user.id;
    const userEmail = session.user.email;
    console.log("Google ID de la session:", googleId);
    console.log("Email de la session:", userEmail);

    // Buscar el usuario en la base de datos usando el email
    // porque en NextAuth guardas por email, no por Google ID
    const user = await prisma.user.findUnique({
      where: {
        email: userEmail
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    console.log("Usuario encontrado en la base de datos:", user);

    if (!user) {
      console.log("Usuario no encontrado en la base de datos");
      return NextResponse.json({
        lastEvaluation: null,
        totalEvaluations: { count: 0, thisMonth: 0 }
      });
    }

    const userId = user.id; // Este es el UUID de tu base de datos
    console.log("UUID del usuario en la base de datos:", userId);

    // Ahora obtener las estadísticas completas
    const allEvaluations = await prisma.autoevaluation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        riskLevel: true,
        createdAt: true,
        temperature: true,
        daysSick: true
      }
    });

    console.log('Todas las evaluaciones encontradas:', allEvaluations.length);

    // Obtener la última evaluación
    const lastEvaluation = allEvaluations[0] || null;
    console.log('Última evaluación:', lastEvaluation);

    // Contar evaluaciones de este mes usando zona horaria de Perú
    const startOfMonth = getStartOfMonthInPeru();
    const monthlyEvaluations = allEvaluations.filter(evaluation =>
      new Date(evaluation.createdAt) >= startOfMonth
    );

    console.log('Evaluaciones de este mes:', monthlyEvaluations.length);

    // Procesar última evaluación usando zona horaria de Perú
    let processedLastEvaluation = null;
    if (lastEvaluation) {
      // Usar la función que maneja zona horaria de Perú
      const daysAgo = getDaysAgoInPeru(lastEvaluation.createdAt);

      let result = 'Sin Síntomas';
      let color = 'text-gray-600';

      switch (lastEvaluation.riskLevel) {
        case 'high':
          result = 'Síntomas Graves';
          color = 'text-red-600';
          break;
        case 'medium':
          result = 'Síntomas Moderados';
          color = 'text-yellow-600';
          break;
        case 'low':
          result = 'Riesgo Bajo';
          color = 'text-green-600';
          break;
      }

      processedLastEvaluation = {
        result,
        color,
        date: lastEvaluation.createdAt.toISOString(),
        daysAgo
      };
    }

    const stats = {
      lastEvaluation: processedLastEvaluation,
      totalEvaluations: {
        count: allEvaluations.length,
        thisMonth: monthlyEvaluations.length
      }
    };

    console.log('Estadísticas finales:', stats);

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
