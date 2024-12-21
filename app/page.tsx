"use client";

import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import { API_URL } from "@/app/lib/config";

const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!userName || !password) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}login`, {
        userName,
        password,
      });
      // Handle successful login
      setIsLoading(false);
    } catch (error) {
      setErrorMessage("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
      setIsLoading(false);
    }
  };


  return (
    <>
      <style jsx>{`
        .login-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2f3, #8e9eab);
          font-family: Arial, sans-serif;
        }

        .login-box {
          background: #ffffff;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 20px;
          width: 100%;
          max-width: 400px;
        }

        .login-title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          color: #333;
          margin-bottom: 20px;
        }

        .error-message {
          color: #e74c3c;
          font-size: 14px;
          text-align: center;
          margin-bottom: 15px;
        }

        .form-group {
          margin-bottom: 15px;
        }

        .form-label {
          display: block;
          font-weight: bold;
          color: #555;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
          color: #555;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }

        .form-input:focus {
          border-color: #3498db;
          outline: none;
          box-shadow: 0 0 4px rgba(52, 152, 219, 0.5);
        }

        .login-button {
          width: 100%;
          padding: 10px;
          background: #3498db;
          color: white;
          font-weight: bold;
          font-size: 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .login-button:hover {
          background: #2980b9;
        }

        .login-button:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .login-box {
            padding: 15px;
          }

          .login-title {
            font-size: 20px;
          }

          .form-input {
            font-size: 13px;
          }

          .login-button {
            font-size: 14px;
          }
        }
      `}</style>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">Inicio de Sesión</h2>

          {/* Mensaje de error */}
          {errorMessage && <div className="error-message">{errorMessage}</div>}

          {/* Campo de Usuario */}
          <div className="form-group">
            <label className="form-label" htmlFor="username">
              Usuario
            </label>
            <input
              type="text"
              id="username"
              placeholder="Ingresa tu usuario"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Campo de Contraseña */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Botón de Inicio de Sesión */}
          <button
            onClick={handleLogin}
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Iniciar Sesión"}
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
