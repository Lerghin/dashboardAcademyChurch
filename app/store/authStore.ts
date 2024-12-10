import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isTokenReady: boolean; // Nuevo estado para saber si el token ya se cargó
  setToken: (token: string | null) => void;
  logout: () => void;
  getToken: () => string | null; // Agregar un getter para el token
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isTokenReady: false, // Estado para manejar la preparación del token
      setToken: (token) => {
        set({ token, isTokenReady: true }); // Establecer el token y marcar el estado listo
      },
      logout: () => {
        set({ token: null, isTokenReady: false }); // Limpiar el token
        localStorage.removeItem('auth-token-storage'); // Eliminar token del localStorage
      },
      getToken: () => {
        const state = get(); // Obtener el estado actual
        return state.token; // Retornar el token actual
      }
    }),
    {
      name: 'auth-token-storage', // Nombre clave para localStorage
      getStorage: () => localStorage,
    }
  )
);
