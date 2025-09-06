import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { RiskLevel } from '@prisma/client';

// Tipos para los filtros
type DateFilter = 'all' | 'lastWeek' | 'lastMonth';
type RiskLevelFilter = 'all' | 'low' | 'medium' | 'high';

interface QueryParams {
  limit?: string;
  lastId?: string;
  dateFilter?: DateFilter;
  riskLevel?: RiskLevelFilter;
}

// Función para obtener el rango de fechas según el filtro
function getDateRange(filter: DateFilter): Date | null {
  const now = new Date();
  
  switch (filter) {
    case 'lastWeek':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'lastMonth':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'all':
    default:
      return null;
  }
}

// Función para validar el nivel de riesgo
function isValidRiskLevel(level: string): level is RiskLevel {
  return ['low', 'medium', 'high'].includes(level);
}

export async function GET(req: NextRequest) {
  try {
    // Validar JWT token
    const token = await getToken({ 
      req, 
      secret: process.env.NEXTAUTH_SECRET 
    });

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized. JWT token required.' }, 
        { status: 401 }
      );
    }

    // Verificar que el token tenga email (usuario válido)
    if (!token.email) {
      return NextResponse.json(
        { error: 'Invalid JWT token. Email required.' }, 
        { status: 401 }
      );
    }

    // Buscar al usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { email: token.email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Obtener parámetros de query
    const { searchParams } = new URL(req.url);
    const queryParams: QueryParams = {
      limit: searchParams.get('limit') ?? '10',
      lastId: searchParams.get('lastId') ?? undefined,
      dateFilter: (searchParams.get('dateFilter') as DateFilter) ?? 'all',
      riskLevel: (searchParams.get('riskLevel') as RiskLevelFilter) ?? 'all',
    };

    // Validar limit
    const limit = parseInt(queryParams.limit!);
    if (isNaN(limit) || limit <= 0 || limit > 100) {
      return NextResponse.json(
        { error: 'Invalid limit. Must be between 1 and 100.' },
        { status: 400 }
      );
    }

    // Validar dateFilter
    if (!['all', 'lastWeek', 'lastMonth'].includes(queryParams.dateFilter!)) {
      return NextResponse.json(
        { error: 'Invalid dateFilter. Must be: all, lastWeek, or lastMonth.' },
        { status: 400 }
      );
    }

    // Validar riskLevel
    if (!['all', 'low', 'medium', 'high'].includes(queryParams.riskLevel!)) {
      return NextResponse.json(
        { error: 'Invalid riskLevel. Must be: all, low, medium, or high.' },
        { status: 400 }
      );
    }

    // Construir condiciones WHERE
    const whereConditions: any = {
      userId: user.id,
    };

    // Filtro de fecha
    const dateFrom = getDateRange(queryParams.dateFilter!);
    if (dateFrom) {
      whereConditions.createdAt = {
        gte: dateFrom,
      };
    }

    // Filtro de nivel de riesgo
    if (queryParams.riskLevel !== 'all') {
      whereConditions.riskLevel = queryParams.riskLevel as RiskLevel;
    }

    // Paginación basada en cursor
    if (queryParams.lastId) {
      whereConditions.id = {
        lt: queryParams.lastId, // Menor que el último ID para orden descendente
      };
    }

    // Ejecutar consulta
    const autoevaluations = await prisma.autoevaluation.findMany({
      where: whereConditions,
      include: {
        symptoms: {
          include: {
            symptom: {
              select: {
                id: true,
                code: true,
                name: true,
                severity: true,
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc', // Más recientes primero
      },
      take: limit + 1, // +1 para saber si hay más páginas
    });

    // Separar datos y determinar si hay siguiente página
    const hasNextPage = autoevaluations.length > limit;
    const data = hasNextPage ? autoevaluations.slice(0, -1) : autoevaluations;
    const nextCursor = hasNextPage ? data[data.length - 1]?.id : null;

    // Formatear respuesta
    const formattedData = data.map(autoeval => ({
      id: autoeval.id,
      riskLevel: autoeval.riskLevel,
      temperature: autoeval.temperature,
      daysSick: autoeval.daysSick,
      location: autoeval.latitude && autoeval.longitude ? {
        lat: autoeval.latitude,
        lng: autoeval.longitude,
        address: autoeval.address
      } : null,
      symptoms: autoeval.symptoms.map(as => ({
        id: as.symptom.id,
        code: as.symptom.code,
        name: as.symptom.name,
        severity: as.symptom.severity
      })),
      createdAt: autoeval.createdAt,
    }));

    // Estadísticas adicionales (opcional pero útil)
    const totalCount = await prisma.autoevaluation.count({
      where: {
        userId: user.id,
        ...(dateFrom && { createdAt: { gte: dateFrom } }),
        ...(queryParams.riskLevel !== 'all' && { riskLevel: queryParams.riskLevel as RiskLevel }),
      }
    });

    // Distribución por nivel de riesgo (para el período filtrado)
    const riskDistribution = await prisma.autoevaluation.groupBy({
      by: ['riskLevel'],
      where: {
        userId: user.id,
        ...(dateFrom && { createdAt: { gte: dateFrom } }),
      },
      _count: {
        riskLevel: true,
      }
    });

    const response = {
      success: true,
      data: formattedData,
      pagination: {
        hasNextPage,
        nextCursor,
        limit,
        currentCount: data.length,
      },
      filters: {
        dateFilter: queryParams.dateFilter,
        riskLevel: queryParams.riskLevel,
        appliedDateRange: dateFrom ? {
          from: dateFrom.toISOString(),
          to: new Date().toISOString(),
        } : null,
      },
      metadata: {
        totalCount,
        riskDistribution: riskDistribution.reduce((acc, item) => {
          acc[item.riskLevel] = item._count.riskLevel;
          return acc;
        }, {} as Record<RiskLevel, number>),
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    //console.error('Error fetching autoevaluations:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error while fetching autoevaluations',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      }, 
      { status: 500 }
    );
  }
}