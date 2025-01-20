import { API_URL } from '@/app/lib/config';
import React, { useState, useEffect } from 'react';

interface TeacherFormProps {
  type: "create" | "update";
  data?: any;
  onClose?: () => void; // Agregado onClose aquí
  onSave?: () => void;
}

const TeacherForm: React.FC<TeacherFormProps> = ({ type, data, onClose, onSave }) => {

  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  
  const [formData, setFormData] = useState<{
    name: string;
    lastName: string;
    cedula: string;
    fecha_nacimiento: string;
    address: string;
    phone: string;
    email: string;
    cursos: string[];
  }>(data || {
    name: '',
    lastName: '',
    cedula: '',
    fecha_nacimiento: '',
    address: '',
    phone: '',
    email: '',
    cursos: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleCursosChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCursos = [...formData.cursos];
    newCursos[index] = e.target.value;
    setFormData((prev) => ({ ...prev, cursos: newCursos }));
  };

  const addCurso = () => {
    setFormData((prev) => ({ ...prev, cursos: [...prev.cursos, ''] }));
  };

  const removeCurso = (index: number) => {
    const newCursos = formData.cursos.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, cursos: newCursos }));
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Evita la recarga de la página
    console.log('Formulario enviado');
    
    try {
      const url = type === 'create' ? `${API_URL}profe/create` : `${API_URL}profe/update`;
      const response = await fetch(url, {
        method: type === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409 && errorData.message === "La cédula ya está registrada") {
          alert('La cédula ya está registrada');
        } else {
          throw new Error('Error al procesar la solicitud');
        }
      } else {
        const responseData = await response.text();
        console.log('Respuesta del backend:', responseData);
        setIsSubmitSuccessful(true);
        if (onSave) onSave(); // Llama a onSave si está definido
        alert('Profesor creado con éxito');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Ocurrió un error al enviar los datos');
    }
  };
  
  useEffect(() => {
    if (isSubmitSuccessful) {
      if (onClose) onClose(); // Llama a onClose si está definido
      setShowModal(false); // Cierra el modal después de una operación exitosa
    }
  }, [isSubmitSuccessful, onClose]);
  

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  useEffect(() => {
    if (isSubmitSuccessful) {
      if (onClose) onClose(); // Llama a onClose si está definido
      setShowModal(false);
    }
  }, [isSubmitSuccessful, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white w-full max-w-lg p-6 rounded-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">{type === 'create' ? 'Crear Profesor' : 'Editar Información'}</h2>
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
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-black rounded">Cancelar</button>
            <button type="submit" className="mt-4 p-3 bg-blue-500 text-white rounded-md">{type === 'create' ? 'Crear Profesor' : 'Actualizar Profesor'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherForm;
