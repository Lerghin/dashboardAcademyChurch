// services/authService.ts
import apiClient from "./apiClient";
import { useAuthStore } from "./authStore";

export const login = async (email: string, password: string) => {
  const response = await apiClient.post("/login", { email, password });
  const { token } = response.data;
  useAuthStore.getState().login(token);
};

export const logout = () => {
  useAuthStore.getState().logout();
};
