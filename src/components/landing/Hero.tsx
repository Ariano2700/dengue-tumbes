"use client";

import { Activity, MapPin } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function Hero() {
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
      id="inicio"
      className="py-12 md:py-20 bg-gradient-to-br from-background to-muted/30 relative"
      aria-labelledby="hero-title"
      role="banner"
    >
      {/* Imagen de fondo con overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/bg-hero.png')" }}
        aria-hidden="true"
      ></div>
      <div className="absolute inset-0 bg-black/70" aria-hidden="true"></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div
          className={`max-w-3xl mx-auto transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h1
            id="hero-title"
            className={`text-white text-4xl md:text-6xl font-bold text-balance mb-6 transition-all duration-1000 delay-200 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            Protege a tu comunidad del{" "}
            <span className="text-[var(--color-primary)]">dengue </span>
            con Dengue Cero Tumbes
          </h1>
          <p
            className={`text-xl text-gray-300 text-balance mb-8 leading-relaxed transition-all duration-1000 delay-400 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            role="text"
          >
            Sistema web para prevención, autoevaluación de síntomas y monitoreo
            de casos de dengue en la región Tumbes, Perú.
          </p>
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-1000 delay-600 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
            role="group"
            aria-label="Acciones principales"
          >
            <button
              className={`bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80 transition-all ease-in-out duration-200 rounded-xl transform hover:scale-105 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              type="button"
              aria-label="Ir a autoevaluación de síntomas de dengue"
              title="Comenzar autoevaluación de síntomas de dengue"
            >
              <Link
                className="text-white flex items-center justify-center gap-3 p-3"
                href="/registrarse"
                title="Comenzar autoevaluación de síntomas de dengue"
                aria-label="Comenzar autoevaluación de síntomas de dengue"
              >
                <Activity className="w-5 h-5 mr-2" aria-hidden="true" />
                Comenzar Autoevaluación
              </Link>
            </button>
            <button
              className={`bg-white hover:bg-gray-100 border border-gray-300 transition-all ease-in-out duration-200 rounded-xl transform hover:scale-105 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
              type="button"
              aria-label="Ver mapa de casos de dengue en Tumbes"
              title="Ver mapa de casos de dengue en Tumbes"
            >
              <Link
                href="#mapa"
                className="text-gray-800 flex items-center justify-center gap-3 p-3"
                title="Ver mapa de casos de dengue en Tumbes"
                aria-label="Ver mapa de casos de dengue en Tumbes"
              >
                <MapPin className="w-5 h-5 mr-2" aria-hidden="true" />
                Ver Mapa de Casos
              </Link>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Hero;
