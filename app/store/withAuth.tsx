"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "../store/authStore"; // Tu store de Zustand

const withAuth = (WrappedComponent: React.ComponentType) => {
  const RequiresAuth = (props: any) => {
    const token = useAuthStore((state) => state.token);
    const [isVerified, setIsVerified] = useState(false); // Controla si ya se verificó el token

    useEffect(() => {
      if (!token) {
        // Redirige al login si no hay token
        window.location.href = "/";
      } else {
        setIsVerified(true); // Si hay token, permite el acceso
      }
    }, [token]);

    // Muestra una pantalla de carga mientras se verifica el token
    if (!isVerified) {
      return (
        <div className="flex items-center justify-center h-screen">
          <p>Verificando autenticación...</p>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return RequiresAuth;
};

export default withAuth;
