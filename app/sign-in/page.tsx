// pages/login.tsx
import { useState } from 'react';
import { useAuthDispatch } from '../store/store';
import { setToken } from '../store/store';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAuthDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(setToken(data.token));
    } else {
      console.error('Error en la autenticación');
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <label>Usuario:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

export default LoginPage;
