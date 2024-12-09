'use client';

import { useState } from 'react';
import { API_URL } from '@/app/lib/config';

export default function CreateCoursePage() {
  const [curso, setCurso] = useState({
    nombreCurso: '',
    descripcion: '',
    fecha_inicio: '',
    fecha_fin: '',
  });

  const [miembros, setMiembros] = useState([]);
  const [profesores, setProfesores] = useState([]);
  const [modulos, setModulos] = useState([]);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCursoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Hubo un problema al crear el curso');
      setSuccess(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-blue-700">Crear Nuevo Curso</h2>

      {success && <div className="bg-green-200 p-4 mb-4 text-green-800 rounded-md">{success}</div>}
      {error && <div className="bg-red-200 p-4 mb-4 text-red-800 rounded-md">{error}</div>}

      <form onSubmit={handleSubmit}>
        {/* Información básica del curso */}
        <div className="mb-4">
          <input
            type="text"
            name="nombreCurso"
            value={curso.nombreCurso}
            onChange={handleCursoChange}
            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del Curso"
          />
        </div>
        <div className="mb-4">
          <textarea
            name="descripcion"
            value={curso.descripcion}
            onChange={handleCursoChange}
            className="p-3 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción"
          />
        </div>
        <div className="mb-4 grid grid-cols-2 gap-4">
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
          <button type="reset" className="px-6 py-2 bg-gray-400 text-white rounded-md"       onClick={() => {
            
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
}

// Componente reutilizable para secciones dinámicas
function DynamicSection({ title, list, setList, fields }) {
  const [item, setItem] = useState(() =>
    fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {})
  );

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  const handleAdd = () => {
    setList((prev) => [...prev, item]);
    setItem(fields.reduce((acc, field) => ({ ...acc, [field.key]: '' }), {}));
  };

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {fields.map((field) => (
          <input
            key={field.key}
            name={field.key}
            value={item[field.key]}
            onChange={handleChange}
            placeholder={field.label}
            className="p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        ))}
        <button
          type="button"
          onClick={handleAdd}
          className="px-4 py-2 bg-green-500 text-white rounded-md"
        >
          Agregar
        </button>
      </div>
      <div
        className="space-y-2 max-h-40 overflow-y-auto border p-3 rounded-md"
        style={{ maxHeight: '200px' }}
      >
        {list.map((el, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-md shadow-sm"
          >
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
}
