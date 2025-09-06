import React from 'react';
import { History, CheckCircle, AlertTriangle } from 'lucide-react';

interface EvaluationRecord {
  id: string
  riskLevel: string
  [key: string]: any
}

interface HistoryStatsProps {
  filteredHistory: EvaluationRecord[]
}

export function HistoryStats({ filteredHistory }: HistoryStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Total Evaluaciones */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Evaluaciones</p>
              <p className="text-2xl font-bold text-gray-900">{filteredHistory.length}</p>
            </div>
            <History className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Riesgo Bajo */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Riesgo Bajo</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredHistory.filter((r) => r.riskLevel === "low").length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Riesgo Moderado */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Riesgo Moderado</p>
              <p className="text-2xl font-bold text-yellow-600">
                {filteredHistory.filter((r) => r.riskLevel === "medium").length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Alto Riesgo */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Alto Riesgo</p>
              <p className="text-2xl font-bold text-red-600">
                {filteredHistory.filter((r) => r.riskLevel === "high").length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  )
}