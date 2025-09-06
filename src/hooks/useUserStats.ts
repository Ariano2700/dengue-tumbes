"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface UserStats {
  lastEvaluation: {
    result: 'Sin Síntomas' | 'Síntomas Leves' | 'Síntomas Moderados' | 'Síntomas Graves';
    date: string;
    daysAgo: number;
    color: string;
  } | null;
  totalEvaluations: {
    count: number;
    thisMonth: number;
  };
  nearbyCases: {
    count: number;
    zone: string;
    severity: 'low' | 'medium' | 'high';
    color: string;
  };
}

export function useUserStats() {
  const { user, isAuthenticated } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/user-stats', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar estadísticas');
      }

      const data = await response.json();
      
      // Procesar datos de la API
      const processedStats: UserStats = {
        lastEvaluation: data.lastEvaluation ? {
          result: data.lastEvaluation.result,
          date: data.lastEvaluation.date,
          daysAgo: data.lastEvaluation.daysAgo,
          color: getResultColor(data.lastEvaluation.result)
        } : null,
        totalEvaluations: {
          count: data.totalEvaluations.count || 0,
          thisMonth: data.totalEvaluations.thisMonth || 0
        },
        nearbyCases: {
          count: data.nearbyCases.count || 0,
          zone: data.nearbyCases.zone || 'tu zona',
          severity: getSeverityLevel(data.nearbyCases.count),
          color: getCasesColor(data.nearbyCases.count)
        }
      };

      setStats(processedStats);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // Datos fallback en caso de error
      setStats({
        lastEvaluation: null,
        totalEvaluations: { count: 0, thisMonth: 0 },
        nearbyCases: { count: 0, zone: 'tu zona', severity: 'low', color: 'text-green-600' }
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [isAuthenticated, user]);

  const getResultColor = (result: string): string => {
    switch (result) {
      case 'Sin Síntomas':
        return 'text-green-600';
      case 'Síntomas Leves':
        return 'text-yellow-600';
      case 'Síntomas Moderados':
        return 'text-orange-600';
      case 'Síntomas Graves':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSeverityLevel = (count: number): 'low' | 'medium' | 'high' => {
    if (count <= 2) return 'low';
    if (count <= 5) return 'medium';
    return 'high';
  };

  const getCasesColor = (count: number): string => {
    if (count <= 2) return 'text-green-600';
    if (count <= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDaysAgo = (daysAgo: number): string => {
    if (daysAgo === 0) return 'Hoy';
    if (daysAgo === 1) return 'Ayer';
    return `Hace ${daysAgo} días`;
  };

  return {
    stats,
    isLoading,
    error,
    refetch: fetchStats,
    formatDaysAgo
  };
}
