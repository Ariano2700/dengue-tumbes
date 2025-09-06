"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, ReactNode, useState } from "react";

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
  const pathname = usePathname();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // Evitar múltiples redirecciones
    if (hasRedirected || isLoading) return;

    if (!isAuthenticated) {
      // Si no está autenticado, redirigir a login con la URL actual como callback
      setHasRedirected(true);
      router.push(`/iniciar-sesion?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }

    if (requireProfileCompleted && user && !user.profileCompleted) {
      // Si requiere perfil completo y no lo tiene, redirigir a completar perfil (paso 2)
      setHasRedirected(true);
      router.push("/registrarse?step=2");
      return;
    }
  }, [isAuthenticated, user, isLoading, requireProfileCompleted, router, pathname, hasRedirected]);

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
