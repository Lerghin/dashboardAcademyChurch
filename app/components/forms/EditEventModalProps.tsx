import { API_URL } from '@/app/lib/config';
import { useState } from 'react';

interface NotaMiembro {
  idNota?: string;
  idModulo: string;
  nota: number;
  cedula: string;
  aprobacionCurso: string; // Puedes ajustar esto según el tipo de `AprobacionCurso`
}

interface EditNotaModalProps {
  onClose: () => void;
  onSave: (notaMiembro: NotaMiembro) => void;
  notaMiembro?: NotaMiembro;
}

const EditNotaModal: React.FC<EditNotaModalProps> = ({ onClose, onSave, notaMiembro }) => {
  const [idModulo, setIdModulo] = useState<string>(notaMiembro?.idModulo || '');
  const [nota, setNota] = useState<number>(notaMiembro?.nota || 0);
  const [cedula, setCedula] = useState<string>(notaMiembro?.cedula || '');
  const [aprobacionCurso, setAprobacionCurso] = useState<string>(notaMiembro?.aprobacionCurso || '');

  const handleSubmit = async () => {
    const newNotaMiembro: NotaMiembro = { idModulo, nota, cedula, aprobacionCurso };
    if (notaMiembro?.idNota) {
      newNotaMiembro.idNota = notaMiembro.idNota;
    }

    try {
      const url = notaMiembro?.idNota
        ? `${API_URL}nota/${notaMiembro.idNota}` // Endpoint para editar
        : `${API_URL}nota`; // Endpoint para crear
      const method = notaMiembro?.idNota ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newNotaMiembro),
      });

      if (!response.ok) {
        throw new Error('Error al guardar la nota');
      }

      const savedNota = await response.json();
      onSave(savedNota);
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
          {notaMiembro ? 'Editar Nota' : 'Agregar Nota'}
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">ID Módulo</label>
          <input
            type="text"
            value={idModulo}
            onChange={(e) => setIdModulo(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nota</label>
          <input
            type="number"
            value={nota}
            onChange={(e) => setNota(parseFloat(e.target.value))}
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Aprobación Curso</label>
          <input
            type="text"
            value={aprobacionCurso}
            onChange={(e) => setAprobacionCurso(e.target.value)}
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

export default EditNotaModal;
