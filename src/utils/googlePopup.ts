// Función para abrir Google OAuth en popup
export function openGooglePopup(clientId: string): Promise<{ code: string } | { error: string }> {
  return new Promise((resolve, reject) => {
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/auth/callback/google`);
    const scope = encodeURIComponent('openid email profile');
    
    const googleAuthUrl = `https://accounts.google.com/oauth/authorize?` +
      `client_id=${clientId}&` +
      `redirect_uri=${redirectUri}&` +
      `response_type=code&` +
      `scope=${scope}&` +
      `access_type=offline&` +
      `prompt=consent`;

    // Configuración del popup
    const popupWidth = 500;
    const popupHeight = 600;
    const left = window.screenX + (window.outerWidth - popupWidth) / 2;
    const top = window.screenY + (window.outerHeight - popupHeight) / 2;

    const popup = window.open(
      googleAuthUrl,
      'googleLogin',
      `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );

    if (!popup) {
      reject(new Error('Popup bloqueado. Permite popups para este sitio.'));
      return;
    }

    // Escuchar el cierre del popup
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(new Error('Popup cerrado por el usuario'));
      }
    }, 1000);

    // Escuchar mensajes del popup (cuando Google redirige)
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        resolve({ code: event.data.code });
      } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        resolve({ error: event.data.error });
      }
    };

    window.addEventListener('message', messageListener);
  });
}

// Hook personalizado para usar Google popup
export function useGooglePopupAuth() {
  const handleGooglePopupLogin = async () => {
    try {
      // Necesitas obtener el clientId desde las variables de entorno del frontend
      const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('Google Client ID no configurado');
      }

      const result = await openGooglePopup(clientId);
      
      if ('error' in result) {
        throw new Error(result.error);
      }

      // Aquí puedes manejar el código de autorización
      // y llamar a tu API para completar la autenticación
      const response = await fetch('/api/auth/google-popup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: result.code }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Error en la autenticación');
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Error en popup de Google:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Error desconocido' 
      };
    }
  };

  return { handleGooglePopupLogin };
}
