"use client";
import React from "react";
import { AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SelfAssessmentResultProps {
  result: "low" | "medium" | "high";
  onReset: () => void;
}

export function SelfAssessmentResult({
  result,
  onReset,
}: SelfAssessmentResultProps) {
  const getRiskConfig = (level: string) => {
    switch (level) {
      case "high":
        return {
          bgColor: "bg-red-50 border-red-200",
          iconBg: "bg-red-600",
          textColor: "text-red-700",
          dotColor: "bg-red-600",
          title: "Riesgo Alto",
          description: "Busca atención médica inmediata",
          icon: <AlertTriangle className="w-8 h-8 text-white" />,
          alertBg: "bg-red-50 border-red-200",
          alertIcon: "text-red-600",
        };
      case "medium":
        return {
          bgColor: "bg-yellow-50 border-yellow-200",
          iconBg: "bg-yellow-600",
          textColor: "text-yellow-700",
          dotColor: "bg-yellow-600",
          title: "Riesgo Moderado",
          description: "Monitorea tus síntomas de cerca",
          icon: <AlertTriangle className="w-8 h-8 text-white" />,
          alertBg: "bg-yellow-50 border-yellow-200",
          alertIcon: "text-yellow-600",
        };
      case "low":
      default:
        return {
          bgColor: "bg-green-50 border-green-200",
          iconBg: "bg-green-600",
          textColor: "text-green-700",
          dotColor: "bg-green-600",
          title: "Riesgo Bajo",
          description: "Continúa con las medidas preventivas",
          icon: <CheckCircle className="w-8 h-8 text-white" />,
          alertBg: "bg-green-50 border-green-200",
          alertIcon: "text-green-600",
        };
    }
  };

  const config = getRiskConfig(result);

  const getRecommendations = () => {
    switch (result) {
      case "high":
        return [
          "Acude al centro de salud más cercano inmediatamente",
          "Mantente hidratado con abundante agua",
          "No tomes aspirina ni ibuprofeno",
        ];
      case "medium":
        return [
          "Monitorea tus síntomas cada 6 horas",
          "Mantente hidratado y descansa",
          "Si los síntomas empeoran, busca atención médica",
        ];
      case "low":
      default:
        return [
          "Continúa eliminando criaderos de mosquitos",
          "Usa repelente regularmente",
          "Realiza autoevaluaciones periódicas",
        ];
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className={`border-2 rounded-lg ${config.bgColor}`}>
        {/* Card Header */}
        <div className="px-6 py-6 text-center">
          <div
            className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${config.iconBg}`}
          >
            {config.icon}
          </div>
          <h2 className={`text-2xl font-semibold mb-2 ${config.textColor}`}>
            {config.title}
          </h2>
          <p className="text-lg text-gray-600">{config.description}</p>
        </div>

        {/* Card Content */}
        <div className="px-6 pb-6 space-y-4">
          {result === "high" && (
            <div className={`border rounded-lg p-4 ${config.alertBg}`}>
              <div className="flex gap-3">
                <AlertTriangle
                  className={`h-4 w-4 mt-0.5 flex-shrink-0 ${config.alertIcon}`}
                />
                <p className="text-sm text-gray-700">
                  Los síntomas que reportaste pueden indicar dengue grave. Es
                  importante que busques atención médica inmediata.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-900">Recomendaciones:</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {getRecommendations().map((recommendation, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${config.dotColor}`}
                  ></div>
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Nueva Evaluación
            </button>
            <Link
              href="/dashboard"
              className="flex-1 flex items-center justify-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/80 transition-colors"
            >
              Ir al Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
