'use client';

import { API_URL } from '@/app/lib/config';
import { useState } from 'react';

export default function CreateGroupsPage() {
  const [numeroGrupo, setNumeroGrupo] = useState('');
  const [cedula, setCedula] = useState('');
  const [miembroList, setMiembroList] = useState<{ cedula: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Maneja cambios en el número del grupo
  const handleNumeroGrupoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumeroGrupo(e.target.value);
  };

  // Maneja cambios en el campo de cédula
  const handleCedulaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCedula(e.target.value);
  };

  // Agrega un miembro a la lista
  const handleAddMember = () => {
    if (!cedula || miembroList.some((m) => m.cedula === cedula)) {
      setError('Ingrese una cédula válida y que no esté repetida');
      return;
    }
    setMiembroList([...miembroList, { cedula }]);
    setCedula('');
    setError(null);
  };

  // Elimina un miembro de la lista
  const handleRemoveMember = (cedulaToRemove: string) => {
    setMiembroList(miembroList.filter((m) => m.cedula !== cedulaToRemove));
  };

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!numeroGrupo || miembroList.length === 0) {
      setError('Debe ingresar un número de grupo y al menos un miembro.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}grupo/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroGrupo, miembroList }),
      });

      if (!response.ok) throw new Error('Error al crear el grupo');

      setNumeroGrupo('');
      setMiembroList([]);
      setSuccess('Grupo creado con éxito');
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al crear el grupo');
      setSuccess(null);
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden w-full">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            Crear Nuevo Grupo
          </h2>

          {/* Mensajes de éxito o error */}
          {success && <div className="bg-green-200 p-4 mb-4 text-green-800 rounded-md">{success}</div>}
          {error && <div className="bg-red-200 p-4 mb-4 text-red-800 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Campo para el número del grupo */}
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

            {/* Campo para la cédula */}
            <div className="mb-4 flex gap-2">
              <input
                type="text"
                name="cedula"
                value={cedula}
                onChange={handleCedulaChange}
                className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ingrese la cédula"
              />
              <button
                type="button"
                onClick={handleAddMember}
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
              >
                Agregar
              </button>
            </div>

            {/* Lista de miembros */}
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

            {/* Botones */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => {
                  setNumeroGrupo('');
                  setMiembroList([]);
                }}
                className="px-6 py-2 bg-gray-400 text-white rounded-md"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-500 text-white rounded-md"
              >
                Crear Grupo
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
