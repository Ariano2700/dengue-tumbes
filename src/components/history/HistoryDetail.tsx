
import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Symptom {
  id: string
  code: string
  name: string
  severity: string
}

interface EvaluationRecord {
  id: string
  date: string
  time: string
  riskLevel: string
  symptomsCount: number
  symptoms: Symptom[]
  temperature?: number
  result: string
  recommendations: string[]
}

interface HistoryDetailProps {
  selectedRecord: EvaluationRecord
  onClose: () => void
}

export function HistoryDetail({ selectedRecord, onClose }: HistoryDetailProps) {
  const [showSymptoms, setShowSymptoms] = useState(false);

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
    <div className="bg-white rounded-lg border-2 border-[var(--color-primary)] shadow-sm">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Detalles de la Evaluación</h2>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 border border-gray-300 rounded-md bg-transparent text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer text-sm"
          >
            Cerrar
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {new Date(selectedRecord.date).toLocaleDateString("es-PE")} - {selectedRecord.time}
        </p>
      </div>
      
      {/* Card Content */}
      <div className="px-6 py-4 space-y-4">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Nivel de Riesgo */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Nivel de Riesgo</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRiskColor(selectedRecord.riskLevel)}`}>
              {getRiskLabel(selectedRecord.riskLevel)}
            </span>
          </div>
          
          {/* Síntomas */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Síntomas</p>
            <p className="text-xl font-bold mt-1 text-gray-900">{selectedRecord.symptomsCount}</p>
            {selectedRecord.symptoms.length > 0 && (
              <button
                type="button"
                onClick={() => setShowSymptoms(!showSymptoms)}
                className="flex items-center gap-1 mx-auto mt-2 text-sm text-[var(--color-primary)] hover:underline"
              >
                {showSymptoms ? (
                  <>
                    <ChevronDown className="w-4 h-4" />
                    Ocultar síntomas
                  </>
                ) : (
                  <>
                    <ChevronRight className="w-4 h-4" />
                    Ver síntomas
                  </>
                )}
              </button>
            )}
          </div>
          
          {/* Temperatura */}
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500">Temperatura</p>
            <p className="text-xl font-bold mt-1 text-gray-900">
              {selectedRecord.temperature ? `${selectedRecord.temperature}°C` : "No registrada"}
            </p>
          </div>
        </div>

        {/* Lista de síntomas desplegable */}
        {showSymptoms && selectedRecord.symptoms.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-3 text-gray-900">Síntomas seleccionados:</h4>
            <ul className="space-y-2">
              {selectedRecord.symptoms.map((symptom) => (
                <li key={symptom.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{symptom.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    symptom.severity === 'severe' 
                      ? 'bg-red-100 text-red-700'
                      : symptom.severity === 'moderate'
                      ? 'bg-yellow-100 text-yellow-700' 
                      : 'bg-green-100 text-green-700'
                  }`}>
                    {symptom.severity === 'severe' ? 'Alto' : 
                     symptom.severity === 'moderate' ? 'Medio' : 'Bajo'}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Resultado */}
        <div>
          <h4 className="font-medium mb-2 text-gray-900">Resultado:</h4>
          <p className="text-gray-600">{selectedRecord.result}</p>
        </div>

        {/* Recomendaciones */}
        <div>
          <h4 className="font-medium mb-2 text-gray-900">Recomendaciones:</h4>
          <ul className="space-y-1">
            {selectedRecord.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-[var(--color-primary)] rounded-full mt-2 flex-shrink-0"></div>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
