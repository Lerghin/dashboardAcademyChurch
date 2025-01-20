'use client';
import { useState, useEffect } from 'react';
import { API_URL } from '@/app/lib/config';

interface Miembro {
  cedula: string;
  nombre: string;
  apellido: string;
}

interface Profesor {
  cedula: string;
  name: string;
  lastName: string;
}

interface Modulo {
  numModulo: string;
  descripcion: string;
}

interface DynamicSectionProps {
  title: string;
  list: any[];
  setList: React.Dispatch<React.SetStateAction<any[]>>;
  fields: { key: string; label: string }[];
  teachersData?: Teacher[];
  studentsData?: Student[];
}

interface StudentFormProps {
  type: 'create' | 'update';
  data?: any;
  table: string;
}

interface Teacher {
  cedula: string;
  name: string;
  lastName: string;
}

interface Student {
  idMiembro: string;
  nombre: string;
  apellido: string;
  cedula: string;
}

const CreateCoursePage: React.FC<StudentFormProps> = ({ type, data }) => {
  const [curso, setCurso] = useState({
    nombreCurso: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  // Tipado de los estados de los miembros, profesores y módulos
  const [miembros, setMiembros] = useState<Miembro[]>([]);
  const [profesores, setProfesores] = useState<Profesor[]>([]);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [teachersData, setTeachersData] = useState<Teacher[]>([]);
  const [studentsData, setStudentsData] = useState<Student[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCursoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurso({ ...curso, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!curso.nombreCurso || !curso.descripcion) {
      setError('Debe ingresar el nombre y la descripción del curso.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}curso/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...curso,
          miembroDTOList: miembros,
          professorDTOS: profesores,
          moduloList: modulos,
        }),
      });

      if (!response.ok) throw new Error('Error al crear el curso');

      setCurso({ nombreCurso: '', descripcion: '', fecha_inicio: '', fecha_fin: '' });
      setMiembros([]);
      setProfesores([]);
      setModulos([]);
      setSuccess('Curso creado con éxito');
      window.location.reload();
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al crear el curso');
      setSuccess(null);
    }
  };

  // Obtener los datos de la API
  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL}profe/get`, {
        cache: "no-store",
      });
      const data: Teacher[] = await response.json();
      setTeachersData(data);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}miembro/get`, {
        cache: "no-store",
      });
      const data: Student[] = await response.json();
      setStudentsData(data);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
    fetchStudents();
  }, []);

  return (
    <div className=" w-full bg-white shadow-lg rounded-lg p-6  ">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">Crear Nuevo Curso</h2>

      {success && <div className="bg-green-200 p-4 mb-4 text-green-800 rounded-md">{success}</div>}
      {error && <div className="bg-red-200 p-4 mb-4 text-red-800 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Información básica del curso */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="nombreCurso"
            value={curso.nombreCurso}
            onChange={handleCursoChange}
            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del Curso"
          />
          <input
            type="date"
            name="fecha_inicio"
            value={curso.fecha_inicio}
            onChange={handleCursoChange}
            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="date"
            name="fecha_fin"
            value={curso.fecha_fin}
            onChange={handleCursoChange}
            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <textarea
          name="descripcion"
          value={curso.descripcion}
          onChange={handleCursoChange}
          className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Descripción"
        />

        {/* Secciones dinámicas */}
        <DynamicSection
          title="Miembros"
          list={miembros}
          setList={setMiembros}
          fields={[
            { key: 'cedula', label: 'Cédula' },
            { key: 'nombre', label: 'Nombre' },
            { key: 'apellido', label: 'Apellido' },
          ]}
          studentsData={studentsData}
        />
        <DynamicSection
          title="Profesores"
          list={profesores}
          setList={setProfesores}
          fields={[
            { key: 'cedula', label: 'Cédula' },
            { key: 'name', label: 'Nombre' },
            { key: 'lastName', label: 'Apellido' },
          ]}
          teachersData={teachersData}
        />
        <DynamicSection
          title="Módulos"
          list={modulos}
          setList={setModulos}
          fields={[
            { key: 'numModulo', label: 'Número de Módulo' },
            { key: 'descripcion', label: 'Descripción' },
          ]}
        />

        {/* Botones */}
        <div className="flex justify-between mt-6">
          <button type="reset" className="px-6 py-2 bg-gray-400 text-white rounded-md" onClick={() => {
            window.location.reload(); // Recarga la página
          }}>
            Limpiar
          </button>
          <button type="submit" className="px-6 py-2 bg-blue-500 text-white rounded-md">
            Crear Curso
          </button>
        </div>
      </form>
    </div>
  );
};

const DynamicSection: React.FC<DynamicSectionProps & { teachersData?: Teacher[], studentsData?: Student[] }> = ({ title, list, setList, fields, teachersData, studentsData }) => {
  // Define the type for item based on the fields
  type ItemType = Record<string, string>;

  const initialItemState: ItemType = fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {});

  const [item, setItem] = useState<ItemType>(initialItemState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setList((prev) => [...prev, item]);
    setItem(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      {title === "Profesores" && teachersData ? (
        <div className="mb-4">
          <select
            onChange={(e) => {
              const selectedTeacher = teachersData.find(teacher => teacher.cedula === e.target.value);
              if (selectedTeacher) {
                setItem({
                  cedula: selectedTeacher.cedula,
                  name: selectedTeacher.name,
                  lastName: selectedTeacher.lastName
                });
              }
            }}
            className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un profesor</option>
            {teachersData.map((teacher) => (
              <option key={teacher.cedula} value={teacher.cedula}>
                {teacher.name} {teacher.lastName} - {teacher.cedula}
              </option>
            ))}
          </select>
        </div>
      ) : title === "Miembros" && studentsData ? (
        <div className="mb-4">
          <select
            onChange={(e) => {
              const selectedStudent = studentsData.find(student => student.cedula === e.target.value);
              if (selectedStudent) {
                setItem({
                  cedula: selectedStudent.cedula,
                  nombre: selectedStudent.nombre,
                  apellido: selectedStudent.apellido
                });
              }
            }}
            className="p-2 border rounded-md w-full focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Seleccione un miembro</option>
            {studentsData.map((student) => (
              <option key={student.cedula} value={student.cedula}>
                {student.nombre} {student.apellido} - {student.cedula}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {fields.map((field) => (
            <input
              key={field.key}
              name={field.key}
              value={item[field.key]} // Now TypeScript knows item is of type ItemType
              onChange={handleChange}
              placeholder={field.label}
              className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>
      )}
      <button
        type="button"
        onClick={handleAdd}
        className="px-4 py-2 bg-green-500 text-white rounded-md"
      >
        Agregar
      </button>
      <div className="space-y-2 max-h-40 overflow-y-auto border p-3 rounded-md" style={{ maxHeight: '200px' }}>
        {list.map((el, idx) => (
          <div key={idx} className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm">
            <div className="flex-1">
              {fields.map((field) => (
                <span key={field.key} className="mr-4">
                  <strong>{field.label}:</strong> {el[field.key]}
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setList(list.filter((_, i) => i !== idx))}
              className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateCoursePage;
