// EditProfesorModal.tsx
import { API_URL } from '@/app/lib/config';
import { useState } from 'react';

interface Profesor {
  name: string;
  lastName: string;
  cedula: string;
}

interface EditProfesorModalProps {
  cursoId: string;
  onClose: () => void;
  onSave: (profesor: Profesor) => void;
  profesor?: Profesor;
}

const EditProfesorModal: React.FC<EditProfesorModalProps> = ({ cursoId, onClose, onSave, profesor }) => {
  const [name, setName] = useState<string>(profesor?.name || '');
  const [lastName, setLastName] = useState<string>(profesor?.lastName || '');
  const [cedula, setCedula] = useState<string>(profesor?.cedula || '');

  const handleSubmit = async () => {
    const newProfesor = { name, lastName, cedula, cursoId }; // Incluye cursoId en el objeto
    try {
      const response = await fetch(`${API_URL}curso/${cedula}/${cursoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfesor),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar el profesor");
      }
  
      const savedProfesor = await response.text();
    
      onClose();
      window.location.reload();
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };
  

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{profesor ? 'Editar Profesor' : 'Agregar Profesor'}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cédula</label>
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
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

export default EditProfesorModal;
