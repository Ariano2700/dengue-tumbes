"use client";
import { GgGoogle } from "@/components/icons/GgGoogle";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  Phone,
  Shield,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(0); // 0: Google auth, 1: Personal data
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [googleUser, setGoogleUser] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    phone: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validatePersonalData = () => {
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.dni ||
      !formData.phone
    ) {
      return "Por favor, completa todos los campos.";
    }
    if (formData.dni.length !== 8) {
      return "El DNI debe tener 8 dígitos.";
    }
    if (formData.phone.length < 9) {
      return "El teléfono debe tener al menos 9 dígitos.";
    }
    return null;
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulate Google user data
      const mockGoogleUser = {
        email: "usuario@gmail.com",
        name: "Usuario Google",
        picture: "https://via.placeholder.com/100",
      };

      setGoogleUser(mockGoogleUser);
      setCurrentStep(1); // Move to personal data step
    } catch (err) {
      setError("Error al conectar con Google. Por favor, intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const validationError = validatePersonalData();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Complete registration:", { ...googleUser, ...formData });
      setSuccess(true);

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 2000);
    } catch (err) {
      setError(
        "Error al completar el registro. Por favor, intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-dengue-healthy rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              ¡Registro completado!
            </h2>
            <p className="text-muted-foreground mb-6">
              Te estamos redirigiendo a tu panel de control...
            </p>
            <div className="animate-spin w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-muted-foreground">
            {currentStep === 0
              ? "Crea tu cuenta para comenzar"
              : "Completa tu información personal"}
          </p>
        </div>

        <div className="border p-10 rounded-xl border-gray-300">
          <div className="text-center">
            <div className="">
              <h2 className="text-lg font-semibold mb-1">
                {currentStep === 0 ? "Crear Cuenta" : "Información Personal"}
              </h2>
            </div>
            <div className="mb-3">
              <h3 className="text-sm text-gray-500">
                {currentStep === 0
                  ? "Únete al sistema de prevención de dengue en Tumbes"
                  : "Completa tus datos para finalizar el registro"}
              </h3>
            </div>
            {currentStep === 1 && (
              <div className="flex items-center justify-center mt-4 space-x-2">
                <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  <Check />
                </div>
                <div className="w-8 border-t-2 border-[var(--color-primary)]"></div>
                <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-medium">
                  2
                </div>
              </div>
            )}
          </div>
          <div>
            {error && (
              <div className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}

            {currentStep === 0 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-6">
                    Utiliza tu cuenta de Google para registrarte de forma segura
                  </p>
                </div>

                <button
                  type="button"
                  className="w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 transition-all ease-in duration-200 p-2 rounded-xl text-white flex items-center justify-center gap-3 cursor-pointer"
                  onClick={handleGoogleRegister}
                  disabled={isLoading}
                >
                  <GgGoogle />
                  {isLoading
                    ? "Conectando con Google..."
                    : "Continuar con Google"}
                </button>

                <div className="mt-6 text-center text-sm">
                  <span className="text-muted-foreground">
                    ¿Ya tienes una cuenta?{" "}
                  </span>
                  <Link
                    href="/login"
                    className="text-[var(--color-primary)] hover:underline font-medium"
                  >
                    Inicia sesión aquí
                  </Link>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Google user info display */}
                {googleUser && (
                  <div className="flex items-center space-x-3 p-3 bg-[#ededed] rounded-lg">
                    <div className="w-10 h-10 bg-[var(--color-primary)] rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">
                        {googleUser.email}
                      </p>
                      <p className="font-light text-xs text-gray-600">
                        Cuenta de Google conectada
                      </p>
                    </div>
                  </div>
                )}

                <form
                  onSubmit={handleCompleteRegistration}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 border-b border-gray-200">
                      <label htmlFor="firstName">Nombres *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                          id="firstName"
                          type="text"
                          placeholder="Juan Carlos"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleInputChange("firstName", e.target.value)
                          }
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2 border-b border-gray-200">
                      <label htmlFor="lastName">Apellidos *</label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Pérez García"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleInputChange("lastName", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2 border-b border-gray-200">
                    <label htmlFor="dni">DNI *</label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <input
                        id="dni"
                        type="text"
                        placeholder="12345678"
                        value={formData.dni}
                        onChange={(e) =>
                          handleInputChange(
                            "dni",
                            e.target.value.replace(/\D/g, "").slice(0, 8)
                          )
                        }
                        className="pl-10"
                        maxLength={8}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Documento Nacional de Identidad (8 dígitos)
                  </p>

                  <div className="space-y-2 border-b border-gray-200">
                    <label htmlFor="phone">Teléfono *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <input
                        id="phone"
                        type="tel"
                        placeholder="999999999"
                        value={formData.phone}
                        onChange={(e) =>
                          handleInputChange(
                            "phone",
                            e.target.value.replace(/\D/g, "").slice(0, 9)
                          )
                        }
                        className="pl-10"
                        maxLength={9}
                        required
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">
                    Número de celular (9 dígitos)
                  </p>

                  <div className="flex space-x-3 pt-4">
                    <button
                      onClick={() => setCurrentStep(0)}
                      className="flex items-center justify-center flex-1 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-700 transition-all ease-in duration-200 cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Atrás
                    </button>
                    <button
                      type="submit"
                      className="flex items-center justify-center rounded-xl text-white p-3 bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/90 transition-all ease-in duration-200 cursor-pointer"
                      disabled={isLoading}
                    >
                      {isLoading ? "Completando..." : "Finalizar Registro"}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                  </div>
                </form>
              </div>
            )}
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
export default RegisterPage;
