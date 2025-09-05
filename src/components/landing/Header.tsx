"use client";

import { Menu, Shield, X } from "lucide-react";
import { useState } from "react";

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            DengueCero <br />
            <span className="text-sm text-gray-400 font-light">Tumbes</span>
          </h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <a
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-300 font-medium"
            href="#"
          >
            Inicio
          </a>
          <a
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-300 font-medium"
            href="#"
          >
            Prevención
          </a>
          <a
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-300 font-medium"
            href="#"
          >
            Autoevaluación
          </a>
          <a
            className="text-gray-600 hover:text-[var(--color-primary)] transition-colors duration-300 font-medium"
            href="#"
          >
            Mapa de Riesgo
          </a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a
            className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-full transition-colors duration-300"
            href="/iniciar-sesion"
          >
            Iniciar Sesión
          </a>
          <a
            className="bg-[var(--color-primary)] text-white font-bold px-6 py-2.5 rounded-full hover:bg-[var(--color-primary)]/80 transition-colors duration-300 shadow-md hover:shadow-lg transform"
            href="/registrarse"
          >
            Registrarse
          </a>
        </div>
        <button
          className="md:hidden text-gray-800 p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
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
        className={`absolute top-full left-0 right-0 md:hidden bg-white/95 backdrop-blur-lg border-t border-transparent shadow-lg transition-all duration-300 ease-out z-40 ${
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
              href="#"
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
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              Prevención
            </a>
            <a
              className={`text-gray-600 hover:text-[var(--color-primary)] transition-all duration-300 font-medium py-2 border-b border-gray-100 transform ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "300ms" : "0ms" }}
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              Autoevaluación
            </a>
            <a
              className={`text-gray-600 hover:text-[var(--color-primary)] transition-all duration-300 font-medium py-2 border-b border-gray-100 transform ${
                isMenuOpen
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: isMenuOpen ? "400ms" : "0ms" }}
              href="#"
              onClick={() => setIsMenuOpen(false)}
            >
              Mapa de Riesgo
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
              <a
                className="text-gray-600 hover:text-gray-900 font-medium px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300 text-center"
                href="/iniciar-sesion"
                onClick={() => setIsMenuOpen(false)}
              >
                Iniciar Sesión
              </a>
              <a
                className="bg-[var(--color-primary)] text-white font-bold px-4 py-3 rounded-lg hover:bg-[var(--color-primary)]/80 transition-colors duration-300 shadow-md hover:shadow-lg text-center"
                href="/registrarse"
                onClick={() => setIsMenuOpen(false)}
              >
                Registrarse
              </a>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}
export default Header;
