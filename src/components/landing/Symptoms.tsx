"use client";

import { Activity, AlertTriangle, Shield } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function Symptoms() {
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
        rootMargin: "0px 0px -50px 0px",
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
      className="py-16"
      aria-labelledby="symptoms-title"
      role="region"
    >
      <div className="container mx-auto px-4">
        <div
          className={`text-center mb-8 transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 
            id="symptoms-title"
            className="text-4xl font-bold mb-2 text-neutral-800"
          >
            Síntomas del Dengue
          </h2>
          <p 
            className="text-lg text-neutral-600 max-w-2xl mx-auto"
            role="text"
          >
            Reconoce los síntomas temprano para recibir atención médica oportuna
          </p>
        </div>
        <div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
          role="group"
          aria-label="Información sobre síntomas y prevención del dengue"
        >
          {/* Síntomas Graves */}
          <article
            className={`bg-white border border-red-200 rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all duration-1000 delay-300 ease-out hover:shadow-md transform hover:scale-105 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            role="article"
            aria-labelledby="severe-symptoms-title"
            itemScope
            itemType="https://schema.org/MedicalCondition"
          >
            <div className="flex flex-col items-start mb-4">
              <div 
                className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3"
                role="img"
                aria-label="Icono de alerta para síntomas graves"
              >
                <AlertTriangle className="w-7 h-7 text-red-500" aria-hidden="true" />
              </div>
              <h3 
                id="severe-symptoms-title"
                className="text-lg font-semibold text-red-600 mb-1"
                itemProp="name"
              >
                Síntomas Graves
              </h3>
              <p 
                className="text-sm text-neutral-700 mb-2"
                itemProp="description"
              >
                Requieren atención médica inmediata
              </p>
            </div>
            <ul 
              className="space-y-2 text-base"
              role="list"
              aria-label="Lista de síntomas graves del dengue"
              itemProp="signOrSymptom"
            >
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-red-600 rounded-full inline-block" aria-hidden="true"></span>
                Sangrado de encías o nariz
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-red-600 rounded-full inline-block" aria-hidden="true"></span>
                Vómitos persistentes
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-red-600 rounded-full inline-block" aria-hidden="true"></span>
                Dolor abdominal intenso
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-red-600 rounded-full inline-block" aria-hidden="true"></span>
                Dificultad para respirar
              </li>
            </ul>
          </article>
          {/* Síntomas Comunes */}
          <article
            className={`bg-white border border-yellow-200 rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all duration-1000 delay-600 ease-out hover:shadow-md transform hover:scale-105 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            role="article"
            aria-labelledby="common-symptoms-title"
            itemScope
            itemType="https://schema.org/MedicalCondition"
          >
            <div className="flex flex-col items-start mb-4">
              <div 
                className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3"
                role="img"
                aria-label="Icono de actividad para síntomas comunes"
              >
                <Activity className="w-7 h-7 text-yellow-500" aria-hidden="true" />
              </div>
              <h3 
                id="common-symptoms-title"
                className="text-lg font-semibold text-yellow-600 mb-1"
                itemProp="name"
              >
                Síntomas Comunes
              </h3>
              <p 
                className="text-sm text-neutral-700 mb-2"
                itemProp="description"
              >
                Síntomas típicos del dengue
              </p>
            </div>
            <ul 
              className="space-y-2 text-base"
              role="list"
              aria-label="Lista de síntomas comunes del dengue"
              itemProp="signOrSymptom"
            >
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-yellow-500 rounded-full inline-block" aria-hidden="true"></span>
                Fiebre alta (39°C o más)
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-yellow-500 rounded-full inline-block" aria-hidden="true"></span>
                Dolor de cabeza intenso
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-yellow-500 rounded-full inline-block" aria-hidden="true"></span>
                Dolor muscular y articular
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-yellow-500 rounded-full inline-block" aria-hidden="true"></span>
                Erupción cutánea
              </li>
            </ul>
          </article>
          {/* Prevención */}
          <article
            className={`bg-white border border-green-200 rounded-xl p-6 shadow-sm flex flex-col justify-between transition-all duration-1000 delay-900 ease-out hover:shadow-md transform hover:scale-105 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-12"
            }`}
            role="article"
            aria-labelledby="prevention-title"
            itemScope
            itemType="https://schema.org/MedicalGuideline"
          >
            <div className="flex flex-col items-start mb-4">
              <div 
                className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3"
                role="img"
                aria-label="Icono de escudo para medidas de prevención"
              >
                <Shield className="w-7 h-7 text-green-600" aria-hidden="true" />
              </div>
              <h3 
                id="prevention-title"
                className="text-lg font-semibold text-green-700 mb-1"
                itemProp="name"
              >
                Prevención
              </h3>
              <p 
                className="text-sm text-neutral-700 mb-2"
                itemProp="description"
              >
                Medidas para evitar el dengue
              </p>
            </div>
            <ul 
              className="space-y-2 text-base"
              role="list"
              aria-label="Lista de medidas de prevención del dengue"
              itemProp="guideline"
            >
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-green-600 rounded-full inline-block" aria-hidden="true"></span>
                Eliminar agua estancada
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-green-600 rounded-full inline-block" aria-hidden="true"></span>
                Usar repelente de mosquitos
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-green-600 rounded-full inline-block" aria-hidden="true"></span>
                Mantener limpios los recipientes
              </li>
              <li className="flex items-center gap-2" role="listitem">
                <span className="w-2 h-2 bg-green-600 rounded-full inline-block" aria-hidden="true"></span>
                Usar ropa de manga larga
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>
  );
}
export default Symptoms;
