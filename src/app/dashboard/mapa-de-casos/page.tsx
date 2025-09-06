import DashboardLayout from "@/components/dashboard/DashboardLayout"
import { MapContainer } from "@/components/mapOfCases/MapContainer"

function MapOfCases() {
  return (
    <DashboardLayout title="Mapa de Casos" description="Visualiza la distribución de casos de dengue en Tumbes">
      <div className="space-y-6">
        <MapContainer />
      </div>
    </DashboardLayout>
  )
}
export default MapOfCases