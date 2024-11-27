'use client';

import { API_URL } from '@/app/lib/config';
import { useState } from 'react';

export default function CreateProfessorPage() {
  const [error, setError] = useState(null);
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

  // Manejo de cambio de datos en el formulario
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
      const response = await fetch(`${API_URL}profe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error al crear el profesor');

      // Muestra mensaje de éxito
      alert('Profesor creado exitosamente');
      // Reinicia el formulario después de la creación
      setFormData({
        name: '',
        lastName: '',
        cedula: '',
        fecha_nacimiento: '',
        address: '',
        phone: '',
        email: '',
        cursos: [],
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Cabecera */}
        <div className="flex items-center bg-blue-500 p-6 md:p-8 text-white">
          <div className="rounded-full bg-blue-400 w-24 h-24 flex items-center justify-center text-3xl font-bold">
            C
          </div>
          <div className="ml-6 flex-1">
            <h1 className="text-3xl font-semibold">Crear Profesor</h1>
          </div>
        </div>

        {/* Formulario de creación */}
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Información Personal</h2>
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

            {/* Cursos asignados */}
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
              <button type="reset" className="px-4 py-2 bg-gray-300 text-black rounded">Limpiar</button>
              <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Guardar</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
