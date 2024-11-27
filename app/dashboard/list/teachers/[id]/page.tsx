'use client';

import { API_URL } from '@/app/lib/config';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SingleProfessorPage() {
  const { id } = useParams(); // Obtiene el ID del profesor desde la URL
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    cedula: '',
    fecha_nacimiento: '',
    address: '',
    phone: '',
    email: '',
    cursos: [],
  });

  // Obtiene los datos del profesor
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}profe/get/${id}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error en la solicitud');
        const result = await response.json();
        setData(result);

        // Inicializar datos del formulario
        setFormData({
          name: result.name,
          lastName: result.lastName,
          cedula: result.cedula,
          fecha_nacimiento: result.fecha_nacimiento,
          address: result.address,
          phone: result.phone,
          email: result.email || '',
          cursos: result.cursos || [],
        });
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [id]);

  // Manejo de estados: error, cargando y datos disponibles
  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Cargando...</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCursosChange = (e, index) => {
    const newCursos = [...formData.cursos];
    newCursos[index] = e.target.value;
    setFormData((prev) => ({ ...prev, cursos: newCursos }));
  };

  const addCurso = () => {
    setFormData((prev) => ({ ...prev, cursos: [...prev.cursos, ''] }));
  };

  const removeCurso = (index) => {
    const newCursos = formData.cursos.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, cursos: newCursos }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}profe/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error al actualizar los datos');

      // Actualiza el estado de los datos con los nuevos valores
      setData({
        ...data,
        name: formData.name,
        lastName: formData.lastName,
        cedula: formData.cedula,
        fecha_nacimiento: formData.fecha_nacimiento,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        cursos: formData.cursos,
      });

      // Cierra el modal y muestra un mensaje de éxito
      alert('Datos actualizados exitosamente');
      setShowModal(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const { name, lastName, cedula, fecha_nacimiento, address, phone, email, cursos, edad } = data;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden ">
        {/* Cabecera con nombre e iniciales */}
        <div className="flex items-center bg-blue-500 p-6 md:p-8 text-white">
          <div className="rounded-full bg-blue-400 w-24 h-24 flex items-center justify-center text-3xl font-bold">
            {name.charAt(0)}{lastName.charAt(0)}
          </div>
          <div className="ml-6 flex-1">
            <h1 className="text-3xl font-semibold">{name} {lastName}</h1>
            <p className="text-sm">Edad: {edad} años</p>
          </div>
          {/* Botón para abrir el modal */}
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto text-white bg-blue-700 hover:bg-blue-600 rounded-full p-2"
            title="Editar"
          >
            ✏️
          </button>
        </div>

        {/* Información personal */}
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Información Personal</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Cédula:</strong> {cedula}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Fecha de Nacimiento:</strong> {new Date(fecha_nacimiento).toLocaleDateString('es-VE')}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Dirección:</strong> {address}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Teléfono:</strong> {phone}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Email:</strong> {email || 'No disponible'}</li>
          </ul>
        </div>

        {/* Cursos asignados */}
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

      {/* Modal para editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">Editar Información</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Nombre" className="p-2 border rounded" />
                <input name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Apellido" className="p-2 border rounded" />
                <input name="cedula" value={formData.cedula} onChange={handleInputChange} placeholder="Cédula" className="p-2 border rounded" />
                <input name="fecha_nacimiento" type="date" value={formData.fecha_nacimiento} onChange={handleInputChange} className="p-2 border rounded" />
                <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Dirección" className="p-2 border rounded" />
                <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Teléfono" className="p-2 border rounded" />
                <input name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" className="p-2 border rounded" />
              </div>

              <div className="mb-4">
                <h3 className="text-blue-600 font-semibold">Cursos Asignados</h3>
                {formData.cursos.map((curso, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      value={curso}
                      onChange={(e) => handleCursosChange(e, index)}
                      className="p-2 border rounded mr-2"
                      placeholder="Curso"
                    />
                    <button type="button" onClick={() => removeCurso(index)} className="text-red-500">Eliminar</button>
                  </div>
                ))}
                <button type="button" onClick={addCurso} className="text-blue-500">Agregar Curso</button>
              </div>

              <div className="flex justify-between">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 text-black rounded">Cancelar</button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
