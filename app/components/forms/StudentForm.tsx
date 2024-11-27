'use client'

import { API_URL } from '@/app/lib/config';
import { useState } from 'react';

export default function CreateStudentPage() {
  const [formData, setFormData] = useState({
    cedula: '',
    nombre: '',
    apellido: '',
    fecha_nacimiento: '',
    direccion: '',
    ocupacion: '',
    telefono: '',
    sexo: '',
    status: '',
    fecha_ingreso: '',
    cursosRealizados: {},
    nuevoCurso: '',
    nuevoNivel: ''
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAddCourse = () => {
    if (formData.nuevoCurso && formData.nuevoNivel) {
      const newCourse = {
        ...formData.cursosRealizados,
        [formData.nuevoCurso]: formData.nuevoNivel,
      };
      setFormData((prevState) => ({
        ...prevState,
        cursosRealizados: newCourse,
        nuevoCurso: '',
        nuevoNivel: '',
      }));
    }
  };

  const handleRemoveCourse = (curso: string) => {
    const newCourses = { ...formData.cursosRealizados };
    delete newCourses[curso];
    setFormData((prevState) => ({
      ...prevState,
      cursosRealizados: newCourses,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}miembro/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error al crear el miembro');
      const responseText = await response.text();
      setSuccess('Miembro creado con éxito');
      setError(null); // Limpiar errores
      setFormData({ // Limpiar el formulario
        cedula: '',
        nombre: '',
        apellido: '',
        fecha_nacimiento: '',
        direccion: '',
        ocupacion: '',
        telefono: '',
        sexo: '',
        status: '',
        fecha_ingreso: '',
        cursosRealizados: {},
        nuevoCurso: '',
        nuevoNivel: ''
      });
    }  catch (err) {
      console.error(err); // Esto te permitirá ver el error exacto en la consola
      setError('Hubo un problema al crear el miembro');
      setSuccess(null); // Limpiar éxito si hay un error
    }
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden w-full">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Crear Nuevo Miembro</h2>

          {/* Mensajes de éxito o error */}
          {success && <div className="bg-green-200 p-4 mb-4 text-green-800 rounded-md">{success}</div>}
          {error && <div className="bg-red-200 p-4 mb-4 text-red-800 rounded-md">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Campos del formulario */}
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre"
              />
              <input
                type="text"
                name="apellido"
                value={formData.apellido}
                onChange={handleInputChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Apellido"
              />
               <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Cedula"
              />
              <input
                type="date"
                name="fecha_nacimiento"
                value={formData.fecha_nacimiento}
                onChange={handleInputChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="direccion"
                value={formData.direccion}
                onChange={handleInputChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Dirección"
              />
              <input
                type="text"
                name="ocupacion"
                value={formData.ocupacion}
                onChange={handleInputChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ocupación"
              />
              <input
                type="text"
                name="telefono"
                value={formData.telefono}
                onChange={handleInputChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Teléfono"
              />
            
              <input
                type="date"
                name="fecha_ingreso"
                value={formData.fecha_ingreso}
                onChange={handleInputChange}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            <select
            name="sexo"
              value={formData.sexo}
             onChange={handleInputChange}
                  className="p-2 border rounded-md"
                >
             <option value="" disabled>Selecciona el sexo</option>
            <option value="MASCULINO">Masculino</option>
           <option value="FEMENINO">Femenino</option>
          </select>

       
          <select
           name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="p-2 border rounded-md"
            >
           <option value="" disabled>Selecciona el status</option>
           <option value="REGULAR">REGULAR</option>
            <option value="MIEMBRONUEVO">MIEMBRONUEVO</option>
            <option value="RETIRADO">RETIRADO</option>
        </select>

          <input
            type="date"
            name="fecha_ingreso"
            value={formData.fecha_ingreso}
            onChange={handleInputChange}
            className="p-2 border rounded-md"
          />


              {/* Sección de cursos realizados */}
              <div className="col-span-2">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Cursos Realizados</h3>
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="nuevoCurso"
                    value={formData.nuevoCurso}
                    onChange={handleInputChange}
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nuevo Curso"
                  />
                  <input
                    type="text"
                    name="nuevoNivel"
                    value={formData.nuevoNivel}
                    onChange={handleInputChange}
                    className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nivel"
                  />
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="p-3 bg-blue-500 text-white rounded-md"
                  >
                    Añadir Curso
                  </button>
                </div>
                <ul className="mt-2">
                  {Object.keys(formData.cursosRealizados).map((curso) => (
                    <li key={curso} className="bg-blue-50 p-4 rounded-md shadow-md flex justify-between items-center">
                      <span className="text-lg font-medium text-blue-900">{curso}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(curso)}
                        className="text-red-500"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botones de guardar */}
              <div className="col-span-2 flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setFormData({ 
                    cedula: '', nombre: '', apellido: '', fecha_nacimiento: '', direccion: '', 
                    ocupacion: '', telefono: '', sexo: '', status: '', fecha_ingreso: '', cursosRealizados: {},
                    nuevoCurso: '', nuevoNivel: '' 
                  })}
                  className="px-6 py-2 bg-gray-400 text-white rounded-md"
                >
                  Limpiar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-500 text-white rounded-md"
                >
                  Crear Miembro
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
