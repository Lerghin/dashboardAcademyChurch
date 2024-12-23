'use client'
import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((state) => state.getToken());

  useEffect(() => {
    if (!token && window.location.pathname !== '/') {
      window.location.href = '/'; // Redirige a la página de login si no hay token y no estás en la página de login
    }
  }, [token]);

  return <>{children}</>;
};

export default AuthProvider;