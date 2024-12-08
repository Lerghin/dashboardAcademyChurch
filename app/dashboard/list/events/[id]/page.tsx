'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import { API_URL } from '@/app/lib/config';
import { Link } from 'react-router-dom';




export default function EventDetail() {
    const { id } = useParams<string>();
  

  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nameEvents: '',
    fecha_inicio: '',
    description: '',
  });

  // Obtener los datos del evento por ID
  useEffect(() => {
    if (!id) return; // Verifica que el ID esté disponible

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}events/get/${id}`, { cache: "no-store" });
        if (!response.ok) throw new Error('Error en la solicitud');
        const result = await response.json();
        setFormData(result); // Pre-cargar datos en el formulario
        setEvent(result)
        
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [id]); // Asegúrate de que el hook useEffect se ejecute cuando cambie el ID

  if (error) return <p>Error: {error}</p>;
  if (!formData.nameEvents) return <p>Cargando...</p>;

  // Manejo del formulario de edición
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error al guardar los cambios');

      const updatedEvent = await response.json();
      setEvent(updatedEvent); // Actualiza los datos del evento
      setIsEditing(false); // Sale del modo de edición
    } catch (error) {
      console.error(error);
    }
  };

  if (!event) {
    return <p className="text-center">Cargando datos del evento...</p>;
  }

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
            <h1 className="text-2xl font-semibold text-blue-700 mb-4">
              Editar Evento
            </h1>
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
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded-md"
              >
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
