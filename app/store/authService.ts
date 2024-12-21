import apiClient from "./apiClient";
import { useAuthStore } from "./authStore";

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/login", { email, password });
    const { token } = response.data;
    useAuthStore.getState().login(token);
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};

export const logout = () => {
  useAuthStore.getState().logout();
};