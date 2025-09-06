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

    // Obtener parámetros de query para filtros
    const { searchParams } = new URL(request.url);
    const dateFilter = searchParams.get('dateFilter') || 'lastWeek';
    const riskLevel = searchParams.get('riskLevel') || 'all';

    // Calcular rango de fechas
    const now = new Date();
    let dateFrom = new Date();
    
    switch (dateFilter) {
      case 'lastWeek':
        dateFrom = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'lastMonth':
        dateFrom = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '3months':
        dateFrom = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1year':
        dateFrom = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFrom = new Date(0); // All time
    }

    // Construir condiciones WHERE
    const whereConditions: any = {
      createdAt: {
        gte: dateFrom
      },
      // Solo autoevaluaciones que tienen coordenadas
      latitude: { not: null },
      longitude: { not: null }
    };

    // Filtrar por nivel de riesgo si se especifica
    if (riskLevel !== 'all') {
      whereConditions.riskLevel = riskLevel;
    }

    // Obtener autoevaluaciones con coordenadas
    const autoevaluations = await prisma.autoevaluation.findMany({
      where: whereConditions,
      select: {
        id: true,
        riskLevel: true,
        latitude: true,
        longitude: true,
        address: true,
        createdAt: true,
        temperature: true,
        daysSick: true,
        symptoms: {
          include: {
            symptom: {
              select: {
                name: true,
                severity: true
              }
            }
          }
        },
        user: {
          select: {
            firstName: true,
            lastName: true
          }
        }
      }
    });

    // Agrupar por coordenadas cercanas (para crear clusters)
    const clusteredData = clusterNearbyPoints(autoevaluations);

    // Calcular estadísticas por zona
    const zoneStats = calculateZoneStatistics(clusteredData);

    return NextResponse.json({
      success: true,
      data: {
        points: clusteredData,
        zoneStats,
        filters: {
          dateFilter,
          riskLevel,
          dateRange: {
            from: dateFrom.toISOString(),
            to: now.toISOString()
          }
        },
        metadata: {
          totalPoints: autoevaluations.length,
          clusters: clusteredData.length,
          riskDistribution: getRiskDistribution(autoevaluations)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching map data:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Función para agrupar puntos cercanos (clustering)
function clusterNearbyPoints(evaluations: any[], radiusKm = 0.5) {
  const clusters = [];
  const processed = new Set();

  for (let i = 0; i < evaluations.length; i++) {
    if (processed.has(evaluations[i].id)) continue;

    const cluster = {
      id: `cluster_${i}`,
      centerLat: evaluations[i].latitude,
      centerLng: evaluations[i].longitude,
      address: evaluations[i].address || `Zona ${i + 1}`,
      evaluations: [evaluations[i]],
      riskLevels: { low: 0, medium: 0, high: 0 },
      totalCases: 1,
      averageTemp: evaluations[i].temperature,
      lastUpdate: evaluations[i].createdAt
    };

    processed.add(evaluations[i].id);

    // Buscar puntos cercanos
    for (let j = i + 1; j < evaluations.length; j++) {
      if (processed.has(evaluations[j].id)) continue;

      const distance = calculateDistance(
        evaluations[i].latitude,
        evaluations[i].longitude,
        evaluations[j].latitude,
        evaluations[j].longitude
      );

      if (distance <= radiusKm) {
        cluster.evaluations.push(evaluations[j]);
        cluster.totalCases++;
        processed.add(evaluations[j].id);
      }
    }

    // Calcular estadísticas del cluster
    cluster.riskLevels = cluster.evaluations.reduce((acc, evaluation) => {
      acc[evaluation.riskLevel]++;
      return acc;
    }, { low: 0, medium: 0, high: 0 });

    cluster.averageTemp = cluster.evaluations.reduce((sum, evaluation) => sum + evaluation.temperature, 0) / cluster.evaluations.length;

    // Determinar nivel de riesgo del cluster con lógica mejorada
    const riskEntries = Object.entries(cluster.riskLevels) as [string, number][];
    
    // Ordenar por cantidad (descendente) y luego por prioridad de riesgo
    const riskPriority = { high: 3, medium: 2, low: 1 };
    
    const dominantRisk = riskEntries
      .filter(([risk, count]) => count > 0) // Solo considerar riesgos con casos
      .sort((a, b) => {
        // Primero ordenar por cantidad de casos (descendente)
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }
        // En caso de empate, ordenar por prioridad de riesgo (descendente)
        return riskPriority[b[0] as keyof typeof riskPriority] - riskPriority[a[0] as keyof typeof riskPriority];
      })[0];

    // Si hay empate entre riesgo alto y bajo (como en tu ejemplo), elegir el intermedio
    if (cluster.riskLevels.high > 0 && cluster.riskLevels.low > 0 && 
        cluster.riskLevels.high === cluster.riskLevels.low && 
        cluster.riskLevels.medium === 0) {
      (cluster as any).dominantRisk = 'medium'; // Promedio entre alto y bajo
    } else {
      (cluster as any).dominantRisk = dominantRisk ? dominantRisk[0] : 'low';
    }

    clusters.push(cluster);
  }

  return clusters;
}

// Calcular distancia entre dos puntos en km
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Radio de la Tierra en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Calcular estadísticas por zona
function calculateZoneStatistics(clusters: any[]) {
  return clusters.map(cluster => ({
    name: cluster.address || `Zona ${cluster.id}`,
    cases: cluster.totalCases,
    risk: cluster.dominantRisk,
    color: getRiskColor(cluster.dominantRisk),
    coordinates: {
      lat: cluster.centerLat,
      lng: cluster.centerLng
    },
    details: {
      riskBreakdown: cluster.riskLevels,
      averageTemperature: Math.round(cluster.averageTemp * 10) / 10,
      lastUpdate: cluster.lastUpdate
    }
  }));
}

// Obtener color según nivel de riesgo
function getRiskColor(riskLevel: string): string {
  switch (riskLevel) {
    case 'high': return '#ef4444'; // red-500
    case 'medium': return '#eab308'; // yellow-500
    case 'low': return '#22c55e'; // green-500
    default: return '#6b7280'; // gray-500
  }
}

// Calcular distribución de riesgo
function getRiskDistribution(evaluations: any[]) {
  return evaluations.reduce((acc, evaluation) => {
    acc[evaluation.riskLevel] = (acc[evaluation.riskLevel] || 0) + 1;
    return acc;
  }, {});
}
