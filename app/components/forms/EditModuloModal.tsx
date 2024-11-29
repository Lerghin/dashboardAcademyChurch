// EditModuloModal.tsx
import { useState } from 'react';

interface Modulo {
  numModulo: string;
  descripcion: string;
}

interface EditModuloModalProps {
  cursoId: string;
  onClose: () => void;
  onSave: (modulo: Modulo) => void;
  modulo?: Modulo;
}

const EditModuloModal: React.FC<EditModuloModalProps> = ({ cursoId, onClose, onSave, modulo }) => {
  const [numModulo, setNumModulo] = useState<string>(modulo?.numModulo || '');
  const [descripcion, setDescripcion] = useState<string>(modulo?.descripcion || '');

  const handleSubmit = async () => {
    const newModulo = { numModulo, descripcion };
    // Aquí podrías hacer un fetch a tu API para guardar el nuevo módulo
    // Por ejemplo: await fetch('tu-api/modulo', { method: 'POST', body: JSON.stringify(newModulo) });
    onSave(newModulo);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{modulo ? 'Editar Módulo' : 'Agregar Módulo'}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Número de Módulo</label>
          <input
            type="text"
            value={numModulo}
            onChange={(e) => setNumModulo(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
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

export default EditModuloModal;
