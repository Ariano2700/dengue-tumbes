"use client";

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

interface MapPoint {
  id: string;
  centerLat: number;
  centerLng: number;
  address: string;
  totalCases: number;
  dominantRisk: 'low' | 'medium' | 'high';
  riskLevels: {
    low: number;
    medium: number;
    high: number;
  };
  averageTemp: number;
  lastUpdate: string;
}

interface ZoneStat {
  name: string;
  cases: number;
  risk: string;
  color: string;
  coordinates: {
    lat: number;
    lng: number;
  };
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

interface MapFilters {
  dateFilter: 'lastWeek' | 'lastMonth' | '3months' | '1year' | 'all';
  riskLevel: 'all' | 'low' | 'medium' | 'high';
}

interface UseMapDataReturn {
  points: MapPoint[];
  zoneStats: ZoneStat[];
  filters: MapFilters & {
    dateRange: {
      from: string;
      to: string;
    };
  };
  metadata: {
    totalPoints: number;
    clusters: number;
    riskDistribution: Record<string, number>;
  };
  isLoading: boolean;
  error: string | null;
  refetch: (newFilters?: Partial<MapFilters>) => Promise<void>;
}

export function useMapData(initialFilters?: Partial<MapFilters>): UseMapDataReturn {
  const { user, isAuthenticated } = useAuth();
  const [data, setData] = useState<{
    points: MapPoint[];
    zoneStats: ZoneStat[];
    filters: any;
    metadata: {
      totalPoints: number;
      clusters: number;
      riskDistribution: Record<string, number>;
    };
  }>({
    points: [],
    zoneStats: [],
    filters: {
      dateFilter: 'lastWeek',
      riskLevel: 'all',
      dateRange: {
        from: '',
        to: ''
      }
    },
    metadata: {
      totalPoints: 0,
      clusters: 0,
      riskDistribution: {}
    }
  });
  const [currentFilters, setCurrentFilters] = useState<MapFilters>(() => ({
    dateFilter: initialFilters?.dateFilter || 'lastWeek',
    riskLevel: initialFilters?.riskLevel || 'all'
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMapData = useCallback(async (filters?: Partial<MapFilters>) => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Usar filtros actuales del estado más cualquier filtro pasado como parámetro
      setCurrentFilters(prevFilters => {
        const newFilters = { ...prevFilters, ...filters };
        return newFilters;
      });

      const filtersToUse = { ...currentFilters, ...filters };

      const params = new URLSearchParams({
        dateFilter: filtersToUse.dateFilter,
        riskLevel: filtersToUse.riskLevel
      });

      const response = await fetch(`/api/map-data?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar datos del mapa');
      }

      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }

    } catch (err) {
      console.error('Error fetching map data:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // Datos fallback en caso de error
      setData({
        points: [],
        zoneStats: [],
        filters: {
          dateFilter: 'lastWeek',
          riskLevel: 'all',
          dateRange: { from: '', to: '' }
        },
        metadata: {
          totalPoints: 0,
          clusters: 0,
          riskDistribution: {}
        }
      });
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    // Solo cargar datos una vez cuando el componente se monta y hay autenticación
    if (isAuthenticated && user) {
      fetchMapData();
    }
  }, [isAuthenticated, user]); // Solo depende de la autenticación

  const refetch = useCallback(async (newFilters?: Partial<MapFilters>) => {
    await fetchMapData(newFilters);
  }, [fetchMapData]);

  return {
    points: data.points,
    zoneStats: data.zoneStats,
    filters: data.filters,
    metadata: data.metadata,
    isLoading,
    error,
    refetch
  };
}
