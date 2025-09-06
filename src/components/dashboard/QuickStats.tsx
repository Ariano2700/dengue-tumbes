"use client"
import { Activity, History, MapPin, Loader2 } from "lucide-react"
import { useUserStats } from "@/hooks/useUserStats"

export function QuickStats() {
  const { stats, isLoading, error, formatDaysAgo } = useUserStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-center h-20">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-lg border border-red-200 shadow-sm p-4 md:p-6 col-span-full">
          <div className="text-center">
            <p className="text-red-600 text-sm">Error al cargar estadísticas</p>
            <p className="text-gray-500 text-xs mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6 col-span-full">
          <div className="text-center text-gray-500 text-sm">
            No hay datos disponibles
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Última Evaluación */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6">
        <div className="flex flex-row items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Última Evaluación</h3>
          <Activity className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-1">
          {stats.lastEvaluation ? (
            <>
              <div className={`text-2xl font-bold ${stats.lastEvaluation.color}`}>
                {stats.lastEvaluation.result}
              </div>
              <p className="text-xs text-gray-500">
                {formatDaysAgo(stats.lastEvaluation.daysAgo)}
              </p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold text-gray-400">
                Sin evaluaciones
              </div>
              <p className="text-xs text-gray-500">
                Realiza tu primera autoevaluación
              </p>
            </>
          )}
        </div>
      </div>

      {/* Evaluaciones Totales */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6">
        <div className="flex flex-row items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Evaluaciones Totales</h3>
          <History className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            {stats.totalEvaluations.count}
          </div>
          <p className="text-xs text-gray-500">
            {stats.totalEvaluations.thisMonth > 0 
              ? `${stats.totalEvaluations.thisMonth} este mes`
              : 'Ninguna este mes'
            }
          </p>
        </div>
      </div>

      {/* Casos Cercanos */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 md:p-6">
        <div className="flex flex-row items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Casos Cercanos</h3>
          <MapPin className="h-4 w-4 text-gray-400" />
        </div>
        <div className="space-y-1">
          <div className={`text-2xl font-bold ${stats.nearbyCases.color}`}>
            {stats.nearbyCases.count}
          </div>
          <p className="text-xs text-gray-500">
            En {stats.nearbyCases.zone}
          </p>
        </div>
      </div>
    </div>
  )
}
