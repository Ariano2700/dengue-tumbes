import DashboardLayout from "@/components/dashboard/DashboardLayout";
import HealthTips from "@/components/dashboard/HealthTips";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

function Dashboard() {
  return (
    <DashboardLayout
      activeItem="dashboard"
      title="Panel de Control"
      description="Monitorea tu salud y previene el dengue"
      showHealthBadge={true}
    >
      {/* <QuickStats/> */}
      <QuickActions/>
      <RecentActivity/>
      <HealthTips />
    </DashboardLayout>
  );
}
export default Dashboard;
