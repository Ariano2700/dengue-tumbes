import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Esta API es pública, no requiere autenticación
    
    // Obtener datos del último mes
    const oneMonthAgo = new Date();
    oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);

    // Obtener todas las autoevaluaciones del último mes con coordenadas
    const recentEvaluations = await prisma.autoevaluation.findMany({
      where: {
        createdAt: {
          gte: oneMonthAgo
        },
        // Solo incluir evaluaciones que tengan ubicación
        latitude: { not: null },
        longitude: { not: null }
      },
      select: {
        id: true,
        riskLevel: true,
        latitude: true,
        longitude: true,
        address: true,
        createdAt: true,
        temperature: true,
        daysSick: true
      }
    });

    // Aplicar el mismo clustering que el API privado
    const clusteredData = clusterNearbyPoints(recentEvaluations);

    // Calcular estadísticas por zona usando la misma lógica
    const allZoneStats = calculateZoneStatistics(clusteredData);

    // Limitar a TOP 3 y ordenar por casos descendente
    const top3ZoneStats = allZoneStats
      .sort((a, b) => b.cases - a.cases)
      .slice(0, 3);

    // NO SIMULAR DATOS - Si no hay datos reales, devolver vacío
    const finalZoneStats = top3ZoneStats;

    const response = {
      success: true,
      zoneStats: finalZoneStats,
      metadata: {
        totalZones: finalZoneStats.length,
        totalCases: finalZoneStats.reduce((sum, zone) => sum + zone.cases, 0),
        lastUpdated: new Date().toISOString(),
        periodCovered: "Último mes (Top 3)"
      }
    };

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.error('Error fetching public map data:', error);
    
    // En caso de error, devolver datos vacíos (sin simular)
    const fallbackData = {
      success: false,
      zoneStats: [],
      metadata: {
        totalZones: 0,
        totalCases: 0,
        lastUpdated: new Date().toISOString(),
        periodCovered: "Sin datos disponibles"
      },
      error: 'Error al obtener datos del servidor'
    };

    return NextResponse.json(fallbackData, { status: 200 });
  }
}

// Función para agrupar puntos cercanos (clustering) - misma lógica que el API privado
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

    // Determinar nivel de riesgo del cluster con la misma lógica mejorada
    const riskEntries = Object.entries(cluster.riskLevels) as [string, number][];
    
    const riskPriority = { high: 3, medium: 2, low: 1 };
    
    const dominantRisk = riskEntries
      .filter(([risk, count]) => count > 0)
      .sort((a, b) => {
        if (b[1] !== a[1]) {
          return b[1] - a[1];
        }
        return riskPriority[b[0] as keyof typeof riskPriority] - riskPriority[a[0] as keyof typeof riskPriority];
      })[0];

    if (cluster.riskLevels.high > 0 && cluster.riskLevels.low > 0 && 
        cluster.riskLevels.high === cluster.riskLevels.low && 
        cluster.riskLevels.medium === 0) {
      (cluster as any).dominantRisk = 'medium';
    } else {
      (cluster as any).dominantRisk = dominantRisk ? dominantRisk[0] : 'low';
    }

    clusters.push(cluster);
  }

  return clusters;
}

// Calcular distancia entre dos puntos en km - misma función
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

// Calcular estadísticas por zona - misma lógica
function calculateZoneStatistics(clusters: any[]) {
  return clusters.map(cluster => ({
    name: cluster.address || `Zona ${cluster.id}`,
    cases: cluster.totalCases,
    risk: cluster.dominantRisk || 'low', // Asegurarse de incluir risk
    lat: cluster.centerLat,
    lng: cluster.centerLng,
    details: {
      riskBreakdown: cluster.riskLevels,
      averageTemperature: Math.round(cluster.averageTemp * 10) / 10,
      lastUpdate: cluster.lastUpdate
    }
  }));
}
