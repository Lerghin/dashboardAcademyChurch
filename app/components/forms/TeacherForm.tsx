'use client';

import { useState } from 'react';
import { API_URL } from '@/app/lib/config';

// Interfaz para las propiedades del formulario de Profesor
interface TeacherFormProps {
  type: "create" | "update"; // Tipo de acción (crear o actualizar)
  data?: Partial<FormData>; // Datos del profesor, opcionales para actualización
}

// Interfaz para los datos del formulario
interface FormData {
  name: string;
  lastName: string;
  email: string;
  address: string;
  cedula: string;
  phone: string;
  fecha_nacimiento: string;
  cursos: string[]; // Lista de cursos como array de strings
}

const TeacherForm = ({ type, data }: TeacherFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: data?.name || '',
    lastName: data?.lastName || '',
    email: data?.email || '',
    address: data?.address || '',
    cedula: data?.cedula || '',
    phone: data?.phone || '',
    fecha_nacimiento: data?.fecha_nacimiento || '',
    cursos: data?.cursos || [''], // Lista de cursos
  });

  const handleCourseChange = (index: number, value: string) => {
    const newCourses = [...formData.cursos];
    newCourses[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      cursos: newCourses,
    }));
  };

  const handleAddCourse = () => {
    setFormData((prevState) => ({
      ...prevState,
      cursos: [...prevState.cursos, ''],
    }));
  };

  const handleRemoveCourse = (index: number) => {
    const newCourses = formData.cursos.filter((_, i) => i !== index);
    setFormData((prevState) => ({
      ...prevState,
      cursos: newCourses,
    }));
  };

  return (
    <div className="w-full">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden w-full">
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">
            {type === 'create' ? 'Crear Profesor' : 'Actualizar Profesor'}
          </h2>

          <form>
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
