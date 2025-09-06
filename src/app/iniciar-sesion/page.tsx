"use client";
import { GgGoogle } from "@/components/icons/GgGoogle";
import { AlertCircle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

function LoginPage() {
  const {
    user,
    isAuthenticated,
    isLoading: authLoading,
    isInitialized,
  } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasRedirected, setHasRedirected] = useState(false);

  // Si el usuario ya está autenticado, redirigir según su estado
  useEffect(() => {
    // console.log("Login page useEffect:", {
    //   isInitialized,
    //   hasRedirected,
    //   authLoading,
    //   isAuthenticated,
    //   user,
    //   profileCompleted: user?.profileCompleted,
    // });

    if (!isInitialized || hasRedirected || authLoading) return;

    if (isAuthenticated && user) {
      // Verificar si viene con un callbackUrl específico
      const callbackUrl = searchParams.get("callbackUrl");

      //console.log("User is authenticated, profileCompleted:", user.profileCompleted);

      setHasRedirected(true);
      if (user.profileCompleted) {
        // Si tiene perfil completo, ir al destino solicitado o dashboard
        //console.log("Redirecting to dashboard/callback");
        router.push(callbackUrl || "/dashboard");
      } else {
        // Si no tiene perfil completo, ir a completar registro (paso 2)
        //console.log("Redirecting to complete profile");
        router.push("/registrarse?step=2");
      }
    }
  }, [
    isAuthenticated,
    user,
    router,
    searchParams,
    isInitialized,
    hasRedirected,
    authLoading,
  ]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Usar NextAuth para autenticar con Google
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: window.location.origin + "/iniciar-sesion",
      });

      if (result?.error) {
        setError(
          "Error al iniciar sesión con Google. Por favor, intenta nuevamente."
        );
      } else {
        // La autenticación fue exitosa
        // El useEffect se encargará de redirigir según el estado del usuario
      }
    } catch (err) {
      setError(
        "Error al iniciar sesión con Google. Por favor, intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading si está verificando autenticación o redirigiendo
  if (authLoading || hasRedirected) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full"></div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            src="/logo-dengue-cero.png"
            alt="Dengue Cero Tumbes"
            title="Dengue Cero Tumbes"
            priority
            className="size-28 rounded-2xl mb-5"
            width={120}
            height={120}
          />
          <h1 className="text-2xl font-bold text-foreground">
            Dengue Cero Tumbes
          </h1>
          <p className="text-muted-foreground mb-2">Inicia sesión en tu cuenta</p>
        </div>

        <div className="border p-10 rounded-xl border-gray-300">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-1">Iniciar Sesión</h2>
            <p className="text-sm text-gray-500 mb-3">
              Accede a tu panel de autoevaluación de síntomas
            </p>
          </div>
          <div>
            {error && (
              <div className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <div>{error}</div>
              </div>
            )}

            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-6">
                  Utiliza tu cuenta de Google para acceder de forma segura
                </p>
              </div>

              <button
                className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 transition-all ease-in duration-200 p-2 rounded-xl text-white flex items-center justify-center gap-3 cursor-pointer"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <GgGoogle />
                {isLoading ? "Iniciando sesión..." : "Continuar con Google"}
              </button>

              <div className="mt-6 text-center text-sm">
                <span className="text-muted-foreground">
                  ¿No tienes una cuenta?{" "}
                </span>
                <Link
                  href="/registrarse"
                  className="text-[var(--color-primary)] hover:underline font-medium"
                >
                  Regístrate aquí
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex itcems-center justify-center gap-1"
          >
            <ArrowLeft /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;
