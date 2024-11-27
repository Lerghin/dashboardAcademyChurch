'use client';

import { API_URL } from '@/app/lib/config';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GrupoPage() {
  const { id} = useParams<string>();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}grupo/get/${id}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error en la solicitud');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Cargando...</p>;

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  const { numeroGrupo, miembroList } = data;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex justify-between items-center bg-blue-500 p-6 md:p-8 text-white">
          <h1 className="text-3xl font-semibold">Grupo {numeroGrupo}</h1>
          <button onClick={handleModalToggle} className="text-2xl bg-white text-blue-500 p-2 rounded-full hover:bg-blue-100">
            ✏️
          </button>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Miembros del Grupo</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {miembroList.map((miembro) => (
              <li key={miembro.idMiembro} className="bg-blue-50 p-4 rounded-md shadow-md flex justify-between items-center">
                <span className="text-lg font-medium text-blue-900">{miembro.nombre} {miembro.apellido}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 h-screen">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Editar Grupo</h2>
            {/* Aquí iría el formulario de edición */}
            <button
              onClick={handleModalToggle}
              className="mt-4 bg-gray-500 text-white p-2 rounded-md w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
