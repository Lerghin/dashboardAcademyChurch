// EditMiembroModal.tsx
import { API_URL } from '@/app/lib/config';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface Miembro {
  nombre: string;
  apellido: string;
  cedula: string;
}

interface EditMiembroModalProps {
  cursoId: string;
  onClose: () => void;
  onSave: (miembro: Miembro) => void;
  miembro?: Miembro; // Si estamos editando un miembro, pasamos los datos
}

const EditMiembroModal: React.FC<EditMiembroModalProps> = ({ cursoId, onClose, onSave, miembro }) => {
  const [nombre, setNombre] = useState<string>(miembro?.nombre || '');
  const [apellido, setApellido] = useState<string>(miembro?.apellido || '');
  const [cedula, setCedula] = useState<string>(miembro?.cedula || '');
  const [studentsData, setStudentsData] = useState<Miembro[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Miembro[]>([]);
  const { id } = useParams() as { id: string };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}miembro/get`, { cache: "no-store" });
      const data: Miembro[] = await response.json();
      setStudentsData(data);
      setFilteredStudents(data); // Establecer los datos por defecto
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    const newMember = { nombre, apellido, cedula, id }; // Incluye cursoId en el objeto
    try {
      const response = await fetch(`${API_URL}curso/add-member/${id}/${cedula}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMember),
      });
  
      if (!response.ok) {
        throw new Error("Error al guardar el Miembro");
      }
  
      const savedMember = await response.text();
    
      onClose();
      alert('Miembro agregado exitosamente')
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
        <h2 className="text-xl font-semibold mb-4">{miembro ? 'Editar Miembro' : 'Agregar Miembro'}</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cédula</label>
          <select
            value={cedula}
            onChange={(e) => {
              const selectedMember = studentsData.find(student => student.cedula === e.target.value);
              if (selectedMember) {
                setNombre(selectedMember.nombre);
                setApellido(selectedMember.apellido);
                setCedula(selectedMember.cedula);
              }
            }}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Seleccione un miembro</option>
            {filteredStudents.map((student) => (
              <option key={student.cedula} value={student.cedula}>
                {student.nombre} {student.apellido} - {student.cedula}
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

export default EditMiembroModal;
