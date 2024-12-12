'use client';

import { useState } from 'react';
import { API_URL } from '@/app/lib/config';

interface TeacherFormProps {
  type: "create" | "update";
  data?: any; // Define un tipo más específico si tienes un modelo.
}

const TeacherForm: React.FC<TeacherFormProps> = ({ type, data }) => {
  const [formData, setFormData] = useState({
    name: data?.name || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    address: data?.address || '',
    cedula: data?.cedula || '',
    phone: data?.phone || '',
    fecha_nacimiento: data?.fecha_nacimiento || '',
    cursos: data?.cursos || [''],
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddCourse = () => {
    setFormData((prevState) => ({
      ...prevState,
      cursos: [...prevState.cursos, ''],
    }));
  };

  const handleCourseChange = (index: number, value: string) => {
    const newCourses = [...formData.cursos];
    newCourses[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      cursos: newCourses,
    }));
  };

  const handleRemoveCourse = (index: number) => {
    const newCourses = formData.cursos.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      cursos: newCourses,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = type === 'create' ? `${API_URL}profe/create` : `${API_URL}profe/update`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar el profesor');

      setSuccess(`Profesor ${type === 'create' ? 'creado' : 'actualizado'} con éxito`);
      setError(null);
      if (type === 'create') {
        setFormData({
          name: '',
          lastName: '',
          email: '',
          address: '',
          cedula: '',
          phone: '',
          fecha_nacimiento: '',
          cursos: [''],
        });
      }
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al guardar el profesor');
      setSuccess(null);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4 text-blue-700">
        {type === 'create' ? 'Crear Profesor' : 'Actualizar Profesor'}
      </h2>

      {/* Mensajes de éxito o error */}
      {success && <div className="bg-green-200 p-4 mb-4 text-green-800 rounded-md">{success}</div>}
      {error && <div className="bg-red-200 p-4 mb-4 text-red-800 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
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
            placeholder="Cédula"
          />
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Dirección"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Teléfono"
          />
        </div>

        {/* Cursos */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-blue-700 mb-2">Cursos</h3>
          {formData.cursos.map((curso, index) => (
            <div key={index} className="flex gap-4 items-center mb-2">
              <input
                type="text"
                value={curso}
                onChange={(e) => handleCourseChange(index, e.target.value)}
                className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                placeholder={`Curso ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => handleRemoveCourse(index)}
                className="p-2 bg-red-500 text-white rounded-md"
              >
                Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddCourse}
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Añadir Curso
          </button>
        </div>

        {/* Botones */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() =>
              setFormData({
                name: '',
                lastName: '',
                email: '',
                address: '',
                cedula: '',
                phone: '',
                fecha_nacimiento: '',
                cursos: [''],
              })
            }
            className="px-6 py-2 bg-gray-400 text-white rounded-md"
          >
            Limpiar
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">
            {type === 'create' ? 'Crear Profesor' : 'Actualizar Profesor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeacherForm;
