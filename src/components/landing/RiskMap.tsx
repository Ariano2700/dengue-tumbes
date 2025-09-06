'use client';

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PublicGoogleMapComponent } from "@/components/mapOfCases/PublicGoogleMapComponent";
import { usePublicMapData } from "@/hooks/usePublicMapData";

function RiskMap() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const { zoneStats, isLoading, error } = usePublicMapData();

  // Función para determinar tamaño y color del círculo (igual que MapContainer)
  const getCircleProps = (cases: number) => {
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
  };

  // Top 3 de zonas ordenadas por casos
  const topZones = zoneStats
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
    .sort((a, b) => b.cases - a.cases)
    .slice(0, 3); // Top 3 para la landing

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <section 
      ref={sectionRef} 
      id="mapa" 
      className="py-16 bg-background"
      role="region"
      aria-labelledby="risk-map-title"
      itemScope
      itemType="https://schema.org/Map"
    >
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            id="risk-map-title"
            className="text-3xl font-bold mb-4"
            itemProp="name"
          >
            Mapa de Zonas de Riesgo
          </h2>
          <p 
            className="text-muted-foreground text-lg max-w-2xl mx-auto text-balance"
            role="text"
            itemProp="description"
          >
            Visualiza las áreas con mayor incidencia de casos de dengue en
            Tumbes, Perú - Sistema de monitoreo epidemiológico
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Mapa Interactivo Real */}
            <div className="lg:col-span-2">
              <div 
                className={`bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-1000 delay-300 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-12'
                }`}
              >
                <div className="p-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-[var(--color-primary)]" />
                    Mapa en Tiempo Real
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">Casos reportados en el último mes en Tumbes</p>
                </div>
                <div className="aspect-video">
                  <PublicGoogleMapComponent 
                    center={{ lat: -3.5669, lng: -80.4515 }}
                    zoom={13}
                  />
                </div>
              </div>
            </div>

            {/* Top 3 Zonas de Riesgo */}
            <div className="lg:col-span-1">
              <div 
                className={`bg-white rounded-lg border border-gray-200 shadow-sm h-fit transition-all duration-1000 delay-500 ease-out ${
                  isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="p-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-900">Top 3 Zonas de Mayor Riesgo</h4>
                  <p className="text-sm text-gray-600 mt-1">Últimas 4 semanas</p>
                </div>
                <div className="p-4 space-y-3">
                  {isLoading ? (
                    // Skeleton loading
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg animate-pulse">
                          <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
                            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                          </div>
                          <div className="text-2xl font-bold text-gray-300">#{i}</div>
                        </div>
                      ))}
                    </div>
                  ) : topZones.length === 0 ? (
                    // Estado vacío - NO HAY DATOS
                    <div className="text-center py-8">
                      <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 font-medium">No se han encontrado casos</p>
                      <p className="text-gray-500 text-sm mt-1">No hay casos reportados en el último mes</p>
                    </div>
                  ) : (
                    // Lista del top 3
                    topZones.map((zone, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-all duration-300 delay-${(index + 1) * 200} ${
                          isVisible 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 translate-x-4'
                        }`}
                      >
                        <div className={`${zone.size} ${zone.color} rounded-full flex-shrink-0`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm">{zone.name}</p>
                          <p className="text-xs text-gray-600">{zone.cases} casos reportados</p>
                        </div>
                        <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Leyenda de Colores - Solo mostrar si hay datos */}
              {topZones.length > 0 && (
                <div 
                  className={`mt-4 bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-1000 delay-700 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                >
                  <div className="p-4">
                    <h5 className="font-medium text-gray-900 mb-3">Leyenda de Riesgo</h5>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Bajo (1-5 casos)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Medio (6-15 casos)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Alto (16+ casos)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default RiskMap;
