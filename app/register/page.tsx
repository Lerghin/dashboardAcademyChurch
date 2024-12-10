"use client";

import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "@/app/store/authStore";
import { API_URL } from "@/app/lib/config";

const RegisterPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Campo para confirmar la contraseña
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    if (!userName || !password || !confirmPassword) {
      setErrorMessage("Por favor, completa todos los campos.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await axios.post(`${API_URL}auth/register`, {
        userName,
        password,
      });

      const { token, user } = response.data;

      // Guardar token y usuario en Zustand
      useAuthStore.getState().setToken(token);

      alert("Registro exitoso");
      window.location.href = "/dashboard/admin"; // Redirigir al dashboard después del registro exitoso
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage("El usuario ya existe.");
      } else {
        setErrorMessage("Error al conectar con el servidor. Intenta nuevamente más tarde.");
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    window.location.href = "/dashboard/admin"; // Redirigir al dashboard al hacer clic en "Atrás"
  };

  return (
    <>
      <style jsx>{`
        .register-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #eef2f3, #8e9eab);
          font-family: Arial, sans-serif;
        }

        .register-box {
          background: #ffffff;
          box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 20px;
          width: 100%;
          max-width: 400px;
        }

        .register-title {
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

        .register-button,
        .back-button {
          width: 100%;
          padding: 10px;
          font-weight: bold;
          font-size: 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.2s;
        }

        .register-button {
          background: #3498db;
          color: white;
        }

        .register-button:hover {
          background: #2980b9;
        }

        .register-button:disabled {
          background: #95a5a6;
          cursor: not-allowed;
        }

        .back-button {
          background: #95a5a6;
          color: white;
          margin-top: 10px;
        }

        .back-button:hover {
          background: #7f8c8d;
        }

        @media (max-width: 768px) {
          .register-box {
            padding: 15px;
          }

          .register-title {
            font-size: 20px;
          }

          .form-input {
            font-size: 13px;
          }

          .register-button,
          .back-button {
            font-size: 14px;
          }
        }
      `}</style>
      <div className="register-container">
        <div className="register-box">
          <h2 className="register-title">Registro de Usuario</h2>

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

          {/* Campo para confirmar la contraseña */}
          <div className="form-group">
            <label className="form-label" htmlFor="confirm-password">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirma tu contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
            />
          </div>

          {/* Botón de Registro */}
          <button
            onClick={handleRegister}
            className="register-button"
            disabled={isLoading}
          >
            {isLoading ? "Cargando..." : "Registrar"}
          </button>

          {/* Botón de Atrás */}
          <button onClick={handleGoBack} className="back-button">
            Atrás
          </button>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
