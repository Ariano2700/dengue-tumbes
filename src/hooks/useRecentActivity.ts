"use client";

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';

interface RecentActivityItem {
  id: string;
  riskLevel: 'low' | 'medium' | 'high';
  temperature: number;
  daysSick: number;
  symptoms: Array<{
    id: string;
    code: string;
    name: string;
    severity: 'mild' | 'moderate' | 'severe';
  }>;
  createdAt: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
}

interface UseRecentActivityReturn {
  activities: RecentActivityItem[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useRecentActivity(): UseRecentActivityReturn {
  const { user, isAuthenticated } = useAuth();
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecentActivity = async () => {
    if (!isAuthenticated || !user) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Obtener solo las últimas 3 autoevaluaciones de la semana pasada
      const response = await fetch('/api/autoevaluation/getAllAutoevaluation?limit=3&dateFilter=lastWeek', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al cargar actividad reciente');
      }

      const data = await response.json();
      
      if (data.success && Array.isArray(data.data)) {
        setActivities(data.data);
      } else {
        setActivities([]);
      }

    } catch (err) {
      console.error('Error fetching recent activity:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setActivities([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivity();
  }, [isAuthenticated, user]);

  const refetch = async () => {
    await fetchRecentActivity();
  };

  return {
    activities,
    isLoading,
    error,
    refetch
  };
}
