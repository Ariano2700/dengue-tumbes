"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface UserStats {
  lastEvaluation: {
    result: 'Sin Síntomas' | 'Síntomas Leves' | 'Síntomas Moderados' | 'Síntomas Graves' | 'Riesgo Bajo';
    date: string;
    daysAgo: number;
    color: string;
  } | null;
  totalEvaluations: {
    count: number;
    thisMonth: number;
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
          color: data.lastEvaluation.color || getResultColor(data.lastEvaluation.result)
        } : null,
        totalEvaluations: {
          count: data.totalEvaluations.count || 0,
          thisMonth: data.totalEvaluations.thisMonth || 0
        }
      };

      setStats(processedStats);
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      
      // Datos fallback en caso de error
      setStats({
        lastEvaluation: null,
        totalEvaluations: { count: 0, thisMonth: 0 }
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
      case 'Riesgo Bajo':
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
