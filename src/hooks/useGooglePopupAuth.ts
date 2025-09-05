"use client";

import { useState, useEffect, useCallback } from "react";
import { signIn } from "next-auth/react";

export function useGooglePopupAuth() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleGooglePopupAuth = useCallback(async () => {
    setIsLoading(true);
    
    // Crear URL de autenticación
    const authUrl = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(window.location.origin + '/api/auth/popup-callback')}`;
    
    // Configuración del popup
    const popup = window.open(
      authUrl,
      'googleAuth',
      'width=500,height=600,left=' + 
      (window.screenX + (window.outerWidth - 500) / 2) + 
      ',top=' + 
      (window.screenY + (window.outerHeight - 600) / 2) + 
      ',scrollbars=yes,resizable=yes'
    );

    if (!popup) {
      setIsLoading(false);
      throw new Error('Popup bloqueado. Por favor, permite popups para este sitio.');
    }

    return new Promise((resolve, reject) => {
      // Escuchar mensajes del popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          popup.close();
          setIsLoading(false);
          resolve({ success: true });
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', handleMessage);
          popup.close();
          setIsLoading(false);
          reject(new Error(event.data.error || 'Error en la autenticación'));
        }
      };

      window.addEventListener('message', handleMessage);

      // Verificar si el popup se cerró manualmente
      const checkClosed = setInterval(() => {
        try {
          if (popup.closed) {
            clearInterval(checkClosed);
            window.removeEventListener('message', handleMessage);
            setIsLoading(false);
            reject(new Error('Ventana de autenticación cerrada'));
          }
        } catch (error) {
          // Error de cross-origin, intentar de otra forma
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setIsLoading(false);
          // Recargar después de un delay para verificar si se autenticó
          setTimeout(() => {
            window.location.reload();
          }, 1000);
          resolve({ success: true });
        }
      }, 1000);
    });
  }, []);

  return { handleGooglePopupAuth, isLoading };
}
