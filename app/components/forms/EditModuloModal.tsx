import { API_URL } from '@/app/lib/config';
import { useState } from 'react';

interface Modulo {
  numModulo: string;
  descripcion: string;
}

interface EditModuloModalProps {
  id: string;
  onClose: () => void;
  onSave: (modulo: Modulo) => void;
  modulo?: Modulo;
}

const EditModuloModal: React.FC<EditModuloModalProps> = ({ id, onClose, onSave, modulo }) => {
  const [numModulo, setNumModulo] = useState<string>(modulo?.numModulo || '');
  const [descripcion, setDescripcion] = useState<string>(modulo?.descripcion || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSaveModulo = async () => {
    setIsLoading(true);
    const newModulo = { numModulo, descripcion };

    try {
      const response = await fetch(`${API_URL}modulo/create/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newModulo),
      });

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar el módulo');
      }

      alert(data.message || 'Módulo guardado con éxito');

      onClose(); // Cerrar el modal
      window.location.reload();
      
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert("An unknown error occurred");
      }
    } finally {
      setIsLoading(false);
    }
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
            onClick={handleSaveModulo}
            disabled={isLoading} // Deshabilitar el botón mientras se realiza la petición
            className={`px-4 py-2 rounded-md ${isLoading ? 'bg-gray-300' : 'bg-blue-500 text-white'} hover:bg-blue-600`}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};
export default EditModuloModal;