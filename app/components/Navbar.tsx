'use client'

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { API_URL } from "../lib/config";
import { useAuthStore } from "../store/authStore";

const Navbar = () => {
    const [userName, setUserName] = useState(""); // Nombre del usuario
    const [loading, setLoading] = useState(true); // Estado de carga
    const [error, setError] = useState(null); // Estado de error
    const token = useAuthStore((state) => state.token);
    const isTokenReady = useAuthStore((state) => state.isTokenReady);

    useEffect(() => {
        // Ejecutar solo si el token está listo
        if (!isTokenReady) return;

        const fetchUsername = async () => {
            try {
                if (!token) {
                    throw new Error("Token no disponible");
                }

                const response = await fetch(`${API_URL}auth/username`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Error al obtener el nombre de usuario");
                }

                const username = await response.text(); // El backend devuelve el username como texto
                setUserName(username);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false); // Detener el estado de carga
            }
        };

        fetchUsername();
    }, [isTokenReady, token]);

    // Manejo de carga y errores
    if (loading) return <div>Cargando...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-6 justify-end w-full">
                <div className="flex flex-col">
                    <span className="text-xs leading-3 font-medium">
                        {userName}
                    </span>
                </div>
                <Image
                    src="/avatar.png"
                    alt="avatar"
                    width={36}
                    height={36}
                    className="rounded-full"
                />
            </div>
        </div>
    );
};

export default Navbar;
