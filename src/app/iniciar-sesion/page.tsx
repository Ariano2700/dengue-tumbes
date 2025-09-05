"use client";
import { GgGoogle } from "@/components/icons/GgGoogle";
import { AlertCircle, ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate checking if user has complete profile
      const mockUserProfile = {
        email: "usuario@gmail.com",
        hasCompleteProfile: Math.random() > 0.5, // Randomly simulate complete/incomplete profile
      };

      console.log("Google login successful:", mockUserProfile);

      if (!mockUserProfile.hasCompleteProfile) {
        // Redirect to register to complete profile
        window.location.href = "/registrarse";
      } else {
        // Redirect to dashboard
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setError(
        "Error al iniciar sesión con Google. Por favor, intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--color-primary)] rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">
            Dengue Cero Tumbes
          </h1>
          <p className="text-muted-foreground">Inicia sesión en tu cuenta</p>
        </div>

        <div className="border p-10 rounded-xl border-gray-300">
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-1">Iniciar Sesión</h2>
            <p className="text-sm text-gray-500 mb-3">Accede a tu panel de autoevaluación de síntomas</p>
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
                  href="/register"
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
