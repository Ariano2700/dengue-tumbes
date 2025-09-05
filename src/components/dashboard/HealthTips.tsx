import { Shield, TrendingUp } from "lucide-react"

function HealthTips() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-6 pb-4">
        <h3 className="text-lg font-semibold text-gray-900">Consejos de Prevención</h3>
        <p className="text-sm text-gray-600 mt-1">Mantente protegido contra el dengue</p>
      </div>
      
      {/* Content */}
      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <Shield className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-700">Elimina agua estancada</h4>
              <p className="text-sm text-gray-600">Revisa recipientes, macetas y canaletas regularmente</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-700">Usa repelente</h4>
              <p className="text-sm text-gray-600">
                Aplica repelente especialmente en horas de mayor actividad del mosquito
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default HealthTips;