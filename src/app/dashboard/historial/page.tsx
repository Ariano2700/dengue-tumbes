"use client"
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { HistoryDetail } from "@/components/history/HistoryDetail";
import { HistoryFilters } from "@/components/history/HistoryFilters";
import { HistoryList } from "@/components/history/HistoryList";
import { HistoryStats } from "@/components/history/HistoryStats";
import { formatPeruDateTime } from "@/utils/dateUtils";
import { Activity, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";

// Tipos para la API
interface AutoevaluationRecord {
  id: string;
  riskLevel: 'low' | 'medium' | 'high';
  temperature: number;
  daysSick: number;
  location: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
  symptoms: {
    id: string;
    code: string;
    name: string;
    severity: string;
  }[];
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  data: AutoevaluationRecord[];
  pagination: {
    hasNextPage: boolean;
    nextCursor: string | null;
    limit: number;
    currentCount: number;
  };
  filters: {
    dateFilter: string;
    riskLevel: string;
  };
  metadata: {
    totalCount: number;
    riskDistribution: Record<string, number>;
  };
}

// Mapear datos de API a formato de componentes
const mapApiToEvaluationRecord = (item: AutoevaluationRecord) => {
  // Usar las utilidades de fecha para zona horaria de Perú
  const { date, time } = formatPeruDateTime(item.createdAt);
  
  return {
    id: item.id,
    result: getRiskMessage(item.riskLevel),
    riskLevel: item.riskLevel,
    date,
    time,
    symptomsCount: item.symptoms.length,
    symptoms: item.symptoms,
    temperature: item.temperature,
    recommendations: getRiskRecommendations(item.riskLevel),
  };
};

function getRiskMessage(riskLevel: string): string {
  switch (riskLevel) {
    case 'high':
      return 'Alto riesgo de dengue - Buscar atención médica inmediata';
    case 'medium':
      return 'Riesgo moderado - Consultar con médico pronto';
    case 'low':
      return 'Riesgo bajo - Mantener hidratación y reposo';
    default:
      return 'Evaluación completada';
  }
}

function getRiskRecommendations(riskLevel: string): string[] {
  const baseRecommendations = [
    'Mantente bien hidratado bebiendo abundante agua',
    'Descansa y evita actividades físicas intensas',
    'Usa repelente de mosquitos y mosquiteros',
    'Eliminar inservibles'
  ];

  switch (riskLevel) {
    case 'high':
      return [
        'Busca atención médica inmediata',
        'No te automediques con aspirina',
        'Vigila signos de alarma como sangrado',
        ...baseRecommendations
      ];
    case 'medium':
      return [
        'Programa una consulta médica pronto',
        'Monitorea tu temperatura regularmente',
        'Observa si empeoran los síntomas',
        ...baseRecommendations
      ];
    case 'low':
      return [
        'Consulta médico si empeoran los síntomas',
        ...baseRecommendations
      ];
    default:
      return baseRecommendations;
  }
}

export default function HistorialPage() {
  // Estados para filtros
  const [filterPeriod, setFilterPeriod] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  
  // Estados para datos y paginación
  const [autoevaluations, setAutoevaluations] = useState<AutoevaluationRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ApiResponse['metadata'] | null>(null);

  // Cache simple para evitar requests duplicados
  const [cacheKey, setCacheKey] = useState<string>('');

  // Función para crear cache key basado en filtros
  const createCacheKey = useCallback((period: string, risk: string) => {
    return `${period}-${risk}`;
  }, []);

  // Función para obtener datos de la API
  const fetchAutoevaluations = useCallback(async (
    dateFilter: string = 'all',
    riskLevel: string = 'all',
    lastId?: string,
    isLoadMore: boolean = false
  ) => {
    try {
      if (!isLoadMore) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const params = new URLSearchParams({
        limit: '10',
        dateFilter,
        riskLevel,
        ...(lastId && { lastId })
      });

      const response = await fetch(`/api/autoevaluation/getAllAutoevaluation?${params}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar las autoevaluaciones');
      }

      const data: ApiResponse = await response.json();

      if (isLoadMore) {
        // Agregar nuevos datos a los existentes
        setAutoevaluations(prev => [...prev, ...data.data]);
      } else {
        // Reemplazar datos existentes
        setAutoevaluations(data.data);
      }

      setHasNextPage(data.pagination.hasNextPage);
      setNextCursor(data.pagination.nextCursor);
      setMetadata(data.metadata);

      // Actualizar cache key
      setCacheKey(createCacheKey(dateFilter, riskLevel));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [createCacheKey]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchAutoevaluations(filterPeriod, filterRisk);
  }, []);

  // Efecto para cambios de filtros
  useEffect(() => {
    const newCacheKey = createCacheKey(filterPeriod, filterRisk);
    
    // Solo hacer request si cambió algún filtro
    if (newCacheKey !== cacheKey) {
      fetchAutoevaluations(filterPeriod, filterRisk);
    }
  }, [filterPeriod, filterRisk, cacheKey, createCacheKey, fetchAutoevaluations]);

  // Función para cargar más datos (paginación)
  const loadMore = useCallback(() => {
    if (hasNextPage && nextCursor && !loadingMore) {
      fetchAutoevaluations(filterPeriod, filterRisk, nextCursor, true);
    }
  }, [hasNextPage, nextCursor, loadingMore, filterPeriod, filterRisk, fetchAutoevaluations]);

  // Función para refrescar datos
  const refresh = useCallback(() => {
    setCacheKey(''); // Forzar refresh
    fetchAutoevaluations(filterPeriod, filterRisk);
  }, [filterPeriod, filterRisk, fetchAutoevaluations]);

  // Mapear datos para componentes
  const mappedHistory = useMemo(() => {
    return autoevaluations.map(mapApiToEvaluationRecord);
  }, [autoevaluations]);

  return (
    <DashboardLayout
      activeItem="historial"
      title="Historial de Autoevaluaciones"
      description="Revisa tus evaluaciones anteriores"
    >
      {/* Header con botones */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={refresh}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
        
        <Link
          href="/dashboard/autoevaluacion"
          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/90 transition-colors"
        >
          <Activity className="w-4 h-4" />
          Nueva Evaluación
        </Link>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <HistoryFilters
          filterPeriod={filterPeriod}
          filterRisk={filterRisk}
          onPeriodChange={setFilterPeriod}
          onRiskChange={setFilterRisk}
        />
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={refresh}
            className="mt-2 text-sm text-red-600 underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Loading inicial */}
      {loading && autoevaluations.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Cargando autoevaluaciones...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Estadísticas */}
          <div className="mb-6">
            <HistoryStats filteredHistory={mappedHistory} />
          </div>

          {/* Lista de historial */}
          <div className="mb-6">
            <HistoryList
              filteredHistory={mappedHistory}
              onSelectRecord={setSelectedRecord}
            />
          </div>

          {/* Botón cargar más */}
          {hasNextPage && (
            <div className="text-center mb-6">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors flex items-center gap-2 mx-auto"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Cargando más...
                  </>
                ) : (
                  `Cargar más evaluaciones`
                )}
              </button>
              {metadata && (
                <p className="text-sm text-gray-500 mt-2">
                  Mostrando {autoevaluations.length} de {metadata.totalCount} evaluaciones
                </p>
              )}
            </div>
          )}
        </>
      )}

      {/* Modal de detalles */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <HistoryDetail
              selectedRecord={selectedRecord}
              onClose={() => setSelectedRecord(null)}
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
