"use client";

import { CheckCircle, Clock, AlertTriangle, Loader2, Calendar } from "lucide-react";
import { useRecentActivity } from "@/hooks/useRecentActivity";
import { TimeAgo } from "@/components/common/TimeAgo";

// Helper functions
const getRiskLevelInfo = (riskLevel: 'low' | 'medium' | 'high') => {
  switch (riskLevel) {
    case 'low':
      return {
        label: 'Saludable',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        badgeColor: 'bg-green-100 text-green-700',
        icon: CheckCircle
      };
    case 'medium':
      return {
        label: 'Precaución',
        bgColor: 'bg-yellow-500',
        textColor: 'text-gray-900',
        badgeColor: 'bg-yellow-100 text-yellow-700',
        icon: Clock
      };
    case 'high':
      return {
        label: 'Alto Riesgo',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        badgeColor: 'bg-red-100 text-red-700',
        icon: AlertTriangle
      };
  }
};

const getResultDescription = (riskLevel: 'low' | 'medium' | 'high', symptomsCount: number) => {
  if (riskLevel === 'high') {
    return 'Síntomas graves detectados';
  } else if (riskLevel === 'medium') {
    return 'Síntomas moderados detectados';
  } else if (symptomsCount > 0) {
    return 'Síntomas leves detectados';
  }
  return 'Sin síntomas detectados';
};

export function RecentActivity() {
  const { activities, isLoading, error } = useRecentActivity();

  // Loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <p className="text-sm text-gray-600 mt-1">Tus últimas evaluaciones y resultados</p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                </div>
                <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <p className="text-sm text-gray-600 mt-1">Tus últimas evaluaciones y resultados</p>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 font-medium">Error al cargar actividad</p>
            <p className="text-gray-500 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
          <p className="text-sm text-gray-600 mt-1">Tus últimas evaluaciones y resultados</p>
        </div>
        <div className="p-6">
          <div className="text-center py-8">
            <Calendar className="w-8 h-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No hay actividad reciente</p>
            <p className="text-gray-400 text-sm mt-1">
              No tienes autoevaluaciones en la última semana
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Actividad Reciente</h3>
        <p className="text-sm text-gray-600 mt-1">Tus últimas evaluaciones y resultados</p>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const riskInfo = getRiskLevelInfo(activity.riskLevel);
            const IconComponent = riskInfo.icon;
            const symptomsCount = activity.symptoms?.length || 0;
            const description = getResultDescription(activity.riskLevel, symptomsCount);

            return (
              <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-lg">
                <div className={`w-10 h-10 ${riskInfo.bgColor} rounded-full flex items-center justify-center`}>
                  <IconComponent className={`w-5 h-5 ${riskInfo.textColor}`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">Evaluación completada</p>
                  <p className="text-sm text-gray-600">
                    {description} - <TimeAgo dateString={activity.createdAt} />
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${riskInfo.badgeColor}`}>
                  {riskInfo.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}