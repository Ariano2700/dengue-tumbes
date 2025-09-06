'use client';
import { Shield } from "lucide-react";
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
            <span className="material-symbols-outlined bg-[var(--color-primary)] p-2 rounded-lg">
              <Shield className="size-8 text-white" />
            </span>
            <h2 className="text-xl font-bold text-gray-900">
              DengueCero <br />
              <p className="text-sm text-gray-400 font-light">
                Sistema de Prevención de Dengue
              </p>{" "}
            </h2>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              Acerca de
            </Link>
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacidad
            </Link>
            <Link
              href="/contact"
              className="hover:text-foreground transition-colors"
            >
              Contacto
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
