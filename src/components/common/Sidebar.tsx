"use client";

import { Activity, History, MapPin, Shield, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";

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
  const { user, isAuthenticated } = useAuth();
  const dispatch = useAppDispatch();
  
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

  const handleLogout = async () => {
    try {
      // Limpiar el estado de Redux
      dispatch(logout());
      
      // Cerrar sesión en NextAuth
      await signOut({
        redirect: true,
        callbackUrl: "/"
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Si no está autenticado, no mostrar datos sensibles
  if (!isAuthenticated || !user) {
    return (
      <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  // Obtener el nombre para mostrar
  const displayName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.name || "Usuario";

  const displayEmail = user.email || "Sin email";

  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">Dengue Cero</h2>
            <p className="text-xs text-gray-500">Tumbes</p>
          </div>
        </div>
      </div>

      {/* Content - Flex container that takes all available space */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* User Profile */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4 flex-shrink-0">
          {user.picture ? (
            <img
              src={user.picture}
              alt={displayName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 truncate" title={displayName}>
              {displayName}
            </p>
            <p className="text-xs text-gray-500 truncate" title={displayEmail}>
              {displayEmail}
            </p>
            {!user.profileCompleted && (
              <Link
                href="/registrarse?step=2"
                className="text-xs text-amber-600 hover:text-amber-700 font-medium underline"
              >
                Completar perfil
              </Link>
            )}
          </div>
        </div>

        {/* Navigation Menu - Takes remaining space */}
        <nav className="space-y-1 flex-1">
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

      {/* Footer - Always at bottom */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0">
        <nav className="space-y-1">
          <Link
            href="/dashboard/perfil"
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200"
          >
            <User className="w-4 h-4" />
            <span>Mi Perfil</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 w-full text-left group cursor-pointer"
          >
            <LogOut className="w-4 h-4 group-hover:text-red-600" />
            <span className="group-hover:text-red-600">Cerrar Sesión</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
export default Sidebar;
