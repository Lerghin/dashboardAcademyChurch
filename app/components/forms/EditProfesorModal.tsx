// EditProfesorModal.tsx
import { API_URL } from '@/app/lib/config';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Profesor {
  name: string;
  lastName: string;
  cedula: string;
}

interface EditProfesorModalProps {
  cursoId: string;
  onClose: () => void;
  onSave: (profesor: Profesor) => void;
  profesor?: Profesor;
}

const EditProfesorModal: React.FC<EditProfesorModalProps> = ({ cursoId, onClose, onSave, profesor }) => {
  const [name, setName] = useState<string>(profesor?.name || '');
  const [lastName, setLastName] = useState<string>(profesor?.lastName || '');
  const [cedula, setCedula] = useState<string>(profesor?.cedula || '');
  const [teachersData, setTeachersData] = useState<Profesor[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Profesor[]>([]);
  const { id } = useParams() as { id: string };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${API_URL}profe/get`, {
          cache: "no-store",
        });
        const data: Profesor[] = await response.json();
        setTeachersData(data);
        setFilteredTeachers(data); // Establecer los datos por defecto
      } catch (error) {
        console.error("Error al obtener los datos", error);
      }
    };
    fetchTeachers();
  }, []);

  const handleSubmit = async () => {
    const newProfesor = { name, lastName, cedula, id }; // Incluye cursoId en el objeto
    try {
      const response = await fetch(`${API_URL}curso/${cedula}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProfesor),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar el profesor");
      }
  
      const savedProfesor = await response.text();
    
      onClose();
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        alert(`Error: ${err.message}`);
      } else {
        alert("An unknown error occurred");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{profesor ? 'Editar Profesor' : 'Agregar Profesor'}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cédula</label>
          <select
            value={cedula}
            onChange={(e) => {
              const selectedTeacher = teachersData.find(teacher => teacher.cedula === e.target.value);
              if (selectedTeacher) {
                setName(selectedTeacher.name);
                setLastName(selectedTeacher.lastName);
                setCedula(selectedTeacher.cedula);
              }
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Seleccione un profesor</option>
            {filteredTeachers.map((teacher) => (
              <option key={teacher.cedula} value={teacher.cedula}>
                {teacher.name} {teacher.lastName} - {teacher.cedula}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfesorModal;
