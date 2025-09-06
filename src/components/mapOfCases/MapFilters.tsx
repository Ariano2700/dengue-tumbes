"use client";

import { useState, useEffect, useRef } from "react";
import { Calendar, Filter, MapPin, ChevronDown } from "lucide-react";

interface MapFiltersInterface {
  dateFilter: "lastWeek" | "lastMonth" | "3months";
  riskLevel: "all" | "low" | "medium" | "high";
}

interface MapFiltersProps {
  currentFilters?: MapFiltersInterface;
  onFiltersChange: (newFilters: Partial<MapFiltersInterface>) => Promise<void>;
}

export function MapFilters({
  currentFilters,
  onFiltersChange,
}: MapFiltersProps) {
  const [selectedPeriod, setSelectedPeriod] = useState(
    currentFilters?.dateFilter || "lastWeek"
  );
  const [selectedRisk, setSelectedRisk] = useState(
    currentFilters?.riskLevel || "all"
  );
  const [isPeriodOpen, setIsPeriodOpen] = useState(false);
  const [isRiskOpen, setIsRiskOpen] = useState(false);

  const periodRef = useRef<HTMLDivElement>(null);
  const riskRef = useRef<HTMLDivElement>(null);

  // Sincronizar con los filtros externos
  useEffect(() => {
    if (currentFilters) {
      setSelectedPeriod(currentFilters.dateFilter);
      setSelectedRisk(currentFilters.riskLevel);
    }
  }, [currentFilters]);

  // Cerrar dropdowns cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        periodRef.current &&
        !periodRef.current.contains(event.target as Node)
      ) {
        setIsPeriodOpen(false);
      }
      if (riskRef.current && !riskRef.current.contains(event.target as Node)) {
        setIsRiskOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const periods = [
    { value: "lastWeek" as const, label: "Últimos 7 días" },
    { value: "lastMonth" as const, label: "Últimos 30 días" },
    { value: "3months" as const, label: "Últimos 3 meses" },
  ];

  const riskLevels = [
    { value: "all" as const, label: "Todos los niveles" },
    { value: "high" as const, label: "Riesgo Alto" },
    { value: "medium" as const, label: "Riesgo Medio" },
    { value: "low" as const, label: "Riesgo Bajo" },
  ];

  const getSelectedPeriodLabel = () => {
    return (
      periods.find((p) => p.value === selectedPeriod)?.label ||
      "Seleccionar período"
    );
  };

  const getSelectedRiskLabel = () => {
    return (
      riskLevels.find((r) => r.value === selectedRisk)?.label ||
      "Seleccionar nivel"
    );
  };

  const handleApplyFilters = async () => {
    await onFiltersChange({
      dateFilter: selectedPeriod,
      riskLevel: selectedRisk,
    });
  };

  const handleClearFilters = async () => {
    setSelectedPeriod("lastWeek");
    setSelectedRisk("all");
    await onFiltersChange({
      dateFilter: "lastWeek",
      riskLevel: "all",
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros del Mapa
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Personaliza la visualización de datos en el mapa
        </p>
      </div>
      <div className="p-6">
        <div className="flex flex-wrap gap-4">
          {/* Filtro de Período */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div className="relative" ref={periodRef}>
              <button
                onClick={() => setIsPeriodOpen(!isPeriodOpen)}
                className="w-40 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent hover:border-gray-400 transition-colors flex items-center justify-between"
              >
                <span className="text-sm">{getSelectedPeriodLabel()}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    isPeriodOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isPeriodOpen && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  {periods.map((period) => (
                    <button
                      key={period.value}
                      onClick={() => {
                        setSelectedPeriod(period.value);
                        setIsPeriodOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                        selectedPeriod === period.value
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "text-gray-900"
                      }`}
                    >
                      {period.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filtro de Nivel de Riesgo */}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <div className="relative" ref={riskRef}>
              <button
                onClick={() => setIsRiskOpen(!isRiskOpen)}
                className="w-48 px-3 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent hover:border-gray-400 transition-colors flex items-center justify-between"
              >
                <span className="text-sm">{getSelectedRiskLabel()}</span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-400 transition-transform ${
                    isRiskOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isRiskOpen && (
                <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  {riskLevels.map((risk) => (
                    <button
                      key={risk.value}
                      onClick={() => {
                        setSelectedRisk(risk.value);
                        setIsRiskOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 transition-colors ${
                        selectedRisk === risk.value
                          ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)]"
                          : "text-gray-900"
                      }`}
                    >
                      {risk.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones de Acción */}
          <button
            onClick={handleApplyFilters}
            className="px-3 py-2 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/90 transition-colors font-medium"
          >
            Aplicar Filtros
          </button>

          <button
            onClick={handleClearFilters}
            className="px-3 py-2 text-sm bg-transparent text-gray-700 rounded-md hover:bg-gray-100 transition-colors font-medium"
          >
            Limpiar
          </button>
        </div>

        {/* Badges de Filtros Activos */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            Período: {getSelectedPeriodLabel()}
          </span>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
            Nivel: {getSelectedRiskLabel()}
          </span>
        </div>
      </div>
    </div>
  );
}
