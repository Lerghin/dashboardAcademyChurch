import { useAuthStore } from '../store/authStore';

export const API_URL = "https://iglesiaproyecto.onrender.com/";
//export const API_URL = "http://localhost:8080/";
export const getAuthHeaders = () => {
  const token = useAuthStore.getState().getToken(); // Obtener el token usando getToken
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const fetchData = async (endpoint: string, method: string = 'GET', body?: any) => {
  const options: RequestInit = {
    method,
    headers: getAuthHeaders(),
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  return response.json();
};

// Ejemplos de uso:

// GET request
export const getData = async (endpoint: string) => {
  return fetchData(endpoint, 'GET');
};

// POST request
export const postData = async (endpoint: string, data: any) => {
  return fetchData(endpoint, 'POST', data);
};

// PUT request
export const putData = async (endpoint: string, data: any) => {
  return fetchData(endpoint, 'PUT', data);
};

// DELETE request
export const deleteData = async (endpoint: string) => {
  return fetchData(endpoint, 'DELETE');
};