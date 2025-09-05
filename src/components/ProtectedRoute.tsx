"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  requireProfileCompleted?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireProfileCompleted = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Si no está autenticado, redirigir a login con la URL actual como callback
        const currentPath = window.location.pathname;
        router.push(`/iniciar-sesion?callbackUrl=${encodeURIComponent(currentPath)}`);
        return;
      }

      if (requireProfileCompleted && user && !user.profileCompleted) {
        // Si requiere perfil completo y no lo tiene, redirigir a completar perfil (paso 2)
        router.push("/registrarse?step=2");
        return;
      }
    }
  }, [isAuthenticated, user, isLoading, requireProfileCompleted, router]);

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Si no está autenticado, no mostrar nada (ya redirigió)
  if (!isAuthenticated) {
    return null;
  }

  // Si requiere perfil completo y no lo tiene, no mostrar nada (ya redirigió)
  if (requireProfileCompleted && user && !user.profileCompleted) {
    return null;
  }

  return <>{children}</>;
}
