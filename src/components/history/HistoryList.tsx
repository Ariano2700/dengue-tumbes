import React from "react"
import Link from "next/link"
import { Activity, AlertTriangle, CheckCircle, Eye, History, Calendar } from "lucide-react"
import { formatPeruDateTime } from "@/utils/dateUtils"

interface EvaluationRecord {
  id: string
  result: string
  riskLevel: string
  date: string
  time: string
  symptomsCount: number
  temperature?: number
}

interface HistoryListProps {
  filteredHistory: EvaluationRecord[]
  onSelectRecord: (record: EvaluationRecord) => void
}

export function HistoryList({ filteredHistory, onSelectRecord }: HistoryListProps) {
 
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-500 text-white"
      case "medium":
        return "bg-yellow-500 text-gray-900"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-400 text-gray-600"
    }
  }

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high":
        return <AlertTriangle className="w-4 h-4" />
      case "medium":
        return <AlertTriangle className="w-4 h-4" />
      case "low":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <CheckCircle className="w-4 h-4" />
    }
  }

  const getRiskLabel = (risk: string) => {
    switch (risk) {
      case "high":
        return "Alto Riesgo"
      case "medium":
        return "Riesgo Moderado"
      case "low":
        return "Riesgo Bajo"
      default:
        return "Desconocido"
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Card Header */}
      <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Historial de Evaluaciones</h2>
        <p className="text-sm text-gray-600 mt-1">{filteredHistory.length} evaluaciones encontradas</p>
      </div>
      
      {/* Card Content */}
      <div className="px-4 sm:px-6 py-4">
        <div className="space-y-4">
          {filteredHistory.map((record) => (
            <div
              key={record.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${getRiskColor(record.riskLevel)}`}
              >
                {getRiskIcon(record.riskLevel)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-2 mb-1">
                  <h3 className="font-medium text-gray-900">{record.result}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border self-start sm:self-auto ${getRiskBadgeColor(record.riskLevel)}`}>
                    {getRiskLabel(record.riskLevel)}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {record.date} - {record.time}
                  </span>
                  <div className="flex items-center gap-4">
                    <span>{record.symptomsCount} síntomas</span>
                    {record.temperature && <span>{record.temperature}°C</span>}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectRecord(record)}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md bg-transparent text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center sm:justify-start gap-2 cursor-pointer"
              >
                <Eye className="w-4 h-4" />
                Ver Detalles
              </button>
            </div>
          ))}

          {filteredHistory.length === 0 && (
            <div className="text-center py-12">
              <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2 text-gray-900">No hay evaluaciones</h3>
              <p className="text-gray-500 mb-4">No se encontraron evaluaciones con los filtros seleccionados</p>
              <Link
                href="/dashboard/autoevaluacion"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/90 transition-colors cursor-pointer"
              >
                <Activity className="w-4 h-4" />
                Realizar Primera Evaluación
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
