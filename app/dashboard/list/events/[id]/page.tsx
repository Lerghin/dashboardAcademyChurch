'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/app/lib/config";

// Define la estructura de un evento
interface Event {
  nameEvents: string;
  fecha_inicio: string;
  description: string;
}

export default function EventDetail() {
  const { id } = useParams();

  // Tipado explícito para event
  const [event, setEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nameEvents: "",
    fecha_inicio: "",
    description: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}events/get/${id}`, { cache: "no-store" });
        if (!response.ok) throw new Error("Error en la solicitud");
        const result: Event = await response.json();
        setFormData(result);
        setEvent(result);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchData();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!event) return <p>Cargando datos del evento...</p>;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Error al guardar los cambios");

      const updatedEvent = await response.json();
      setEvent(updatedEvent);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {!isEditing ? (
          <>
            <h1 className="text-2xl font-semibold text-blue-700 mb-4">
              {event.nameEvents}
            </h1>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Fecha de inicio:</strong> {event.fecha_inicio}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Descripción:</strong> {event.description}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white p-2 rounded-md"
            >
              Editar Evento
            </button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <h1 className="text-2xl font-semibold text-blue-700 mb-4">Editar Evento</h1>
            <input
              type="text"
              name="nameEvents"
              value={formData.nameEvents}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="Nombre del Evento"
              required
            />
            <input
              type="date"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded-md"
              required
            />
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="Descripción"
              rows={4}
              required
            ></textarea>
            <div className="flex space-x-4">
              <button type="submit" className="bg-green-500 text-white p-2 rounded-md">
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
