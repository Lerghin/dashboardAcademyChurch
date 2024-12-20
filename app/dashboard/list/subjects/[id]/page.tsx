'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/app/lib/config";
import EditCursoModal from "@/app/components/forms/EditCursoModal";
import EditMiembroModal from "@/app/components/forms/EditMiembroModal";
import EditProfesorModal from "@/app/components/forms/EditProfesorModal";
import EditModuloModal from "@/app/components/forms/EditModuloModal";
import { Modulo } from "@/app/dashboard/list/subjects/types";

interface Curso {
  idCurso: string;
  nombreCurso: string;
  descripcion: string;
  fecha_inicio: string;
  fecha_fin: string;
  moduloList: Modulo[];
  professorDTOS: Profesor[];
  miembroDTOList: Miembro[];
}

interface CursoMod {
  idCurso: Curso['idCurso'];
  nombreCurso: Curso['nombreCurso'];
  descripcion: Curso['descripcion'];
  fecha_inicio: Curso['fecha_inicio'];
  fecha_fin: Curso['fecha_fin'];
}


interface Profesor {
  name: string;
  lastName: string;
  cedula: string;
}

interface Miembro {
  nombre: string;
  apellido: string;
  cedula: string;
}

export default function CursoPage() {
  const { id } = useParams() as { id: string };
  const [curso, setCurso] = useState<Curso | null>(null);
  const [cursoMod, setCursoMod] = useState<CursoMod | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isEditProfesorModalOpen, setEditProfesorModalOpen] = useState(false);
  const [isEditMiembroModalOpen, setEditMiembroModalOpen] = useState(false);
  const [isEditModuloModalOpen, setEditModuloModalOpen] = useState(false);
  const [selectedCursoId, setSelectedCursoId] = useState<string>("");

  // Obtener datos del curso
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}curso/get/${id}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Error al cargar datos del curso");
        const result: Curso = await response.json();
        setCurso(result);
        setCursoMod(result);
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

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  if (!curso) {
    return (
      <p className="text-center text-gray-500 mt-4 animate-pulse">
        Cargando datos del curso...
      </p>
    );
  }

  const handleSaveCurso = (updatedCurso: CursoMod) => {
    setCursoMod(updatedCurso);
  };

  const handleSaveModulo = (modulo: Modulo) => {
    setCurso((prevCurso) => {
      if (prevCurso) {
        const updatedModuloList = modulo.idModulo
          ? prevCurso.moduloList.map((m) => (m.idModulo === modulo.idModulo ? modulo : m))
          : [...prevCurso.moduloList, { ...modulo, idModulo: String(Date.now()) }];
        return {
          ...prevCurso,
          moduloList: updatedModuloList,
        };
      }
      return prevCurso;
    });
  };

  const handleSaveProfesor = (profesor: Profesor) => {
    setCurso((prevCurso) => {
      if (prevCurso) {
        return {
          ...prevCurso,
          professorDTOS: [...prevCurso.professorDTOS, profesor],
        };
      }
      return prevCurso;
    });
  };

  const handleSaveMiembro = (miembro: Miembro) => {
    setCurso((prevCurso) => {
      if (prevCurso) {
        return {
          ...prevCurso,
          miembroDTOList: [...prevCurso.miembroDTOList, miembro],
        };
      }
      return prevCurso;
    });
  };

  const handleDeleteProfesor = async (cedula: string) => {
    if (!confirm("¿Seguro que deseas eliminar este profesor?")) return;
    try {
      const response = await fetch(`${API_URL}curso/delete/${cedula}/${id}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Error al eliminar profesor");
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    }
  };

  const handleDeleteMiembro = async (cedula: string) => {
    if (!confirm("¿Seguro que deseas eliminar este participante?")) return;
    try {
      const response = await fetch(`${API_URL}curso/delete-member/${id}/${cedula}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Error al eliminar miembro");
      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error desconocido");
      }
    }
  };

  const handleDeleteModulo = async (idModulo: string, idCurso: string) => {
    if (!confirm("¿Seguro que deseas eliminar este modulo?")) return;

    try {
      const response = await fetch(
        `${API_URL}modulo/delete/${idModulo}/${idCurso}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          cache: "no-cache",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar módulo");
      }

      alert(data.message || "Módulo eliminado con éxito");

      window.location.reload();
    } catch (err) {
      if (err instanceof Error) {
        console.error("Error al eliminar módulo:", err.message);
        alert("Error al eliminar módulo: " + err.message);
      } else {
        console.error("Error desconocido al eliminar módulo");
        alert("Error desconocido al eliminar módulo");
      }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {/* Cabecera */}
        <div className="bg-blue-500 text-white p-6 flex justify-between items-center">
          <h2 className="text-3xl font-bold">
            Nombre del Curso: {curso.nombreCurso}
          </h2>
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
            <p>
              <strong>Inicio:</strong>{" "}
              {new Date(curso.fecha_inicio).toLocaleDateString()}
            </p>
            <p>
              <strong>Fin:</strong>{" "}
              {new Date(curso.fecha_fin).toLocaleDateString()}
            </p>
          </div>
        </div>
        {/* Lista de módulos */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Módulos</h3>
          {curso.moduloList.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {curso.moduloList.map((modulo, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>
                    <strong>{modulo.numModulo}:</strong> {modulo.descripcion}
                  </span>
                  <button
                    onClick={() => handleDeleteModulo(modulo.idModulo, curso.idCurso)}
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
            onClick={() => {
              if (typeof id === 'string') {
                setSelectedCursoId(id);
                setEditModuloModalOpen(true);
              }
            }}
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
                <li key={index} className="flex justify-between items-center">
                  <span>
                    {profesor.name} {profesor.lastName} (Cédula: {profesor.cedula})
                  </span>
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
          <h3 className="text-xl font-semibold mb-4">Participantes</h3>
          {curso.miembroDTOList.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {curso.miembroDTOList.map((miembro, index) => (
                <li key={index} className="flex justify-between items-center">
                  <span>
                    {miembro.nombre} {miembro.apellido} (Cédula: {miembro.cedula})
                  </span>
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
            <p>No hay participantes asignados.</p>
          )}
          <button
            onClick={() => setEditMiembroModalOpen(true)}
            className="text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md mt-4"
          >
            Agregar Participante
          </button>
        </div>
      </div>

      {/* Modales de edición */}
      {isEditModalOpen && (
        <EditCursoModal
          curso={curso}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSaveCurso}
        />
      )}
      {isEditProfesorModalOpen && (
        <EditProfesorModal
          cursoId={selectedCursoId}
          onClose={() => setEditProfesorModalOpen(false)}
          onSave={handleSaveProfesor}
        />
      )}
      {isEditMiembroModalOpen && (
        <EditMiembroModal
          cursoId={selectedCursoId}
          onClose={() => setEditMiembroModalOpen(false)}
          onSave={handleSaveMiembro}
        />
      )}
      {isEditModuloModalOpen && (
        <EditModuloModal
          cursoId={selectedCursoId}
          onClose={() => setEditModuloModalOpen(false)}
          onSave={handleSaveModulo}
        />
      )}
    </div>
  );
}