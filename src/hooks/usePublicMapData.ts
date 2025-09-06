"use client";

import { useState, useEffect } from 'react';

interface ZoneStat {
  name: string;
  cases: number;
  lat: number;
  lng: number;
  risk: string;
  details: {
    riskBreakdown: {
      low: number;
      medium: number;
      high: number;
    };
    averageTemperature: number;
    lastUpdate: string;
  };
}

interface ClusterPoint {
  id: string;
  centerLat: number;
  centerLng: number;
  address: string;
  totalCases: number;
  dominantRisk: string;
  riskLevels: {
    low: number;
    medium: number;
    high: number;
  };
  averageTemp: number;
  lastUpdate: string;
}

interface PublicMapData {
  zoneStats: ZoneStat[];
  points: ClusterPoint[];
  isLoading: boolean;
  error: string | null;
  metadata: {
    totalZones: number;
    totalCases: number;
    lastUpdated: string;
    periodCovered: string;
  };
}

export function usePublicMapData(): PublicMapData {
  const [zoneStats, setZoneStats] = useState<ZoneStat[]>([]);
  const [points, setPoints] = useState<ClusterPoint[]>([]);
  const [metadata, setMetadata] = useState({
    totalZones: 0,
    totalCases: 0,
    lastUpdated: new Date().toISOString(),
    periodCovered: "Sin datos"
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPublicMapData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Usar nuestra API pública de clustering
        const response = await fetch('/api/public/map-data', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar datos del mapa');
        }

        const data = await response.json();
        
        // Establecer estadísticas de zonas
        setZoneStats(data.zoneStats || []);
        setMetadata(data.metadata || metadata);

        // Convertir zoneStats a formato de points para el mapa
        const mapPoints: ClusterPoint[] = (data.zoneStats || []).map((zone: ZoneStat, index: number) => ({
          id: `public_cluster_${index}`,
          centerLat: zone.lat,
          centerLng: zone.lng,
          address: zone.name,
          totalCases: zone.cases,
          dominantRisk: zone.risk || 'low',
          riskLevels: zone.details?.riskBreakdown || { low: zone.cases, medium: 0, high: 0 },
          averageTemp: zone.details?.averageTemperature || 37.0,
          lastUpdate: zone.details?.lastUpdate || new Date().toISOString()
        }));

        setPoints(mapPoints);
        
      } catch (err) {
        console.error('Error fetching public map data:', err);
        setError(err instanceof Error ? err.message : 'Error desconocido');
        // NO establecer datos simulados - dejar vacío
        setZoneStats([]);
        setPoints([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublicMapData();
  }, []);

  return { 
    zoneStats, 
    points, 
    isLoading, 
    error, 
    metadata 
  };
}
