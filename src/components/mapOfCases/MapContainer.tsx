"use client";

import { useState, useCallback, useMemo } from "react";
import { XCircle, AlertTriangle, CheckCircle, MapPin } from "lucide-react";
import { GoogleMapComponent } from "./GoogleMapComponent";
import { MapFilters } from "./MapFilters";
import { CacheIndicator } from "./CacheIndicator";
import { useMapDataCached } from "@/hooks/useMapDataCached";

type MapFilterOptions = {
  dateFilter: 'lastWeek' | 'lastMonth' | '3months';
  riskLevel: 'all' | 'low' | 'medium' | 'high';
};

export function MapContainer() {
  const [filters, setFilters] = useState<MapFilterOptions>({
    dateFilter: 'lastWeek',
    riskLevel: 'all'
  });
  
  // Usar el hook con caché en lugar del hook original
  const { zoneStats, isLoading, refetch } = useMapDataCached(filters);

  // Función para actualizar filtros desde MapFilters
  const handleFiltersChange = useCallback(async (newFilters: Partial<MapFilterOptions>) => {
    setFilters(prevFilters => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      // El refetch ahora usa Redux y caché inteligente
      refetch(updatedFilters);
      return updatedFilters;
    });
  }, [refetch]);

  const getRiskIcon = useCallback((risk: string) => {
    switch (risk) {
      case "Alto":
        return <XCircle className="h-4 w-4" />
      case "Medio":
        return <AlertTriangle className="h-4 w-4" />
      case "Bajo":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <MapPin className="h-4 w-4" />
    }
  }, []);

  const getRiskStyles = useCallback((risk: string) => {
    switch (risk) {
      case "Alto":
        return "bg-red-100 text-red-700 border-red-200"
      case "Medio":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "Bajo":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }, []);

  // Función para determinar tamaño y color del círculo
  const getCircleProps = useCallback((cases: number) => {
    if (cases <= 5) {
      return {
        size: 'w-3 h-3',
        color: 'bg-green-500',
        risk: 'Bajo'
      };
    } else if (cases <= 15) {
      return {
        size: 'w-4 h-4',
        color: 'bg-yellow-500',
        risk: 'Medio'
      };
    } else {
      return {
        size: 'w-5 h-5',
        color: 'bg-red-500',
        risk: 'Alto'
      };
    }
  }, []);

  // Memoizar el top 10 de zonas ordenadas por casos
  const topZones = useMemo(() => {
    return zoneStats
      .map(stat => {
        const circleProps = getCircleProps(stat.cases);
        return {
          name: stat.name,
          cases: stat.cases,
          risk: circleProps.risk,
          color: circleProps.color,
          size: circleProps.size
        };
      })
      .sort((a, b) => b.cases - a.cases) // Ordenar por casos descendente
      .slice(0, 10); // Top 10
  }, [zoneStats, getCircleProps]);

  // Memoizar las coordenadas del centro para evitar re-renders
  const mapCenter = useMemo(() => ({ lat: -3.5669, lng: -80.4515 }), []);

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <MapFilters 
        currentFilters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Mapa y Estadísticas */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Mapa Interactivo de Casos
              </h3>
              <p className="text-sm text-gray-600 mt-1">Distribución de casos de dengue por zonas en Tumbes</p>
            </div>
            <CacheIndicator />
          </div>
        </div>
        <div className="p-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Google Maps Component */}
            <div className="relative">
              <GoogleMapComponent 
                filters={filters}
                center={mapCenter}
                zoom={13}
              />
            </div>

            {/* Lista de Zonas */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Top 10 Zonas por Nivel de Riesgo</h4>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {isLoading ? (
                  // Skeleton loading
                  <div className="space-y-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg animate-pulse">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                          <div>
                            <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                            <div className="h-3 bg-gray-300 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="w-16 h-6 bg-gray-300 rounded"></div>
                      </div>
                    ))}
                  </div>
                ) : topZones.length === 0 ? (
                  // Estado vacío
                  <div className="text-center py-8">
                    <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No hay datos disponibles</p>
                    <p className="text-gray-400 text-sm mt-1">
                      No se encontraron zonas con los filtros aplicados
                    </p>
                  </div>
                ) : (
                  // Lista de zonas con datos reales - Top 5
                  topZones.map((zone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`${zone.size} ${zone.color} rounded-full flex-shrink-0`}></div>
                        <div>
                          <p className="font-medium text-gray-900">{zone.name}</p>
                          <p className="text-sm text-gray-600">{zone.cases} casos reportados</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">#{index + 1}</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border flex items-center gap-1 ${getRiskStyles(zone.risk)}`}>
                          {getRiskIcon(zone.risk)}
                          {zone.risk}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}