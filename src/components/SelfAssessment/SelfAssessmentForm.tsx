"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Activity, Thermometer, ArrowLeft, Loader2 } from 'lucide-react';
import { LocationPicker } from '@/components/maps/LocationPicker';

type Symptom = {
  id: string
  code: string
  name: string
  severity: "mild" | "moderate" | "severe"
}

interface SelfAssessmentFormProps {
  onSubmit: (
    data: { 
    symptoms: string[]
    temperature: string
    daysSick: string
    location?: {
      lat: number
      lng: number
      address?: string
    } | null
  }) => void
  isSubmitting: boolean
}

export function SelfAssessmentForm({ onSubmit, isSubmitting }: SelfAssessmentFormProps) {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const [temperature, setTemperature] = useState("")
  const [daysSick, setDaysSick] = useState("")
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [loadingSymptoms, setLoadingSymptoms] = useState(true)
  const [errorLoadingSymptoms, setErrorLoadingSymptoms] = useState<string | null>(null)
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null)
  const [formErrors, setFormErrors] = useState<{ temperature?: string; daysSick?: string }>({});

  // Obtener síntomas de la API
  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        setLoadingSymptoms(true)
        const response = await fetch('/api/symptom', {
          method: 'GET',
          credentials: 'include', // Para incluir las cookies de autenticación
        })

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('No tienes autorización para acceder a esta información')
          }
          throw new Error('Error al cargar los síntomas')
        }

        const data = await response.json()
        
        // Validar que la respuesta tenga la estructura esperada
        if (!data || !data.data || !Array.isArray(data.data)) {
          console.error('Estructura de respuesta inesperada:', data)
          throw new Error('Respuesta de la API inválida')
        }
        
        // Mapear la respuesta de la API al formato que espera el componente
        const mappedSymptoms: Symptom[] = data.data.map((symptom: any) => ({
          id: symptom.id,           // Ya viene como code en la API
          code: symptom.id,         // El code es el id en la respuesta
          name: symptom.label,      // La API devuelve label, no name
          severity: symptom.severity as "mild" | "moderate" | "severe"
        }))

        setSymptoms(mappedSymptoms)
        setErrorLoadingSymptoms(null)
      } catch (error) {
        console.error('Error fetching symptoms:', error)
        setErrorLoadingSymptoms(error instanceof Error ? error.message : 'Error al cargar los síntomas')
      } finally {
        setLoadingSymptoms(false)
      }
    }

    fetchSymptoms()
  }, [])

  const handleSymptomChange = (symptomId: string, checked: boolean) => {
    if (checked) {
      setSelectedSymptoms([...selectedSymptoms, symptomId])
    } else {
      setSelectedSymptoms(selectedSymptoms.filter((id) => id !== symptomId))
    }
  }

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setLocation({ lat, lng, address })
  }

  const validateForm = () => {
    const errors: { temperature?: string; daysSick?: string } = {};

    if (!temperature) {
      errors.temperature = "Por favor, ingresa tu temperatura actual.";
    }

    if (!daysSick) {
      errors.daysSick = "Por favor, ingresa cuántos días te sientes mal.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Validar que se haya seleccionado una ubicación
    if (!location) {
      alert('Por favor, selecciona tu ubicación en el mapa antes de continuar.')
      return
    }
    
    onSubmit({ 
      symptoms: selectedSymptoms, 
      temperature, 
      daysSick,
      location
    })
  }

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "severe":
        return "bg-red-100 text-red-700 border-red-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "mild":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  }

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "severe": return "Grave";
      case "moderate": return "Moderado";
      case "mild": return "Leve";
      default: return "";
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-[var(--color-primary)]" />
          Formulario de Autoevaluación
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Responde honestamente sobre los síntomas que has experimentado en los últimos días
        </p>
      </div>

      {/* Card Content */}
      <div className="px-6 py-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Información Básica</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="temperature" className="text-sm font-medium text-gray-700">
                  Temperatura actual (°C)
                </label>
                <div className="relative">
                  <Thermometer className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                {formErrors.temperature && (
                  <p className="text-red-600 text-sm">{formErrors.temperature}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="days" className="text-sm font-medium text-gray-700">
                  ¿Cuántos días te sientes mal?
                </label>
                <input
                  id="days"
                  type="number"
                  placeholder="0"
                  value={daysSick}
                  onChange={(e) => setDaysSick(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {formErrors.daysSick && (
                  <p className="text-red-600 text-sm">{formErrors.daysSick}</p>
                )}
              </div>
            </div>
          </div>

          {/* Symptoms Checklist */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Síntomas</h3>
            <p className="text-sm text-gray-600">Marca todos los síntomas que has experimentado:</p>

            {loadingSymptoms ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                <span className="ml-2 text-gray-600">Cargando síntomas...</span>
              </div>
            ) : errorLoadingSymptoms ? (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{errorLoadingSymptoms}</p>
                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-2 text-sm text-red-600 underline hover:no-underline"
                >
                  Reintentar
                </button>
              </div>
            ) : symptoms.length === 0 ? (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-700 text-sm">No se encontraron síntomas disponibles.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {symptoms.map((symptom) => (
                  <div
                    key={symptom.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <input
                      type="checkbox"
                      id={symptom.id}
                      checked={selectedSymptoms.includes(symptom.id)}
                      onChange={(e) => handleSymptomChange(symptom.id, e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor={symptom.id} className="flex-1 cursor-pointer text-gray-700">
                      {symptom.name}
                    </label>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full border ${getSeverityBadgeClass(symptom.severity)}`}
                    >
                      {getSeverityLabel(symptom.severity)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Location Picker */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Ubicación</h3>
            <p className="text-sm text-gray-600">
              Selecciona tu ubicación para ayudarnos a mapear los casos de dengue en tu zona
            </p>
            <LocationPicker
              onLocationSelect={handleLocationSelect}
              height="250px"
            />
          </div>

          <div className="space-y-4">
            {formErrors.temperature && (
              <p className="text-red-600 text-sm">{formErrors.temperature}</p>
            )}
            {formErrors.daysSick && (
              <p className="text-red-600 text-sm">{formErrors.daysSick}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Link
              href="/dashboard"
              className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || loadingSymptoms || !location}
              className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {isSubmitting ? "Evaluando..." : loadingSymptoms ? "Cargando..." : !location ? "Selecciona ubicación" : "Completar Evaluación"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}