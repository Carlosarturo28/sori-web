'use client'; // Marca esto como un Client Component

import React from 'react';

interface OpenInAppButtonProps {
  appDeepLink: string;
  appStoreUrl: string;
  playStoreUrl: string;
  buttonStyle?: React.CSSProperties; // Hacerlo opcional si tienes estilos por defecto
  buttonText?: string;
}

const OpenInAppButton: React.FC<OpenInAppButtonProps> = ({
  appDeepLink,
  appStoreUrl,
  playStoreUrl,
  buttonStyle, // Usar este estilo o uno por defecto
  buttonText = 'Abrir en la App de Sori', // Texto por defecto
}) => {
  const openAppOrStore = () => {
    // Intenta abrir el deep link de la app
    window.location.href = appDeepLink;

    // Fallback a la tienda después de un pequeño delay
    // Si la app se abre, esta parte no debería ejecutarse porque el navegador pierde el foco.
    const fallbackTimeout = setTimeout(() => {
      const userAgent =
        navigator.userAgent ||
        navigator.vendor ||
        (window as Window & typeof globalThis & { opera?: unknown }).opera;
      if (/android/i.test(userAgent as string)) {
        window.location.href = playStoreUrl;
      } else if (
        /iPad|iPhone|iPod/.test(userAgent as string) &&
        !(window as Window & typeof globalThis & { MSStream?: unknown })
          .MSStream
      ) {
        window.location.href = appStoreUrl;
      }
    }, 2500); // 2.5 segundos de espera

    // Limpiar el timeout si la app se abre y la pestaña del navegador se vuelve invisible
    const handleVisibilityChange = () => {
      if (
        document.hidden ||
        (document as Document & { webkitHidden?: boolean }).webkitHidden
      ) {
        clearTimeout(fallbackTimeout);
        document.removeEventListener(
          'visibilitychange',
          handleVisibilityChange
        );
        document.removeEventListener(
          'webkitvisibilitychange',
          handleVisibilityChange
        );
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('webkitvisibilitychange', handleVisibilityChange); // Para compatibilidad con Safari
  };

  const defaultButtonStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '12px 30px',
    fontSize: '1.15em',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#3498db', // Un azul atractivo
    border: 'none',
    borderRadius: '5px',
    textDecoration: 'none',
    cursor: 'pointer',
    marginBottom: '20px',
    transition: 'background-color 0.2s ease',
  };

  return (
    <button onClick={openAppOrStore} style={buttonStyle || defaultButtonStyle}>
      {buttonText}
    </button>
  );
};
export default OpenInAppButton;
