"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePublicMapData } from '@/hooks/usePublicMapData';

interface PublicGoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
}

// Coordenadas de Tumbes, Perú
const TUMBES_CENTER = { lat: -3.5669, lng: -80.4515 };

export function PublicGoogleMapComponent({ 
  center = TUMBES_CENTER, 
  zoom = 11
}: PublicGoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [circles, setCircles] = useState<google.maps.Circle[]>([]);
  
  // Usar el hook público
  const { points, isLoading, error, metadata } = usePublicMapData();

  // Función para obtener el color del círculo según el riesgo
  const getCircleOptions = useCallback((risk: string, cases: number) => {
    let fillColor = '#22c55e'; // green para bajo (default)
    let strokeColor = '#16a34a';
    
    // Normalizar el valor de riesgo
    const normalizedRisk = risk?.toLowerCase();
    
    if (normalizedRisk === 'medium' || normalizedRisk === 'medio' || normalizedRisk === 'moderate') {
      fillColor = '#eab308'; // yellow para medio
      strokeColor = '#ca8a04';
    } else if (normalizedRisk === 'high' || normalizedRisk === 'alto' || normalizedRisk === 'severe') {
      fillColor = '#ef4444'; // red para alto  
      strokeColor = '#dc2626';
    }

    return {
      fillColor,
      fillOpacity: 0.5,
      strokeColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      radius: 500 // 0.5 km en metros
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

    // Ajustar vista para mostrar todos los círculos (solo si es el primero/top 1)
    if (newCircles.length > 0) {
      const topCircle = newCircles[0]; // El primero es el top 1
      const topCenter = topCircle.getCenter();
      if (topCenter) {
        // Centrar en el top 1 con zoom apropiado
        map.setCenter(topCenter);
        map.setZoom(14); // Zoom más cercano para destacar el top 1
      }
    }

  }, [map, points, getCircleOptions, createInfoWindowContent]);

  if (error) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">No se han encontrado casos</p>
          <p className="text-gray-500 text-sm mt-1">No hay datos disponibles en este momento</p>
        </div>
      </div>
    );
  }

  // Si no hay puntos pero no hay error (datos vacíos)
  if (!isLoading && points.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 font-medium">No se han encontrado casos</p>
          <p className="text-gray-500 text-sm mt-1">No hay casos reportados en el último mes</p>
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
      {points.length > 0 && (
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
            <div>Total de zonas: {metadata.totalZones}</div>
            <div>Casos totales: {metadata.totalCases}</div>
          </div>
        </div>
      )}
    </div>
  );
}
