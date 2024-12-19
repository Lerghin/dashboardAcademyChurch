'use client'

import { API_URL } from '@/app/lib/config';
import { useState } from 'react';

interface Event {
  idEvents?: string;
  nameEvents: string;
  fecha_inicio: string; // En formato 'yyyy-MM-dd'
  description: string;
}

interface EditEventModalProps {
  onClose: () => void;
  onSave: (event: Event) => void;
  event?: Event;
}

const EditEventModal: React.FC<EditEventModalProps> = ({ onClose, onSave, event }) => {
  const [nameEvents, setNameEvents] = useState<string>(event?.nameEvents || '');
  const [fecha_inicio, setFechaInicio] = useState<string>(event?.fecha_inicio || '');
  const [description, setDescription] = useState<string>(event?.description || '');

  const handleSubmit = async () => {
    const newEvent: Event = { nameEvents, fecha_inicio, description };
    if (event?.idEvents) {
      newEvent.idEvents = event.idEvents;
    }

    try {
      const url = event?.idEvents
        ? `${API_URL}events/${event.idEvents}` // Endpoint para editar
        : `${API_URL}events`; // Endpoint para crear
      const method = event?.idEvents ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (!response.ok) {
        throw new Error('Error al guardar el evento');
      }

      const savedEvent = await response.json();
      onSave(savedEvent);
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          {event ? 'Editar Evento' : 'Agregar Evento'}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre del Evento</label>
          <input
            type="text"
            value={nameEvents}
            onChange={(e) => setNameEvents(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
          <input
            type="date"
            value={fecha_inicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            rows={3}
          />
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEventModal;
