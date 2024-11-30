"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { API_URL } from "@/app/lib/config";
import EditCursoModal from "@/app/components/forms/EditCursoModal";
import EditMiembroModal from "@/app/components/forms/EditMiembroModal";

import EditProfesorModal from "@/app/components/forms/EditProfesorModal";
import EditModuloModal from "@/app/components/forms/EditModuloModal";

export default function CursoPage() {
  const { id } = useParams<string>();
  const [curso, setCurso] = useState(null);
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
    return (
      <p className="text-center text-gray-500 mt-4 animate-pulse">
        Cargando datos del curso...
      </p>
    );
  }

  // Función de guardado
  const handleSave = (updatedCurso) => {
    setCurso(updatedCurso);
  };

  // Eliminar profesor
  const handleDeleteProfesor = async (cedula) => {
    if (!confirm("¿Seguro que deseas eliminar este profesor?")) return;
    try {
      const response = await fetch(`${API_URL}curso/delete/${cedula}/${id}`, {
        method: "PUT",
      });
      if (!response.ok) throw new Error("Error al eliminar profesor");
      const updatedCurso = await response.text();
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar miembro
  const handleDeleteMiembro = async (cedula) => {
    try {
      const response = await fetch(`${API_URL}miembro/delete/${cedula}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Error al eliminar miembro");
      const updatedCurso = await response.json();
      setCurso(updatedCurso);
    } catch (err) {
      setError(err.message);
    }
  };

  // Eliminar módulo
  const handleDeleteModulo = async (idModulo, idCurso) => {
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

      const data = await response.text();

      if (!response.ok) {
        throw new Error(data.error || "Error al eliminar módulo");
      }

      alert(data.message || "Módulo eliminado con éxito");

      // Recargar la página después de eliminar el módulo
      window.location.reload();
    } catch (err) {
      console.error("Error al eliminar módulo:", err.message);
      alert("Error al eliminar módulo: " + err.message);
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
              setSelectedCursoId(id);
              console.log(selectedCursoId); // Guardar el id del curso al hacer clic
              setEditModuloModalOpen(true); // Abrir el modal de edición
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
            onSave={(modulo) => {
              // Aquí puedes actualizar la lista de módulos con el nuevo módulo
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
          onSave={(profesor) => {
            // Actualizar profesores en el estado del curso si es necesario
            setCurso((prevCurso) => ({
              ...prevCurso,
              professorDTOS: [...prevCurso.professorDTOS, profesor],
            }));
          }}
        />
      )}
      {isEditMiembroModalOpen && (
        <EditMiembroModal
          cursoId={curso.idCurso}
          onClose={() => setEditMiembroModalOpen(false)}
          onSave={handleSave}
        />
      )}
      {isEditModuloModalOpen && (
        <EditModuloModal
          id={curso.idCurso}
          onClose={() => setEditModuloModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
