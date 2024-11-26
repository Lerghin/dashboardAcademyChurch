'use client'

import { API_URL } from '@/app/lib/config';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SingleProfessorPage() {
  const { id } = useParams<string>();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}professor/get/${idProfessor}`, { cache: "no-store" });
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

  const { name, lastName, cedula, fecha_nacimiento, address, phone, email, cursos, edad } = data;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center bg-blue-500 p-6 md:p-8 text-white">
          <div className="rounded-full bg-blue-400 w-24 h-24 flex items-center justify-center text-3xl font-bold">
            {name.charAt(0)}{lastName.charAt(0)}
          </div>
          <div className="ml-6">
            <h1 className="text-3xl font-semibold">{name} {lastName}</h1>
            <p className="text-sm">Edad: {edad} años</p>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Información Personal</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Cédula:</strong> {cedula}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Fecha de Nacimiento:</strong> {fecha_nacimiento}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Dirección:</strong> {address}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Teléfono:</strong> {phone}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Email:</strong> {email || "No disponible"}</li>
          </ul>
        </div>
        <div className="p-6 md:p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Cursos Asignados</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cursos && cursos.length > 0 ? (
              cursos.map((curso, index) => (
                <li key={index} className="bg-blue-50 p-4 rounded-md shadow-md">
                  <span className="text-lg font-medium text-blue-900">{curso}</span>
                </li>
              ))
            ) : (
              <p>No hay cursos asignados</p>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
