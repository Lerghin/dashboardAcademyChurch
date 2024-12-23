import { create } from 'zustand';
import { persist, PersistStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  isTokenReady: boolean; // Nuevo estado para saber si el token ya se cargó
  setToken: (token: string | null) => void;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null; // Agregar un getter para el token
}

const localStoragePersist: PersistStorage<AuthState> = {
  getItem: (name) => {
    const item = localStorage.getItem(name);
    return item ? JSON.parse(item) : null;
  },
  setItem: (name, value) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      isTokenReady: false, // Estado para manejar la preparación del token
      setToken: (token: string | null) => set({ token, isTokenReady: true }),
      login: (token: string) => {
        set({ token, isTokenReady: true });
        localStorage.setItem('auth-token-storage', JSON.stringify({ state: { token, isTokenReady: true }, version: 0 }));
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
      storage: localStoragePersist,
    }
  )
);