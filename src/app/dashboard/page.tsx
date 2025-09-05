import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HealthTips from "@/components/dashboard/HealthTips";

function Dashboard() {
  return (
    <DashboardLayout
      activeItem="dashboard"
      title="Panel de Control"
      description="Monitorea tu salud y previene el dengue"
      showHealthBadge={true}
    >
      <HealthTips />
    </DashboardLayout>
  );
}
export default Dashboard;
