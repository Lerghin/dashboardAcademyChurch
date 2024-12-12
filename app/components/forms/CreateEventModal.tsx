import { API_URL } from "@/app/lib/config";
import { useState, useEffect } from "react";

// Definición de las propiedades que acepta el componente
interface FormModalProps {
  type: string;
  table: string;
  id?: string;
  data?: any;
  onClose?: () => void; // Agregado onClose aquí
  onSave?: () => void;
}

const CreateEventModal: React.FC<FormModalProps> = ({ table, type, onClose, onSave, id, data }) => {
  const [nameEvents, setNameEvents] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fecha_inicio, setFechaInicio] = useState<string>("");

  // Cargar datos si es un evento existente
  useEffect(() => {
    const fetchEventData = async () => {
      if (type === "update" && id) {
        try {
          const response = await fetch(`${API_URL}${table}/get/${id}`);
          if (!response.ok) {
            throw new Error("Error al obtener los datos del evento");
          }

          const eventData = await response.json();
          setNameEvents(eventData.nameEvents);
          setDescription(eventData.description);
          setFechaInicio(eventData.fecha_inicio);
        } catch (err) {
          console.error("Error:", err);
        }
      }
    };

    fetchEventData();
  }, [type, id, table]);

  const handleSubmit = async () => {
    const eventPayload = { nameEvents, description, fecha_inicio };

    try {
      let response;

      if (type === "update" && id) {
        response = await fetch(`${API_URL}${table}/update/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
      } else {
        response = await fetch(`${API_URL}events/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventPayload),
        });
      }

      if (!response.ok) {
        throw new Error("Error al guardar el evento");
      }

      const savedEvent = await response.text();

      // Llama la función onSave si es necesario
      window.location.reload(); // Recarga la página para reflejar los cambios
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{type === "update" ? "Editar Evento" : "Crear Evento"}</h2>

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
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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

        <div className="flex justify-between">
          <button
            onClick={() => {
              if (onClose) onClose(); // Llamar onClose si se pasa como propiedad
              window.location.reload(); // Recarga la página
            }}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {type === "update" ? "Guardar Cambios" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEventModal;
