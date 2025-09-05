'use client';

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function RiskMap() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

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

        <div className="max-w-4xl mx-auto">
          <div className="p-0">
            <div 
              className={`aspect-video bg-gradient-to-br from-dengue-info/10 to-dengue-info/5 rounded-lg flex items-center justify-center relative overflow-hidden transition-all duration-1000 delay-300 ease-out transform hover:scale-[1.02] ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              role="img"
              aria-labelledby="interactive-map-title"
              itemScope
              itemType="https://schema.org/ImageObject"
            >
              <div 
                className="absolute inset-0 bg-[url('/tumbes_mapa.png')] bg-cover bg-center opacity-20"
                role="presentation"
                aria-hidden="true"
                itemProp="contentUrl"
                content="/tumbes_mapa.png"
              ></div>
              <div className={`relative z-10 text-center p-8 transition-all duration-1000 delay-600 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-8'
              }`}>
                <div
                  role="img"
                  aria-label="Icono de ubicación para mapa interactivo"
                >
                  <MapPin className={`w-16 h-16 text-dengue-info mx-auto mb-4 transition-all duration-1000 delay-800 ease-out transform ${
                    isVisible 
                      ? 'opacity-100 scale-100 rotate-0' 
                      : 'opacity-0 scale-75 rotate-12'
                  }`} aria-hidden="true" />
                </div>
                <h3 
                  id="interactive-map-title"
                  className={`text-xl font-semibold mb-2 transition-all duration-1000 delay-900 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  itemProp="name"
                >
                  Mapa Interactivo
                </h3>
                <p 
                  className={`text-muted-foreground mb-4 transition-all duration-1000 delay-1000 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  role="text"
                  itemProp="description"
                >
                  Próximamente: Mapa en tiempo real con casos reportados de dengue en Tumbes
                </p>
                <div 
                  className={`flex flex-wrap gap-2 justify-center transition-all duration-1000 delay-1100 ease-out ${
                    isVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-6'
                  }`}
                  role="group"
                  aria-label="Leyenda de niveles de riesgo de dengue"
                >
                  <div 
                    className={`bg-[var(--color-alert)] text-white rounded-xl px-4 py-1 transform hover:scale-110 transition-transform duration-200 ${
                      isVisible ? 'animate-pulse' : ''
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label="Zona de alto riesgo de dengue"
                    title="Alto Riesgo - Áreas con mayor incidencia de casos de dengue"
                    itemScope
                    itemType="https://schema.org/LocationFeatureSpecification"
                  >
                    <span itemProp="name">Alto Riesgo</span>
                  </div>
                  <div 
                    className={`bg-[var(--color-warning)] text-white rounded-xl px-4 py-1 transform hover:scale-110 transition-transform duration-200 ${
                      isVisible ? 'animate-pulse' : ''
                    }`} 
                    style={{animationDelay: '0.2s'}}
                    role="button"
                    tabIndex={0}
                    aria-label="Zona de riesgo moderado de dengue"
                    title="Riesgo Moderado - Áreas con incidencia media de casos de dengue"
                    itemScope
                    itemType="https://schema.org/LocationFeatureSpecification"
                  >
                    <span itemProp="name">Riesgo Moderado</span>
                  </div>
                  <div 
                    className={`bg-[var(--color-tertiary)] text-white rounded-xl px-4 py-1 transform hover:scale-110 transition-transform duration-200 ${
                      isVisible ? 'animate-pulse' : ''
                    }`} 
                    style={{animationDelay: '0.4s'}}
                    role="button"
                    tabIndex={0}
                    aria-label="Zona de bajo riesgo de dengue"
                    title="Bajo Riesgo - Áreas con menor incidencia de casos de dengue"
                    itemScope
                    itemType="https://schema.org/LocationFeatureSpecification"
                  >
                    <span itemProp="name">Bajo Riesgo</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default RiskMap;
