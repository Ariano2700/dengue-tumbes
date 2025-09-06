import React from 'react';
import { Filter, Download, ChevronDown } from 'lucide-react';

interface HistoryFiltersProps {
  filterPeriod: string
  filterRisk: string
  onPeriodChange: (value: string) => void
  onRiskChange: (value: string) => void
}

export function HistoryFilters({ filterPeriod, filterRisk, onPeriodChange, onRiskChange }: HistoryFiltersProps) {
  return (
    <div className="lg:col-span-4 bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filtros
        </h3>
      </div>
      
      {/* Card Content */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap gap-4">
          <div className="space-y-2">
            <label htmlFor="period" className="text-sm font-medium text-gray-700">
              Período
            </label>
            <div className="relative">
              <select
                id="period"
                value={filterPeriod}
                onChange={(e) => onPeriodChange(e.target.value)}
                className="w-40 px-3 py-2 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="lastWeek">Última semana</option>
                <option value="lastMonth">Último mes</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="risk" className="text-sm font-medium text-gray-700">
              Nivel de Riesgo
            </label>
            <div className="relative">
              <select
                id="risk"
                value={filterRisk}
                onChange={(e) => onRiskChange(e.target.value)}
                className="w-40 px-3 py-2 pr-8 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none cursor-pointer"
              >
                <option value="all">Todos</option>
                <option value="low">Riesgo Bajo</option>
                <option value="medium">Riesgo Moderado</option>
                <option value="high">Alto Riesgo</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* <div className="flex items-end">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md bg-transparent text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Exportar
            </button>
          </div> */}
        </div>
      </div>
    </div>
  )
}