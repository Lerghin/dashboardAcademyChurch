import { API_URL } from '@/app/lib/config';
import { useState } from 'react';

interface Curso {
  idCurso: string;
  nombreCurso: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;

}


interface Miembro {
  nombre: string;
  apellido: string;
  cedula: string;
}
interface EditCursoModalProps {
  curso: Curso;
  onClose: () => void;
  onSave: (curso: Curso) => void;
}

export default function EditCursoModal({ curso, onClose, onSave }: EditCursoModalProps) {
  const [nombreCurso, setNombreCurso] = useState<string>(curso.nombreCurso);
  const [descripcion, setDescripcion] = useState<string>(curso.descripcion);
  const [fechaInicio, setFechaInicio] = useState<string>(curso.fecha_inicio);
  const [fechaFin, setFechaFin] = useState<string>(curso.fecha_fin);
  const [id, setId] = useState<string>(curso.idCurso);

  const handleSubmit = async () => {
    const updatedCurso = { idCurso: id, nombreCurso, descripcion, fecha_inicio: fechaInicio, fecha_fin: fechaFin };
    try {
      const response = await fetch(`${API_URL}curso/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedCurso),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error al actualizar el curso');
      onSave(updatedCurso);
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
      <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Editar Curso</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre del curso</label>
          <input
            type="text"
            value={nombreCurso}
            onChange={(e) => setNombreCurso(e.target.value)}
            placeholder="Nombre del curso"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Descripción del curso"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700">Fecha de fin</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="flex justify-between space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400 w-full"
          >
            Cerrar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}