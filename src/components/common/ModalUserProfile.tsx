"use client";

import React, { useState, useEffect } from 'react';
import { X, User, Shield, Save, Edit3, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface ModalUserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  firstName: string;
  lastName: string;
  dni: string;
  phone: string;
}

export function ModalUserProfile({ isOpen, onClose }: ModalUserProfileProps) {
  const { user, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    dni: '',
    phone: ''
  });

  // Cargar datos del usuario cuando se abre el modal
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dni: user.dni || '',
        phone: user.phone || ''
      });
      setError('');
      setSuccess('');
      setIsEditing(false);
    }
  }, [isOpen, user]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(''); // Limpiar error al escribir
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Filtrar solo los campos que han cambiado
      const updatedFields: Partial<FormData> = {};
      
      if (formData.firstName !== (user?.firstName || '')) {
        updatedFields.firstName = formData.firstName;
      }
      if (formData.lastName !== (user?.lastName || '')) {
        updatedFields.lastName = formData.lastName;
      }
      if (formData.dni !== (user?.dni || '')) {
        updatedFields.dni = formData.dni;
      }
      if (formData.phone !== (user?.phone || '')) {
        updatedFields.phone = formData.phone;
      }

      // Si no hay cambios
      if (Object.keys(updatedFields).length === 0) {
        setIsEditing(false);
        return;
      }

      // Usar fetch manual para PATCH ya que completeProfile es para POST
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFields),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar perfil');
      }

      setSuccess('Perfil actualizado exitosamente');
      setIsEditing(false);
      
      // Refrescar datos del usuario (esto actualizará el cache automáticamente)
      await refreshProfile();
      
      // Cerrar mensaje de éxito después de 2 segundos
      setTimeout(() => {
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Restaurar datos originales
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        dni: user.dni || '',
        phone: user.phone || ''
      });
    }
    setIsEditing(false);
    setError('');
    setSuccess('');
  };

  const getDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.name || 'Usuario';
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      return names.length > 1 
        ? `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
        : names[0].charAt(0).toUpperCase();
    }
    return 'U';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header del Modal */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">Mi Perfil</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Contenido del Modal */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-3">
            
            {/* Información Personal */}
            <div className="md:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
              {/* Card Header */}
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Información Personal
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Actualiza tu información personal y de contacto
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleCancel}
                          disabled={isLoading}
                          className="px-3 py-2 border border-gray-300 rounded-md bg-transparent text-gray-700 hover:bg-gray-50 transition-colors text-sm disabled:opacity-50"
                        >
                          Cancelar
                        </button>
                        <button
                          onClick={handleSave}
                          disabled={isLoading}
                          className="px-3 py-2 bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary)]/90 transition-colors flex items-center gap-2 text-sm disabled:opacity-50"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              Guardando...
                            </>
                          ) : (
                            <>
                              <Save className="w-4 h-4" />
                              Guardar
                            </>
                          )}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-3 py-2 border border-gray-300 rounded-md bg-transparent text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        Editar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="px-6 py-4 space-y-4">
                {/* Mensajes de estado */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}
                
                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-700">{success}</p>
                  </div>
                )}

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Nombres */}
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                      Nombres
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                      placeholder="Ingresa tus nombres"
                    />
                  </div>

                  {/* Apellidos */}
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                      Apellidos
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                      placeholder="Ingresa tus apellidos"
                    />
                  </div>

                  {/* DNI */}
                  <div className="space-y-2">
                    <label htmlFor="dni" className="text-sm font-medium text-gray-700">
                      DNI
                    </label>
                    <input
                      id="dni"
                      type="text"
                      value={formData.dni}
                      onChange={(e) => handleInputChange("dni", e.target.value)}
                      disabled={!isEditing}
                      maxLength={8}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                      placeholder="12345678"
                    />
                  </div>

                  {/* Teléfono */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-colors ${
                        !isEditing ? 'bg-gray-50 text-gray-600' : 'bg-white'
                      }`}
                      placeholder="+51 987 654 321"
                    />
                  </div>

                  {/* Email (Solo lectura) */}
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email (No editable)
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar - Foto y Estado */}
            <div className="space-y-6">
              
              {/* Foto de Perfil */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">Foto de Perfil</h3>
                </div>
                <div className="px-6 py-4 flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                    {user?.picture ? (
                      <img
                        src={user.picture}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-gray-600">
                        {getInitials()}
                      </span>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-gray-900">{getDisplayName()}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                </div>
              </div>

              {/* Estado de Cuenta */}
              <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Estado de Cuenta
                  </h3>
                </div>
                <div className="px-6 py-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Estado</span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                      Activa
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Perfil</span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      user?.profileCompleted 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {user?.profileCompleted ? 'Completo' : 'Incompleto'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Miembro desde</span>
                    <span className="text-sm text-gray-900">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString('es-PE', {
                            month: 'long',
                            year: 'numeric'
                          })
                        : 'N/A'
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}