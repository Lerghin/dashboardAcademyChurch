// utils/apiClient.ts
import axios from "axios";
import { useAuthStore } from "./authStore";

const apiClient = axios.create({
  baseURL: "/api", // Cambia esto según tu API
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
