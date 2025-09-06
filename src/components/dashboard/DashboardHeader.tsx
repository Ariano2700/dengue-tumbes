import { CheckCircle } from "lucide-react";

interface DashboardHeaderProps {
  title: string;
  description: string;
  showHealthBadge?: boolean;
}

export function DashboardHeader({
  title,
  description,
  showHealthBadge = false,
}: DashboardHeaderProps) {
  return (
    <header className="flex h-[73px] w-full shrink-0 items-center gap-2 border-b border-gray-300 px-4 md:px-6">
      {/* Espacio para el botón del menú mobile */}
      <div className="md:hidden w-12" />
      
      <div className="flex-1">
        <h1 className="text-lg md:text-xl font-semibold">{title}</h1>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      
      {showHealthBadge && (
        <div className="flex items-center bg-dengue-healthy text-white px-2 py-1 rounded-lg text-sm">
          <CheckCircle className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Saludable</span>
        </div>
      )}
    </header>
  );
}
