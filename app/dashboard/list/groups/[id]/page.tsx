'use client';

import { API_URL } from '@/app/lib/config';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GrupoPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [cedula, setCedula] = useState('');
  const [nombreGrupo, setNombreGrupo] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}grupo/get/${id}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error en la solicitud');
        const result = await response.json();
        setData(result);
        setNombreGrupo(result.numeroGrupo);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    fetchData();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Cargando...</p>;

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);
  const handleEditToggle = () => setIsEditOpen(!isEditOpen);

  const handleAddMember = async (cedula: string) => {
    if (!cedula.trim()) {
      setError('La cédula no puede estar vacía');
      return;
    }

    setLoading(true);
    setSuccessMessage('');
    setError('');
    try {
      const response = await fetch(`${API_URL}grupo/add-member/${id}?cedula=${cedula}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData);
      }

      const updatedGroup = await response.json();
      setData(updatedGroup);
      setCedula('');
      setSuccessMessage('Miembro agregado con éxito');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (idMiembro: string) => {
    if (!confirm('¿Seguro que deseas eliminar este miembro?')) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}grupo/remove-member/${id}?idMiembro=${idMiembro}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error al eliminar el miembro');

      const updatedGroup = await response.json();
      setData(updatedGroup);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEditGroupName = async () => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const response = await fetch(`${API_URL}grupo/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numeroGrupo: nombreGrupo }),
      });

      if (!response.ok) throw new Error('Error al editar el nombre del grupo');

      const updatedGroup = await response.json();
      setData(updatedGroup);
      setIsEditOpen(false);
      setSuccessMessage('Nombre del grupo actualizado con éxito');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  const { miembroList } = data;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-blue-500 p-6 md:p-8 text-white">
          <h1 className="text-3xl font-semibold">Grupo {nombreGrupo}</h1>
          <div className="space-x-4">
            <button
              onClick={handleEditToggle}
              className="text-2xl bg-white text-blue-500 p-2 rounded-full hover:bg-blue-100"
            >
              🖊️
            </button>
            <button
              onClick={handleModalToggle}
              className="text-2xl bg-white text-blue-500 p-2 rounded-full hover:bg-blue-100"
            >
              ➕
            </button>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Miembros del Grupo</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {miembroList.map((miembro) => (
              <li
                key={miembro.idMiembro}
                className="bg-blue-50 p-4 rounded-md shadow-md flex justify-between items-center"
              >
                <span className="text-lg font-medium text-blue-900">
                  {miembro.nombre} {miembro.apellido}
                </span>
                <button
                  onClick={() => handleRemoveMember(miembro.idMiembro)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 h-screen">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Agregar Miembro</h2>
            <div className="mb-4">
              <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">
                Cédula del Miembro
              </label>
              <input
                id="cedula"
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            {successMessage && (
              <p className="text-green-600 font-medium">{successMessage}</p>
            )}
            {error && (
              <p className="text-red-600 font-medium">{error}</p>
            )}
            <div className="flex justify-between mt-6">
              <button
                onClick={() => handleAddMember(cedula)}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {loading ? 'Agregando...' : 'Agregar'}
              </button>
              <button
                onClick={handleModalToggle}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 h-screen">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Editar Nombre del Grupo</h2>
            <div className="mb-4">
              <label htmlFor="nombreGrupo" className="block text-sm font-medium text-gray-700">
                Nombre del Grupo
              </label>
              <input
                id="nombreGrupo"
                type="text"
                value={nombreGrupo}
                onChange={(e) => setNombreGrupo(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={handleEditGroupName}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
              <button
                onClick={handleEditToggle}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
