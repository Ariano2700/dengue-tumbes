'use client';
import { Shield } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from 'react';

function Footer() {
  const [year, setYear] = useState<number | null>(null);
  
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <footer className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
          <Image
            src="/icono-dengue-cero.png"
            alt="Dengue Cero Tumbes"
            title="Dengue Cero Tumbes"
            priority
            className="size-16 rounded-2xl"
            width={120}
            height={120}
          />
            <h2 className="text-xl font-bold text-gray-900">
              Dengue Cero <br />
              <p className="text-sm text-gray-400 font-light">
                Sistema de Prevención de Dengue
              </p>{" "}
            </h2>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link
              href="/about"
              aria-label="Ir a la sección de acerca de"
              title="Ir a la sección de acerca de"
              className="hover:text-foreground transition-colors"
            >
              Acerca de
            </Link>
            <Link
              href="/privacy"
              aria-label="Ir a la sección de privacidad"
              title="Ir a la sección de privacidad"
              className="hover:text-foreground transition-colors"
            >
              Privacidad
            </Link>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-400">
          <p>
            © {year || '2025'} Dengue Cero Tumbes. Desarrollado para la prevención del
            dengue en la región Tumbes, Perú.
          </p>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
