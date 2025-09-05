import { Activity, History, MapPin, Shield, User, LogOut } from "lucide-react";
import Link from "next/link";

type MenuItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isActive?: boolean;
};

interface DashboardSidebarProps {
  activeItem?: string;
}
function Sidebar({ activeItem }: DashboardSidebarProps) {
  const menuItems: MenuItem[] = [
    {
      title: "Panel Principal",
      icon: Activity,
      href: "/dashboard",
      isActive: activeItem === "dashboard",
    },
    {
      title: "Autoevaluación",
      icon: Activity,
      href: "/dashboard/autoevaluacion",
      isActive: activeItem === "autoevaluacion",
    },
    {
      title: "Historial",
      icon: History,
      href: "/dashboard/historial",
      isActive: activeItem === "historial",
    },
    {
      title: "Mapa de Casos",
      icon: MapPin,
      href: "/dashboard/mapa",
      isActive: activeItem === "mapa",
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Dengue Cero</h2>
            <p className="text-xs text-gray-500">Tumbes</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate">Juan Pérez</p>
            <p className="text-xs text-gray-500 truncate">juan@email.com</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                item.isActive
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <nav className="space-y-1">
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <User className="w-4 h-4" />
            <span>Mi Perfil</span>
          </Link>
          <button
            onClick={() => (window.location.href = "/logout")}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 w-full text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
export default Sidebar;
