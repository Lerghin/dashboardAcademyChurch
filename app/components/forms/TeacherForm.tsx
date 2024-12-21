import { API_URL } from '@/app/lib/config';
import React, { useState } from 'react';

interface TeacherFormProps {
  type: "create" | "update";
  data?: any;
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
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCoursesChange = (newCourses: string[]) => {
    setFormData((prevData) => ({
      ...prevData,
      cursos: newCourses,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}profe/${type === 'create' ? 'create' : 'update'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error(`Error al ${type === 'create' ? 'crear' : 'actualizar'} el profesor`);

      setSuccess(`Profesor ${type === 'create' ? 'creado' : 'actualizado'} con éxito`);
      setError(null); // Limpiar errores
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
        }); // Limpiar formulario
      }
    } catch (err) {
      console.error(err);
      setError(`Hubo un problema al ${type === 'create' ? 'crear' : 'actualizar'} el profesor`);
      setSuccess(null);
    }
  };

  return (
    <div className="w-full">
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
            name="cedula"
            value={formData.cedula}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Cédula"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Teléfono"
          />
          <input
            type="date"
            name="fecha_nacimiento"
            value={formData.fecha_nacimiento}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Fecha de Nacimiento"
          />
        </div>
        <button type="submit" className="mt-4 p-3 bg-blue-500 text-white rounded-md">{type === 'create' ? 'Crear Profesor' : 'Actualizar Profesor'}</button>
      </form>
    </div>
  );
};

export default TeacherForm;