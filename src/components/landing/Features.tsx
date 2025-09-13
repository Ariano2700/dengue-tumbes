'use client';

import { useEffect, useRef, useState } from "react";

function Features() {
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
      className="py-16 bg-muted/30"
      role="region"
      aria-labelledby="how-it-works-title"
      itemScope
      itemType="https://schema.org/HowTo"
      id="como-funciona"
    >
      <div className="container mx-auto px-4">
        <div className={`text-center mb-12 transition-all duration-1000 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 translate-y-8'
        }`}>
          <h2 
            id="how-it-works-title"
            className="text-3xl font-bold mb-4"
            itemProp="name"
          >
            ¿Cómo funciona?
          </h2>
          <p 
            className="text-gray-400 text-lg max-w-2xl mx-auto text-balance"
            role="text"
            itemProp="description"
          >
            Tres pasos simples para proteger tu salud y la de tu comunidad
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Línea de tiempo horizontal (desktop) */}
          <div 
            className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gray-300 rounded-full"
            role="presentation"
            aria-label="Línea de progreso horizontal"
          >
            <div 
              className={`h-full bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-warning)] to-[var(--color-tertiary)] rounded-full transition-all duration-3000 ease-out ${
                isVisible ? 'w-full' : 'w-0'
              }`}
              style={{ transitionDelay: '500ms' }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={isVisible ? 100 : 0}
              aria-label="Progreso de los pasos del proceso"
            />
          </div>

          {/* Línea de tiempo vertical (mobile) */}
          <div 
            className="md:hidden absolute left-8 top-0 bottom-0 w-1 bg-gray-300 rounded-full"
            role="presentation"
            aria-label="Línea de progreso vertical"
          >
            <div 
              className={`w-full bg-gradient-to-b from-[var(--color-primary)] via-[var(--color-warning)] to-[var(--color-tertiary)] rounded-full transition-all duration-3000 ease-out ${
                isVisible ? 'h-full' : 'h-0'
              }`}
              style={{ transitionDelay: '500ms' }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={isVisible ? 100 : 0}
              aria-label="Progreso de los pasos del proceso"
            />
          </div>

          <div 
            className="grid md:grid-cols-3 gap-8"
            role="list"
            aria-label="Pasos del proceso de autoevaluación"
          >
            {/* Paso 1 */}
            <article 
              className={`text-center md:text-center flex md:flex-col items-start md:items-center gap-4 md:gap-0 transition-all duration-1000 delay-300 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              role="listitem"
              aria-labelledby="step-1-title"
              itemScope
              itemType="https://schema.org/HowToStep"
            >
              <div 
                className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-0 md:mb-4 transform hover:scale-110 transition-transform duration-200 relative z-10 shadow-lg"
                role="img"
                aria-label="Paso número 1"
              >
                <span className="text-2xl font-bold text-white" aria-hidden="true">1</span>
              </div>
              <div className="flex-1 md:flex-none">
                <h3 
                  id="step-1-title"
                  className="text-xl font-semibold mb-2"
                  itemProp="name"
                >
                  Regístrate
                </h3>
                <p 
                  className="text-gray-400"
                  itemProp="text"
                >
                  Crea tu cuenta de forma rápida y segura para acceder a todas las
                  funciones del sistema de prevención de dengue
                </p>
              </div>
            </article>

            {/* Paso 2 */}
            <article 
              className={`text-center md:text-center flex md:flex-col items-start md:items-center gap-4 md:gap-0 transition-all duration-1000 delay-600 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              role="listitem"
              aria-labelledby="step-2-title"
              itemScope
              itemType="https://schema.org/HowToStep"
            >
              <div 
                className="w-16 h-16 bg-[var(--color-warning)] rounded-full flex items-center justify-center mx-auto mb-0 md:mb-4 transform hover:scale-110 transition-transform duration-200 relative z-10 shadow-lg"
                role="img"
                aria-label="Paso número 2"
              >
                <span className="text-2xl font-bold text-white" aria-hidden="true">
                  2
                </span>
              </div>
              <div className="flex-1 md:flex-none">
                <h3 
                  id="step-2-title"
                  className="text-xl font-semibold mb-2"
                  itemProp="name"
                >
                  Evalúa Signos y Síntomas
                </h3>
                <p 
                  className="text-gray-400"
                  itemProp="text"
                >
                  Completa el formulario de autoevaluación para identificar posibles
                  síntomas de dengue de manera oportuna
                </p>
              </div>
            </article>

            {/* Paso 3 */}
            <article 
              className={`text-center md:text-center flex md:flex-col items-start md:items-center gap-4 md:gap-0 transition-all duration-1000 delay-900 ease-out ${
                isVisible 
                  ? 'opacity-100 translate-y-0' 
                  : 'opacity-0 translate-y-12'
              }`}
              role="listitem"
              aria-labelledby="step-3-title"
              itemScope
              itemType="https://schema.org/HowToStep"
            >
              <div 
                className="w-16 h-16 bg-[var(--color-tertiary)] rounded-full flex items-center justify-center mx-auto mb-0 md:mb-4 transform hover:scale-110 transition-transform duration-200 relative z-10 shadow-lg"
                role="img"
                aria-label="Paso número 3"
              >
                <span className="text-2xl font-bold text-white" aria-hidden="true">3</span>
              </div>
              <div className="flex-1 md:flex-none">
                <h3 
                  id="step-3-title"
                  className="text-xl font-semibold mb-2"
                  itemProp="name"
                >
                  Recibe Orientación
                </h3>
                <p 
                  className="text-gray-400"
                  itemProp="text"
                >
                  Esta información se enviará al MINSA de Tumbes para que recibas la
                  mejor atención médica y monitoreo continuo
                </p>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
export default Features;
