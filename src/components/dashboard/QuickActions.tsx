import { History, ScrollText } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Acciones Rápidas</h3>
        <p className="text-sm text-gray-500 mt-1">Realiza una evaluación o revisa tu historial</p>
      </div>
      
      {/* Card Content */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nueva Autoevaluación */}
          <Link 
            href="/dashboard/autoevaluacion" 
            className="flex flex-col items-center justify-center gap-3 h-20 px-4 py-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 group"
          >
            <ScrollText className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">Nueva Autoevaluación</span>
          </Link>
          
          {/* Ver Historial */}
          <Link 
            href="/dashboard/historial" 
            className="flex flex-col items-center justify-center gap-3 h-20 px-4 py-3 bg-transparent border border-gray-300 hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 group"
          >
            <History className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
            <span className="text-sm font-medium">Ver Historial</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
