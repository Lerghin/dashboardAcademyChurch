'use client';

import { API_URL } from '@/app/lib/config';
import { useState, useEffect } from 'react';

// Definimos la interfaz para las propiedades del componente
interface CreateGroupsPageProps {
  type: 'create' | 'update'; // Tipo de formulario: crear o editar
  data?: { numeroGrupo: string; miembros: { cedula: string }[] }; // Datos para editar el grupo
  onClose: () => void; // Función para cerrar el modal
}

interface Student {
  idMiembro: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

const CreateGroupsPage: React.FC<CreateGroupsPageProps> = ({ type, data, onClose }) => {
  const [numeroGrupo, setNumeroGrupo] = useState<string>('');
  const [cedula, setCedula] = useState<string>('');
  const [miembroList, setMiembroList] = useState<{ cedula: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [studentsData, setStudentsData] = useState<Student[]>([]);

  // Si estamos editando, inicializamos los valores con los datos recibidos
  useEffect(() => {
    if (type === 'update' && data) {
      setNumeroGrupo(data.numeroGrupo);
      setMiembroList(data.miembros);
    }
  }, [type, data]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}miembro/get`, { cache: "no-store" });
      const data: Student[] = await response.json();
      setStudentsData(data);
    };
    fetchData();
  }, []);

  const handleNumeroGrupoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumeroGrupo(e.target.value);
  };

  const handleCedulaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCedula(e.target.value);
  };

  const handleAddMember = () => {
    if (!cedula || miembroList.some((m) => m.cedula === cedula)) {
      setError('Ingrese una cédula válida y que no esté repetida');
      return;
    }
    setMiembroList([...miembroList, { cedula }]);
    setCedula('');
    setError(null);
  };

  const handleRemoveMember = (cedulaToRemove: string) => {
    setMiembroList(miembroList.filter((m) => m.cedula !== cedulaToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroGrupo || miembroList.length === 0) {
      setError('Debe ingresar un número de grupo y al menos un miembro.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}grupo/${type === 'update' ? 'update' : 'create'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroGrupo, miembroList }),
      });

      if (!response.ok) throw new Error('Error al crear o actualizar el grupo');

      setNumeroGrupo('');
      setMiembroList([]);
      setSuccess('Grupo ' + (type === 'update' ? 'actualizado' : 'creado') + ' con éxito');
      setError(null);
      onClose(); // Cerrar el modal después de crear/actualizar
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al ' + (type === 'update' ? 'actualizar' : 'crear') + ' el grupo');
      setSuccess(null);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            {type === 'update' ? 'Editar Grupo' : 'Crear Nuevo Grupo'}
          </h2>

          {success && <div className="bg-green-200 p-4 mb-4 text-green-800 rounded-md">{success}</div>}
          {error && <div className="bg-red-200 p-4 mb-4 text-red-800 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="numeroGrupo"
                value={numeroGrupo}
                onChange={handleNumeroGrupoChange}
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese el número del grupo"
              />
            </div>

            <div className="mb-4 flex gap-2">
              <select
                name="cedula"
                value={cedula}
                onChange={handleCedulaChange}
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Seleccione un miembro</option>
                {studentsData.map((student) => (
                  <option key={student.idMiembro} value={student.cedula}>
                    {student.nombre} {student.apellido} - {student.cedula}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAddMember}
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
              >
                Agregar
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Miembros Agregados:</h3>
              <ul className="list-disc pl-5">
                {miembroList.map((m) => (
                  <li key={m.cedula} className="flex justify-between items-center">
                    {m.cedula} 
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.cedula)}
                      className="text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={onClose} // Cerrar el modal al hacer clic en "Cancelar"
                className="px-6 py-2 bg-gray-400 text-white rounded-md"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
              >
                {type === 'update' ? 'Actualizar Grupo' : 'Crear Grupo'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupsPage;
