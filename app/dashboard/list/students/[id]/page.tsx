'use client';

import { API_URL } from '@/app/lib/config';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface FormData {
  cedula: string;
  nombre: string;
  apellido: string;
  fecha_nacimiento: string;
  direccion: string;
  ocupacion: string;
  telefono: string;
  sexo: string;
  status: string;
  fecha_ingreso: string;
  cursosRealizados: {
    [key: string]: string;
  };
  nuevoCurso: string;
  nuevoNivel: string;
}

export default function SingleStudentPage() {
  const { id } = useParams();
  const [data, setData] = useState<FormData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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
    cursosRealizados: {}, // cursos previos
    nuevoCurso: '', // nuevo curso que se agregará
    nuevoNivel: '' // nivel asociado al nuevo curso
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}miembro/get/${id}`, { cache: "no-store" });
        if (!response.ok) throw new Error('Error en la solicitud');
        const result: FormData = await response.json();
        setData(result);
        setFormData(prevState => ({
          ...prevState,
          ...result
        })); // Pre-cargar datos en el formulario
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Error desconocido");
        }
      }
    };
    fetchData();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!data) return <p>Cargando...</p>;

  const handleModalToggle = () => setIsModalOpen(!isModalOpen);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
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
      const response = await fetch(`${API_URL}miembro/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Error al actualizar los datos');
      const updatedData: FormData = await response.json();
      setData(updatedData); // Actualizar la información local
      setIsModalOpen(false); // Cerrar el modal
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  const { nombre, apellido, cedula, fecha_nacimiento, direccion, ocupacion, telefono, sexo, status, fecha_ingreso, cursosRealizados } = data;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex items-center bg-blue-500 p-6 md:p-8 text-white">
          <div className="rounded-full bg-blue-400 w-24 h-24 flex items-center justify-center text-3xl font-bold">
            {nombre.charAt(0)}{apellido.charAt(0)}
          </div>
          <div className="ml-6">
            <h1 className="text-3xl font-semibold">{nombre} {apellido}</h1>
            <p className="text-sm">Cédula: {cedula}</p>
            <button onClick={handleModalToggle} className="ml-4 text-xl text-white">
              ✏️
            </button>
          </div>
        </div>
        <div className="p-6 md:p-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Información Personal</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Cédula:</strong> {cedula}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Fecha de Nacimiento:</strong> {fecha_nacimiento}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Dirección:</strong> {direccion}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Ocupación:</strong> {ocupacion}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Teléfono:</strong> {telefono}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Sexo:</strong> {sexo}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Status:</strong> {status}</li>
            <li className="bg-blue-50 p-4 rounded-md shadow-md"><strong>Fecha de Ingreso:</strong> {fecha_ingreso}</li>
          </ul>
        </div>
        <div className="p-6 md:p-8 border-t border-gray-200">
          <h2 className="text-2xl font-semibold mb-4 text-blue-700">Cursos Realizados</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.keys(cursosRealizados).map((curso) => (
              <li key={curso} className="bg-blue-50 p-4 rounded-md shadow-md flex justify-between items-center">
                <span className="text-lg font-medium text-blue-900">{curso}</span>
                <span className="text-blue-600">Nivel {cursosRealizados[curso]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 h-screen">
          <div className="bg-white p-8 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-semibold mb-4 text-blue-700">Editar Información</h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-4">
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  placeholder="Nombre"
                />
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  placeholder="Apellido"
                />
                <input
                  type="date"
                  name="fecha_nacimiento"
                  value={formData.fecha_nacimiento}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                />
                <input
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  placeholder="Dirección"
                />
                <input
                  type="text"
                  name="ocupacion"
                  value={formData.ocupacion}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  placeholder="Ocupación"
                />
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                  placeholder="Teléfono"
                />
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                >
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                </select>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="p-2 border rounded-md"
                >
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

                <h3 className="mt-6 text-xl font-semibold text-blue-700 h-max">Cursos Realizados</h3>
                {Object.entries(formData.cursosRealizados).map(([curso, nivel]) => (
                  <div key={curso} className="flex justify-between items-center mb-4">
                    <input
                      type="text"
                      name={`curso_${curso}`}
                      value={curso}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md w-3/4"
                      placeholder="Nombre del Curso"
                      disabled
                    />
                    <input
                      type="text"
                      name={`nivel_${curso}`}
                      value={nivel}
                      onChange={handleInputChange}
                      className="p-2 border rounded-md w-1/4"
                      placeholder="Nivel"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCourse(curso)}
                      className="text-red-500"
                    >
                      Eliminar
                    </button>
                  </div>
                ))}

                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    name="nuevoCurso"
                    value={formData.nuevoCurso || ''}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-3/4"
                    placeholder="Nuevo Curso"
                  />
                  <input
                    type="text"
                    name="nuevoNivel"
                    value={formData.nuevoNivel || ''}
                    onChange={handleInputChange}
                    className="p-2 border rounded-md w-1/4"
                    placeholder="Nivel"
                  />
                  <button
                    type="button"
                    onClick={handleAddCourse}
                    className="text-green-500"
                  >
                    Agregar
                  </button>
                </div>

                <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded-md w-full">
                  Actualizar
                </button>
              </div>
            </form>
            <button
              onClick={handleModalToggle}
              className="mt-4 bg-gray-500 text-white p-2 rounded-md w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}