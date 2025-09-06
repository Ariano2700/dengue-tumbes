"use client";

import {
  Activity,
  History,
  MapPin,
  Shield,
  User,
  LogOut,
  ScrollText,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "next-auth/react";
import { useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { useState, useEffect } from "react";
import { ModalUserProfile } from "./ModalUserProfile";
import Image from "next/image";

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
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Detectar si es mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const menuItems: MenuItem[] = [
    {
      title: "Panel Principal",
      icon: Activity,
      href: "/dashboard",
      isActive: activeItem === "dashboard",
    },
    {
      title: "Autoevaluación",
      icon: ScrollText,
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
      href: "/dashboard/mapa-de-casos",
      isActive: activeItem === "mapa",
    },
  ];

  const handleLogout = async () => {
    try {
      dispatch(logout());
      await signOut({
        redirect: true,
        callbackUrl: "/",
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  // Si no está autenticado, mostrar loading
  if (!isAuthenticated || !user) {
    return (
      <>
        {/* Desktop/Tablet Loading */}
        <div className="hidden md:flex h-full w-64 flex-col bg-white border-r border-gray-200">
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
          </div>
        </div>

        {/* Mobile Loading */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
          <div className="flex items-center justify-center">
            <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
          </div>
        </div>
      </>
    );
  }

  const displayName =
    user.firstName && user.lastName
      ? `${user.firstName} ${user.lastName}`
      : user.name || "Usuario";
  const displayEmail = user.email || "Sin email";

  // Mobile Bottom Navigation
  if (isMobile) {
    return (
      <>
        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="md:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Mobile Overlay Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/20">
            <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl">
              {/* Header */}
              <div className="border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/icono-dengue-cero.png"
                      alt="Dengue Cero Tumbes"
                      title="Dengue Cero Tumbes"
                      priority
                      className="size-16 rounded-2xl"
                      width={120}
                      height={120}
                    />
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        Dengue Cero
                      </h2>
                      <p className="text-xs text-gray-500">Tumbes</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col p-4 overflow-y-auto">
                {/* User Profile */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={displayName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {displayEmail}
                    </p>
                    {!user.profileCompleted && (
                      <Link
                        href="/registrarse?step=2"
                        className="text-xs text-amber-600 hover:text-amber-700 font-medium underline"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Completar perfil
                      </Link>
                    )}
                  </div>
                </div>

                {/* Navigation */}
                <nav className="space-y-1 flex-1">
                  {menuItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-md transition-colors ${
                        item.isActive
                          ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/40"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  ))}
                </nav>

                {/* Footer */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <button
                    onClick={() => {
                      setIsProfileModalOpen(true);
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors mb-2 w-full text-left"
                  >
                    <User className="w-5 h-5" />
                    <span>Mi Perfil</span>
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-red-600 transition-colors w-full text-left group"
                  >
                    <LogOut className="w-5 h-5 group-hover:text-red-600" />
                    <span className="group-hover:text-red-600">
                      Cerrar Sesión
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-30">
          <nav className="flex justify-around items-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                  item.isActive
                    ? "text-[var(--color-primary)]"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium truncate max-w-[60px]">
                  {item.title.split(" ")[0]}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Modal de Perfil */}
        <ModalUserProfile
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
        />
      </>
    );
  }

  // Desktop/Tablet Sidebar
  return (
    <div
      className={`hidden md:flex h-screen flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-3 transition-opacity duration-300 ${
              isCollapsed ? "opacity-0" : "opacity-100"
            }`}
          >
            <Image
              src="/icono-dengue-cero.png"
              alt="Dengue Cero Tumbes"
              title="Dengue Cero Tumbes"
              priority
              className="size-16 rounded-2xl"
              width={120}
              height={120}
            />
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-gray-900">Dengue Cero</h2>
                <p className="text-xs text-gray-500">Tumbes</p>
              </div>
            )}
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {/* User Profile */}
        {!isCollapsed && (
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
              <p
                className="font-medium text-gray-900 truncate"
                title={displayName}
              >
                {displayName}
              </p>
              <p
                className="text-xs text-gray-500 truncate"
                title={displayEmail}
              >
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
        )}

        {/* Avatar only when collapsed */}
        {isCollapsed && (
          <div className="flex justify-center mb-4">
            {user.picture ? (
              <img
                src={user.picture}
                alt={displayName}
                className="w-10 h-10 rounded-full object-contain"
                title={displayName}
              />
            ) : (
              <div
                className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center"
                title={displayName}
              >
                <User className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center ${
                isCollapsed ? "justify-center px-3" : "gap-3 px-3"
              } py-2 text-sm font-medium rounded-md transition-colors duration-200 group ${
                item.isActive
                  ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/40"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
              title={isCollapsed ? item.title : undefined}
            >
              <item.icon
                className={`w-4 h-4 ${isCollapsed ? "w-8 h-8" : ""}`}
              />
              {!isCollapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0">
        <nav className="space-y-1">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className={`flex items-center ${
              isCollapsed ? "justify-center px-3" : "gap-3 px-3"
            } py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200 w-full text-left`}
            title={isCollapsed ? "Mi Perfil" : undefined}
          >
            <User className="w-4 h-4" />
            {!isCollapsed && <span>Mi Perfil</span>}
          </button>
          <button
            onClick={handleLogout}
            className={`flex items-center ${
              isCollapsed ? "justify-center px-3" : "gap-3 px-3"
            } py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 hover:text-red-600 transition-colors duration-200 w-full text-left group cursor-pointer`}
            title={isCollapsed ? "Cerrar Sesión" : undefined}
          >
            <LogOut className="w-4 h-4 group-hover:text-red-600" />
            {!isCollapsed && (
              <span className="group-hover:text-red-600">Cerrar Sesión</span>
            )}
          </button>
        </nav>
      </div>

      {/* Modal de Perfil */}
      <ModalUserProfile
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
}

export default Sidebar;
