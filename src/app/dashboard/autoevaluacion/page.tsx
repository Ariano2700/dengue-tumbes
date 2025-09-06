'use client'
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { SelfAssessmentForm } from "@/components/SelfAssessment/SelfAssessmentForm";
import { SelfAssessmentResult } from "@/components/SelfAssessment/SelfAssessmentResult";
import { useState } from "react";

interface AutoevaluationResult {
  id: string;
  riskLevel: "low" | "medium" | "high";
  temperature: number;
  daysSick: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  } | null;
  symptoms: Array<{
    code: string;
    name: string;
    severity: string;
  }>;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

function SelfAssessment() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<AutoevaluationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (data: { 
    symptoms: string[];
    temperature: string;
    daysSick: string;
    location?: {
      lat: number;
      lng: number;
      address?: string;
    } | null;
  }) => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const response = await fetch('/api/autoevaluation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Para incluir las cookies de autenticación
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar la autoevaluación')
      }

      const responseData = await response.json()
      setResult(responseData.data)
    } catch (err) {
      console.error('Error submitting autoevaluation:', err)
      setError(err instanceof Error ? err.message : 'Error al procesar la autoevaluación')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setResult(null)
  }

  return (
    <DashboardLayout
      activeItem="autoevaluacion"
      title={
        result ? "Resultado de Autoevaluación" : "Autoevaluación de Síntomas"
      }
      description={
        result ? "Evaluación completada" : "Evalúa tu estado de salud actual"
      }
    >
      {result ? (
        <SelfAssessmentResult result={result.riskLevel} onReset={resetForm} />
      ) : (
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">Error al procesar la autoevaluación</p>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="mt-2 text-sm text-red-600 underline hover:no-underline"
              >
                Cerrar
              </button>
            </div>
          )}
          <SelfAssessmentForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      )}
    </DashboardLayout>
  );
}
export default SelfAssessment;
