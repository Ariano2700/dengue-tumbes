"use client";

import { Menu, Shield, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined bg-[var(--color-primary)] p-2 rounded-lg">
            <Shield className="size-8 text-white" />
          </span>
          <h2 className="text-xl font-bold text-gray-900">
            Dengue Cero <br />
            <span className="text-sm text-gray-400 font-light">Tumbes</span>
          </h2>
        </div>
        <nav className="hidden lg:flex items-center gap-8">
          <a
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-300 font-medium"
            href="#inicio"
            aria-label="Ir a la sección de inicio"
            title="Ir a la sección de inicio"
          >
            Inicio
          </a>
          <a
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-300 font-medium"
            href="#sintomas"
            aria-label="Ir a la sección de síntomas"
            title="Ir a la sección de síntomas"
          >
            Síntomas
          </a>
          <a
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-300 font-medium"
            href="#mapa"
            aria-label="Ir a la sección del mapa de riesgo"
            title="Ir a la sección del mapa de riesgo"
          >
            Mapa de Riesgo
          </a>
          <a
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-300 font-medium"
            href="#como-funciona"
            aria-label="Ir a la sección de cómo funciona"
            title="Ir a la sección de cómo funciona"
          >
            Como funciona
          </a>
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          {isLoading ? (
            <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
          ) : isAuthenticated ? (
            <a
              className="bg-[var(--color-primary)] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[var(--color-primary)]/80 transition-colors duration-300 shadow-md hover:shadow-lg transform"
              href="/dashboard"
              aria-label="Ir al panel principal"
              title="Ir al panel principal"
            >
              Ir al panel principal
            </a>
          ) : (
            <>
              <a
                className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-full transition-colors duration-300"
                href="/iniciar-sesion"
                aria-label="Iniciar sesión"
                title="Iniciar sesión"
              >
                Iniciar Sesión
              </a>
              <a
                className="bg-[var(--color-primary)] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[var(--color-primary)]/80 transition-colors duration-300 shadow-md hover:shadow-lg transform"
                href="/registrarse"
                aria-label="Registrarse"
                title="Registrarse"
              >
                Registrarse
              </a>
            </>
          )}
        </div>
        <button
          className="lg:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span
            className={`material-symbols-outlined text-3xl transition-transform duration-300 ${
              isMenuOpen ? "rotate-180" : "rotate-0"
            }`}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </span>
        </button>
      </div>

      {/* Menú Mobile */}
      <div
        className={`absolute top-full left-0 right-0 lg:hidden bg-white/95 backdrop-blur-lg border-t border-transparent shadow-lg transition-all duration-300 ease-out z-40 ${
          isMenuOpen
            ? "max-h-[500px] opacity-100 visible"
            : "max-h-0 opacity-0 invisible overflow-hidden"
        }`}
      >
        <nav className="container mx-auto px-6 py-4">
          <div className="flex flex-col gap-4">
            <a
              className={`text-gray-600 hover:text-[var(--color-primary)] transition-all duration-300 font-medium py-2 border-b border-gray-100 transform ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "100ms" : "0ms" }}
              href="#inicio"
              aria-label="Ir a la sección de inicio"
              title="Ir a la sección de inicio"
              onClick={() => setIsMenuOpen(false)}
            >
              Inicio
            </a>
            <a
              className={`text-gray-600 hover:text-[var(--color-primary)] transition-all duration-300 font-medium py-2 border-b border-gray-100 transform ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "200ms" : "0ms" }}
              href="#sintomas"
              aria-label="Ir a la sección de síntomas"
              title="Ir a la sección de síntomas"
              onClick={() => setIsMenuOpen(false)}
            >
              Síntomas
            </a>
            <a
              className={`text-gray-600 hover:text-[var(--color-primary)] transition-all duration-300 font-medium py-2 border-b border-gray-100 transform ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "400ms" : "0ms" }}
              href="#mapa"
              aria-label="Ir a la sección del mapa de riesgo"
              title="Ir a la sección del mapa de riesgo"
              onClick={() => setIsMenuOpen(false)}
            >
              Mapa de Riesgo
            </a>
            <a
              className={`text-gray-600 hover:text-[var(--color-primary)] transition-all duration-300 font-medium py-2 border-b border-gray-100 transform ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "300ms" : "0ms" }}
              href="#como-funciona"
              aria-label="Ir a la sección de cómo funciona"
              title="Ir a la sección de cómo funciona"
              onClick={() => setIsMenuOpen(false)}
            >
              Como funciona
            </a>

            {/* Botones de acción en mobile */}
            <div
              className={`flex flex-col gap-3 mt-4 pt-4 border-t border-gray-200 transform ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "500ms" : "0ms" }}
            >
              {isLoading ? (
                <div className="flex justify-center py-3">
                  <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
                </div>
              ) : isAuthenticated ? (
                <a
                  className="bg-[var(--color-primary)] text-white font-bold px-4 py-3 rounded-lg hover:bg-[var(--color-primary)]/80 transition-colors duration-300 shadow-md hover:shadow-lg text-center"
                  href="/dashboard"
                  aria-label="Ir al panel principal"
                  title="Ir al panel principal"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Ir al panel principal
                </a>
              ) : (
                <>
                  <a
                    className="text-gray-600 hover:text-gray-900 font-medium px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300 text-center"
                    href="/iniciar-sesion"
                    aria-label="Iniciar sesión"
                    title="Iniciar sesión"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </a>
                  <a
                    className="bg-[var(--color-primary)] text-white font-bold px-4 py-3 rounded-lg hover:bg-[var(--color-primary)]/80 transition-colors duration-300 shadow-md hover:shadow-lg text-center"
                    href="/registrarse"
                    aria-label="Registrarse"
                    title="Registrarse"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrarse
                  </a>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
export default Header;
