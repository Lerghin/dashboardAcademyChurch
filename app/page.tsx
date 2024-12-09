'use client'
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Limpiar errores previos

    try {
      const response = await fetch('/api/login', { // Cambia esta URL por tu punto de acceso a la API
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Credenciales incorrectas');
      }

      const data = await response.json();
      console.log('Respuesta de la API:', data);

      // Guardar el token en localStorage o sessionStorage
      if (data.token) {
        sessionStorage.setItem('token', data.token);
        alert('¡Inicio de sesión exitoso!');
        // Redirigir a otra página después del login
        window.location.href = '/dashboard'; // Cambia a la ruta de tu dashboard
      } else {
        throw new Error('No se recibió el token');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-indigo-500">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Iniciar Sesión</h2>
        
        {/* Mensaje de error */}
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleLogin}>
          {/* Campo de Nombre de Usuario */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="username">
              Nombre de usuario
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Campo de Contraseña */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2" htmlFor="password">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Botón de Envío */}
          <button
            type="submit"
            className={`w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md shadow-md transition duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* Mensaje de pie */}
        <p className="text-sm text-gray-500 mt-4 text-center">
          ¿No tienes cuenta? <a href="/register" className="text-purple-500 hover:underline">Regístrate aquí</a>
        </p>
      </div>
    </div>
  );
}
