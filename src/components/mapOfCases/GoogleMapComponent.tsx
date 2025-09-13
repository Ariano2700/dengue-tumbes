"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { useMapDataCached } from '@/hooks/useMapDataCached';

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  filters?: {
    dateFilter?: 'lastWeek' | 'lastMonth' | '3months';
    riskLevel?: 'all' | 'low' | 'medium' | 'high';
  };
}

// Coordenadas de Tumbes, Perú
const TUMBES_CENTER = { lat: -3.5669, lng: -80.4515 };

export function GoogleMapComponent({ 
  center = TUMBES_CENTER, 
  zoom = 11, // Cambió de 13 a 11 para mostrar más área
  filters 
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [circles, setCircles] = useState<google.maps.Circle[]>([]);
  
  // Usar el hook con caché - esto evitará llamadas duplicadas
  const { points, zoneStats, isLoading, error } = useMapDataCached(filters);

  // Función para obtener el color del círculo según el riesgo
  const getCircleOptions = useCallback((risk: string, cases: number) => {
    let fillColor = '#22c55e'; // green para bajo (default)
    let strokeColor = '#16a34a';
    
    // Normalizar el valor de riesgo y manejar diferentes variaciones
    const normalizedRisk = risk?.toLowerCase();
    
    if (normalizedRisk === 'medium' || normalizedRisk === 'medio' || normalizedRisk === 'moderate') {
      fillColor = '#eab308'; // yellow para medio
      strokeColor = '#ca8a04';
    } else if (normalizedRisk === 'high' || normalizedRisk === 'alto' || normalizedRisk === 'severe') {
      fillColor = '#ef4444'; // red para alto  
      strokeColor = '#dc2626';
    }
    // Si es 'low', 'bajo', o cualquier otro valor, mantiene verde

    return {
      fillColor,
      fillOpacity: 0.5, // 50% de opacidad
      strokeColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      radius: 200 // 0.2 km en metros
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

  // Actualizar círculos cuando cambien los datos
  useEffect(() => {
    if (!map || !points.length) {
      // Si no hay puntos, limpiar círculos existentes
      if (circles.length > 0) {
        circles.forEach(circle => circle.setMap(null));
        setCircles([]);
      }
      return;
    }

    // Limpiar círculos existentes
    circles.forEach(circle => circle.setMap(null));

    // Crear nuevos círculos
    const newCircles = points.map((point, index) => {      
      const circleOptions = getCircleOptions(point.dominantRisk, point.totalCases);
      
      const circle = new google.maps.Circle({
        center: { lat: point.centerLat, lng: point.centerLng },
        map,
        ...circleOptions
      });

      // Crear InfoWindow
      const infoWindow = new google.maps.InfoWindow({
        content: createInfoWindowContent(point)
      });

      // Mostrar información al hacer clic en el círculo
      circle.addListener('click', (event: google.maps.MapMouseEvent) => {
        // Cerrar otras ventanas de información
        newCircles.forEach(c => {
          const infoW = (c as any).infoWindow;
          if (infoW) infoW.close();
        });
        
        // Posicionar el InfoWindow en el punto clickeado
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
      });

      // Cambiar cursor al pasar sobre el círculo
      circle.addListener('mouseover', () => {
        map.setOptions({ draggableCursor: 'pointer' });
      });
      
      circle.addListener('mouseout', () => {
        map.setOptions({ draggableCursor: null });
      });

      // Guardar referencia al InfoWindow
      (circle as any).infoWindow = infoWindow;

      return circle;
    });

    setCircles(newCircles);

    // Ajustar vista para mostrar todos los círculos
    if (newCircles.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      newCircles.forEach(circle => {
        const center = circle.getCenter();
        if (center) {
          // Expandir bounds para incluir el área del círculo (radio de 0.5km)
          const radius = 0.5 / 111.32; // Aproximadamente 0.5km en grados
          bounds.extend(new google.maps.LatLng(center.lat() + radius, center.lng()));
          bounds.extend(new google.maps.LatLng(center.lat() - radius, center.lng()));
          bounds.extend(new google.maps.LatLng(center.lat(), center.lng() + radius));
          bounds.extend(new google.maps.LatLng(center.lat(), center.lng() - radius));
        }
      });
      map.fitBounds(bounds);
      
      // Limitar el zoom máximo para que no se acerque demasiado
      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        if (map.getZoom()! > 15) {
          map.setZoom(15);
        }
      });
    }

  }, [map, points, getCircleOptions, createInfoWindowContent]);

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
        <h4 className="font-semibold text-sm mb-2 text-gray-900">Zonas de Riesgo</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-red-500/50 border-2 border-red-600 rounded-full"></div>
            <span className="text-gray-700">Riesgo Alto</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-yellow-500/50 border-2 border-yellow-600 rounded-full"></div>
            <span className="text-gray-700">Riesgo Medio</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-4 h-4 bg-green-500/50 border-2 border-green-600 rounded-full"></div>
            <span className="text-gray-700">Riesgo Bajo</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-3 pt-2 border-t border-gray-200">
          <div>Cada círculo = radio de 0.5 km</div>
          <div>Total de zonas: {points.length}</div>
        </div>
      </div>
    </div>
  );
}
