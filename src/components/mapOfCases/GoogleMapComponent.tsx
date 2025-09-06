"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useMapDataCached } from '@/hooks/useMapDataCached';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  filters?: {
    dateFilter?: 'lastWeek' | 'lastMonth' | '3months' | '1year' | 'all';
    riskLevel?: 'all' | 'low' | 'medium' | 'high';
  };
}

// Coordenadas de Tumbes, Perú
const TUMBES_CENTER = { lat: -3.5669, lng: -80.4515 };

export function GoogleMapComponent({ 
  center = TUMBES_CENTER, 
  zoom = 13,
  filters 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  
  // Usar el hook con caché - esto evitará llamadas duplicadas
  const { points, zoneStats, isLoading, error } = useMapDataCached(filters);

  // Función para obtener el ícono del marcador según el riesgo
  const getMarkerIcon = useCallback((risk: string, cases: number) => {
    let color = '#22c55e'; // green
    if (risk === 'medium') color = '#eab308'; // yellow
    if (risk === 'high') color = '#ef4444'; // red

    // Tamaño basado en número de casos
    const size = Math.min(Math.max(20 + cases * 2, 20), 50);

    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 0.8,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: size / 4
    };
  }, []);

  // Crear contenido del InfoWindow
  const createInfoWindowContent = useCallback((point: any): string => {
    const riskLabels: Record<string, string> = {
      low: 'Bajo',
      medium: 'Medio',
      high: 'Alto'
    };

    const riskColors: Record<string, string> = {
      low: '#22c55e',
      medium: '#eab308',
      high: '#ef4444'
    };

    return `
      <div style="padding: 12px; max-width: 250px;">
        <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">
          ${point.address}
        </h3>
        <div style="margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Total de casos:</span>
            <strong>${point.totalCases}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span>Nivel de riesgo:</span>
            <span style="color: ${riskColors[point.dominantRisk] || '#666'}; font-weight: bold;">
              ${riskLabels[point.dominantRisk] || 'Desconocido'}
            </span>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span>Temp. promedio:</span>
            <span>${point.averageTemp.toFixed(1)}°C</span>
          </div>
        </div>
        <div style="font-size: 12px; color: #666;">
          <div>Distribución de riesgo:</div>
          <div style="margin-top: 4px;">
            <span style="color: #22c55e;">● Bajo: ${point.riskLevels.low}</span>
            <span style="color: #eab308; margin-left: 8px;">● Medio: ${point.riskLevels.medium}</span>
            <span style="color: #ef4444; margin-left: 8px;">● Alto: ${point.riskLevels.high}</span>
          </div>
          <div style="margin-top: 8px; color: #888;">
            Última actualización: ${new Date(point.lastUpdate).toLocaleDateString('es-PE')}
          </div>
        </div>
      </div>
    `;
  }, []);

  // Inicializar Google Maps
  useEffect(() => {
    if (!mapRef.current || map) return;

    const initMap = () => {
      const mapInstance = new google.maps.Map(mapRef.current!, {
        center,
        zoom,
        styles: [
          // Estilo personalizado para el mapa
          {
            featureType: 'water',
            elementType: 'geometry',
            stylers: [{ color: '#e9e9e9' }, { lightness: 17 }]
          },
          {
            featureType: 'landscape',
            elementType: 'geometry',
            stylers: [{ color: '#f5f5f5' }, { lightness: 20 }]
          }
        ]
      });

      setMap(mapInstance);
    };

    // Cargar Google Maps API si no está disponible
    if (typeof google === 'undefined') {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [center, zoom, map]);

  // Actualizar marcadores cuando cambien los datos
  useEffect(() => {
    if (!map || !points.length) {
      // Si no hay puntos, limpiar marcadores existentes
      if (markers.length > 0) {
        markers.forEach(marker => marker.setMap(null));
        setMarkers([]);
      }
      return;
    }

    // Limpiar marcadores existentes
    markers.forEach(marker => marker.setMap(null));

    // Crear nuevos marcadores
    const newMarkers = points.map(point => {
      const marker = new google.maps.Marker({
        position: { lat: point.centerLat, lng: point.centerLng },
        map,
        title: `${point.address} - ${point.totalCases} casos`,
        icon: getMarkerIcon(point.dominantRisk, point.totalCases),
      });

      // Crear InfoWindow
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(point)
      });

      // Mostrar información al hacer clic
      marker.addListener('click', () => {
        // Cerrar otras ventanas de información
        newMarkers.forEach(m => {
          const infoW = (m as any).infoWindow;
          if (infoW) infoW.close();
        });
        
        infoWindow.open(map, marker);
      });

      // Guardar referencia al InfoWindow
      (marker as any).infoWindow = infoWindow;

      return marker;
    });

    setMarkers(newMarkers);

    // Ajustar vista para mostrar todos los marcadores
    if (newMarkers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newMarkers.forEach(marker => {
        const position = marker.getPosition();
        if (position) bounds.extend(position);
      });
      map.fitBounds(bounds);
    }

  }, [map, points, getMarkerIcon, createInfoWindowContent]);

  // Refrescar datos cuando cambien los filtros (esto ahora es manejado por Redux)
  useEffect(() => {
    // Ya no necesitamos hacer refetch manual, Redux maneja el cache
    // Los datos se actualizarán automáticamente cuando cambien los filtros
  }, [filters]);

  if (error) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error al cargar el mapa</p>
          <p className="text-gray-500 text-sm mt-1">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto mb-2"></div>
            <p className="text-gray-600">Cargando datos del mapa...</p>
          </div>
        </div>
      )}

      {/* Leyenda */}
      <div className="absolute top-16 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm">
        <h4 className="font-semibold text-sm mb-2 text-gray-900">Leyenda</h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-700">Riesgo Alto</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-700">Riesgo Medio</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-700">Riesgo Bajo</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Total de puntos: {points.length}
        </div>
      </div>
    </div>
  );
}
