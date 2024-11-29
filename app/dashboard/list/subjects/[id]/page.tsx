'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/app/lib/config';
import EditCursoModal from '@/app/components/forms/EditCursoModal';
import EditMiembroModal from '@/app/components/forms/EditMiembroModal';
import EditModuloModal from '@/app/components/forms/EditModuloModal';
import EditProfesorModal from '@/app/components/forms/EditProfesorModal';

export default function CursoPage() {
  const { id } = useParams<string>();
  const [curso, setCurso] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isEditProfesorModalOpen, setEditProfesorModalOpen] = useState(false);
  const [isEditMiembroModalOpen, setEditMiembroModalOpen] = useState(false);
  const [isEditModuloModalOpen, setEditModuloModalOpen] = useState(false);

  // Obtener datos del curso
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}curso/get/${id}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Error al cargar datos del curso');
        const result = await response.json();

        setCurso(result);
      
      } catch (err) {
        setError(err.message);
      }
    };
    fetchData();
  }, [id]);

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!curso) {
    return <p className="text-center text-gray-500 mt-4 animate-pulse">Cargando datos del curso...</p>;
  }

  // Función de guardado
  const handleSave = (updatedCurso) => {
    setCurso(updatedCurso);
  };

  // Eliminar profesor
  const handleDeleteProfesor = async (cedula) => {
    try {
      const response = await fetch(`${API_URL}profesor/delete/${cedula}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar profesor');
      const updatedCurso = await response.json();
      setCurso(updatedCurso);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar miembro
  const handleDeleteMiembro = async (cedula) => {
    try {
      const response = await fetch(`${API_URL}miembro/delete/${cedula}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar miembro');
      const updatedCurso = await response.json();
      setCurso(updatedCurso);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar módulo
  const handleDeleteModulo = async (idModulo) => {
    try {
      const response = await fetch(`${API_URL}modulo/delete/${idModulo}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Error al eliminar módulo');
      alert("Cambio Realizado con exito")
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Cabecera */}
        <div className="bg-blue-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold">Nombre del Curso: {curso.nombreCurso}</h2>
          <button
            onClick={() => setEditModalOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md"
          >
            ✏️ Editar Curso
          </button>
        </div>

        {/* Contenido del curso */}
        <div className="p-6">
          <p className="text-gray-600 mb-4">Descripcion: {curso.descripcion}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
            <p><strong>Inicio:</strong> {new Date(curso.fecha_inicio).toLocaleDateString()}</p>
            <p><strong>Fin:</strong> {new Date(curso.fecha_fin).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Lista de módulos */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Módulos</h3>
          {curso.moduloList.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {curso.moduloList.map((modulo, index) => (
                <li key={index}>
                  <strong>{modulo.numModulo}:</strong> {modulo.descripcion}
                  <button
                    onClick={() => handleDeleteModulo(modulo.idModulo)}
                    className="text-red-500 ml-4"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay módulos asignados.</p>
          )}
          <button
            onClick={() => setEditModuloModalOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md mt-4"
          >
            Agregar Módulo
          </button>
        </div>

        {/* Lista de profesores */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Profesores</h3>
          {curso.professorDTOS.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {curso.professorDTOS.map((profesor, index) => (
                <li key={index}>
                  <strong>{profesor.name} {profesor.lastName} ({profesor.cedula})</strong>
                  <button
                    onClick={() => handleDeleteProfesor(profesor.cedula)}
                    className="text-red-500 ml-4"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay profesores asignados.</p>
          )}
          <button
            onClick={() => setEditProfesorModalOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md mt-4"
          >
            Agregar Profesor
          </button>
        </div>

        {/* Lista de miembros */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Miembros/Participantes</h3>
          {curso.miembroDTOList.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {curso.miembroDTOList.map((miembro, index) => (
                <li key={index}>
                  <strong>{miembro.nombre} {miembro.apellido} ({miembro.cedula})</strong>
                  <button
                    onClick={() => handleDeleteMiembro(miembro.cedula)}
                    className="text-red-500 ml-4"
                  >
                    Eliminar
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay miembros asignados.</p>
          )}
          <button
            onClick={() => setEditMiembroModalOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md mt-4"
          >
            Agregar Miembro
          </button>
        </div>
      </div>

      {/* Modales */}
      {isEditModalOpen && (
        <EditCursoModal curso={curso} onClose={() => setEditModalOpen(false)} onSave={handleSave} />
      )}
      {isEditProfesorModalOpen && (
        <EditProfesorModal curso={curso} onClose={() => setEditProfesorModalOpen(false)} onSave={handleSave} />
      )}
      {isEditMiembroModalOpen && (
        <EditMiembroModal curso={curso} onClose={() => setEditMiembroModalOpen(false)} onSave={handleSave} />
      )}
      {isEditModuloModalOpen && (
        <EditModuloModal curso={curso} onClose={() => setEditModuloModalOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
}
