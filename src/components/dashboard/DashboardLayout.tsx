"use client";
import { useAuth } from "@/hooks/useAuth";
import Sidebar from "../common/Sidebar";
import { DashboardHeader } from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  activeItem?: string;
  title: string;
  description: string;
  showHealthBadge?: boolean;
}

function DashboardLayout({
  children,
  activeItem,
  title,
  description,
  showHealthBadge = false,
}: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Mostrar loading de pantalla completa mientras se verifica la autenticación
  if (isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar activeItem={activeItem} />
      
      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 md:min-w-0">
        <DashboardHeader
          title={title}
          description={description}
          showHealthBadge={showHealthBadge}
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pb-20 md:pb-6">
          <div className="space-y-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
export default DashboardLayout;
