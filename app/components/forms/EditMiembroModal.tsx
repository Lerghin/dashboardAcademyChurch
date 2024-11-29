// EditMiembroModal.tsx
import { useState } from 'react';

interface Miembro {
  nombre: string;
  apellido: string;
  cedula: string;
}

interface EditMiembroModalProps {
  cursoId: string;
  onClose: () => void;
  onSave: (miembro: Miembro) => void;
  miembro?: Miembro; // Si estamos editando un miembro, pasamos los datos
}

const EditMiembroModal: React.FC<EditMiembroModalProps> = ({ cursoId, onClose, onSave, miembro }) => {
  const [nombre, setNombre] = useState<string>(miembro?.nombre || '');
  const [apellido, setApellido] = useState<string>(miembro?.apellido || '');
  const [cedula, setCedula] = useState<string>(miembro?.cedula || '');

  const handleSubmit = async () => {
    const newMiembro = { nombre, apellido, cedula };
    // Aquí podrías hacer un fetch a tu API para guardar el nuevo miembro
    // Por ejemplo: await fetch('tu-api/miembro', { method: 'POST', body: JSON.stringify(newMiembro) });
    onSave(newMiembro);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{miembro ? 'Editar Miembro' : 'Agregar Miembro'}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
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

export default EditMiembroModal;
