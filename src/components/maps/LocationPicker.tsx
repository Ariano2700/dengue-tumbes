"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Loader2 } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number, address?: string) => void;
  initialLat?: number;
  initialLng?: number;
  height?: string;
}

interface Coordinates {
  lat: number;
  lng: number;
  address?: string;
}

export function LocationPicker({
  onLocationSelect,
  initialLat = -3.5694, // Coordenadas de Tumbes, Perú
  initialLng = -80.4519,
  height = "300px"
}: LocationPickerProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Coordinates | null>(null);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Memorizar la función de callback para evitar re-renders
  const memoizedOnLocationSelect = useCallback(onLocationSelect, []);

  // Inicializar Google Maps
  useEffect(() => {
    // Evitar múltiples inicializaciones
    if (isInitialized) return;
    
    const initializeMap = async () => {
      try {
        if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
          throw new Error('Google Maps API key no configurada');
        }

        const loader = new Loader({
          apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
          version: "weekly",
          libraries: ["places", "geocoding"],
          region: "PE", // Para Perú
          language: "es", // Español
        });

        const google = await loader.load();
        
        if (!mapRef.current) return;

        // Crear el mapa centrado en Tumbes
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: { lat: initialLat, lng: initialLng },
          zoom: 13,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }]
            }
          ]
        });

        // Crear marcador inicial
        const markerInstance = new google.maps.Marker({
          position: { lat: initialLat, lng: initialLng },
          map: mapInstance,
          draggable: true,
          title: "Tu ubicación",
          animation: google.maps.Animation.DROP,
        });

        // Configurar geocoder para obtener direcciones
        const geocoder = new google.maps.Geocoder();

        // Función para obtener dirección desde coordenadas
        const getAddressFromCoords = async (lat: number, lng: number): Promise<string> => {
          try {
            const response = await geocoder.geocode({
              location: { lat, lng }
            });
            
            if (response.results && response.results.length > 0) {
              return response.results[0].formatted_address;
            }
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          } catch (error) {
            console.error('Error al obtener dirección:', error);
            return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
          }
        };

        // Función para actualizar ubicación
        const updateLocation = async (lat: number, lng: number) => {
          const address = await getAddressFromCoords(lat, lng);
          const location = { lat, lng, address };
          setSelectedLocation(location);
          memoizedOnLocationSelect(lat, lng, address);
        };

        // Manejar clic en el mapa
        mapInstance.addListener('click', async (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            
            // Mover el marcador
            markerInstance.setPosition({ lat, lng });
            
            // Actualizar ubicación
            await updateLocation(lat, lng);
          }
        });

        // Manejar arrastre del marcador
        markerInstance.addListener('dragend', async (event: google.maps.MapMouseEvent) => {
          if (event.latLng) {
            const lat = event.latLng.lat();
            const lng = event.latLng.lng();
            
            // Actualizar ubicación
            await updateLocation(lat, lng);
          }
        });

        // Establecer ubicación inicial solo una vez
        await updateLocation(initialLat, initialLng);

        setMap(mapInstance);
        setMarker(markerInstance);
        setError(null);
        setIsInitialized(true);
      } catch (err) {
        console.error('Error inicializando Google Maps:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el mapa');
      } finally {
        setIsLoading(false);
      }
    };

    initializeMap();
  }, []); // Solo ejecutar una vez

  // Obtener ubicación actual del usuario
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Tu navegador no soporta geolocalización');
      return;
    }

    setUseCurrentLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        if (map && marker) {
          // Centrar mapa en la ubicación actual
          map.setCenter({ lat, lng });
          map.setZoom(15);
          
          // Mover marcador
          marker.setPosition({ lat, lng });
          
          // Obtener dirección
          const geocoder = new google.maps.Geocoder();
          geocoder.geocode(
            { location: { lat, lng } },
            (results, status) => {
              const address = status === 'OK' && results?.[0] 
                ? results[0].formatted_address 
                : `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
              
              const location = { lat, lng, address };
              setSelectedLocation(location);
              memoizedOnLocationSelect(lat, lng, address);
            }
          );
        }
        
        setUseCurrentLocation(false);
      },
      (error) => {
        console.error('Error obteniendo ubicación:', error);
        alert('No se pudo obtener tu ubicación actual');
        setUseCurrentLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700 text-sm font-medium">Error al cargar el mapa</p>
        <p className="text-red-600 text-sm mt-1">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-red-600 underline hover:no-underline"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          Ubicación donde te encuentras
        </label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={useCurrentLocation || isLoading}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
        >
          {useCurrentLocation ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              Obteniendo...
            </>
          ) : (
            'Usar mi ubicación'
          )}
        </button>
      </div>
      
      <div className="relative">
        <div
          ref={mapRef}
          style={{ height }}
          className="w-full rounded-lg border border-gray-300 overflow-hidden"
        />
        
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="flex items-center gap-2 text-gray-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Cargando mapa...</span>
            </div>
          </div>
        )}
      </div>

      {selectedLocation && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">Ubicación seleccionada:</p>
          <p className="text-sm text-blue-700 mt-1">{selectedLocation.address}</p>
          <p className="text-xs text-blue-600 mt-1">
            Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Haz clic en el mapa o arrastra el marcador para seleccionar tu ubicación exacta.
      </p>
    </div>
  );
}
