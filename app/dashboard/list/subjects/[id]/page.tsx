'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/app/lib/config";
import EditCursoModal from "@/app/components/forms/EditCursoModal";
import EditMiembroModal from "@/app/components/forms/EditMiembroModal";
import EditProfesorModal from "@/app/components/forms/EditProfesorModal";
import EditModuloModal from "@/app/components/forms/EditModuloModal";

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

interface Modulo {
  idModulo: string;
  numModulo: string;
  descripcion: string;
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

  // Función de guardado
  const handleSave = (updatedCurso: Curso) => {
    setCurso(updatedCurso);
  };

  // Eliminar profesor
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

  // Eliminar miembro
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

  // Eliminar módulo
  const handleDeleteModulo = async (idModulo: string, idCurso: string) => {
    if (!confirm("¿Seguro que deseas eliminar este modulo?")) return;

    try {
      console.log("ID enviado al backend:", idModulo);
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

      // Recargar la página después de eliminar el módulo
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
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Módulos</h3>
          {curso.moduloList.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {curso.moduloList.map((modulo, index) => (
                <li key={index}>
                  <strong>{modulo.numModulo}:</strong> {modulo.descripcion}
                  <button
                    onClick={() =>
                      handleDeleteModulo(modulo.idModulo, curso.idCurso)
                    }
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
                console.log(selectedCursoId); // Guardar el id del curso al hacer clic
                setEditModuloModalOpen(true); // Abrir el modal de edición
              }
            }}
            className="text-white bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-md mt-4"
          >
            Agregar Módulo
          </button>
        </div>

        {isEditModuloModalOpen && (
          <EditModuloModal
            cursoId={selectedCursoId} // Pasar el idCurso seleccionado al modal
            onClose={() => setEditModuloModalOpen(false)}
            onSave={(modulo: Modulo) => {
              // Aquí puedes actualizar la lista de módulos con el nuevo módulo
              setCurso((prevCurso) => {
                if (prevCurso) {
                  return {
                    ...prevCurso,
                    moduloList: [...prevCurso.moduloList, modulo],
                  };
                }
                return prevCurso;
              });
            }}
          />
        )}
        {/* Lista de profesores */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-xl font-semibold mb-4">Profesores</h3>
          {curso.professorDTOS.length > 0 ? (
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {curso.professorDTOS.map((profesor, index) => (
                <li key={index}>
                  <strong>
                    {profesor.name} {profesor.lastName} ({profesor.cedula})
                  </strong>
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
                  <strong>
                    {miembro.nombre} {miembro.apellido} ({miembro.cedula})
                  </strong>
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
        <EditCursoModal
          curso={curso}
          onClose={() => setEditModalOpen(false)}
          onSave={handleSave}
        />
      )}
      {isEditProfesorModalOpen && (
        <EditProfesorModal
          cursoId={curso.idCurso} // Enviar el cursoId como prop
          onClose={() => setEditProfesorModalOpen(false)}
          onSave={(profesor: Profesor) => {
            // Actualizar profesores en el estado del curso si es necesario
            setCurso((prevCurso) => {
              if (prevCurso) {
                return {
                  ...prevCurso,
                  professorDTOS: [...prevCurso.professorDTOS, profesor],
                };
              }
              return prevCurso;
            });
          }}
        />
      )}
      {isEditMiembroModalOpen && (
        <EditMiembroModal
          cursoId={curso.idCurso}
          onClose={() => setEditMiembroModalOpen(false)}
          onSave={(miembro: Miembro) => {
            setCurso((prevCurso) => {
              if (prevCurso) {
                return {
                  ...prevCurso,
                  miembroDTOList: [...prevCurso.miembroDTOList, miembro],
                };
              }
              return prevCurso;
            });
          }}
        />
      )}
      {isEditModuloModalOpen && (
        <EditModuloModal
          cursoId={curso.idCurso}
          onClose={() => setEditModuloModalOpen(false)}
          onSave={(modulo: Modulo) => {
            setCurso((prevCurso) => {
              if (prevCurso) {
                return {
                  ...prevCurso,
                  moduloList: [...prevCurso.moduloList, modulo],
                };
              }
              return prevCurso;
            });
          }}
        />
      )}
    </div>
  );
}