"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { API_URL } from "../lib/config";
import EditEventModal from "./forms/EditEventModalProps";
import CreateEventModal from "./forms/CreateEventModal";
import CreatePagoModal from "./forms/CreatePago";

// Carga dinámica de los formularios
const CursoForm = dynamic(() => import("./forms/FormCrearCurso"), {
  loading: () => <h1>Loading...</h1>,
});

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
  loading: () => <h1>Loading...</h1>,
});
const StudentForm = dynamic(() => import("./forms/StudentForm"), {
  loading: () => <h1>Loading...</h1>,
});
const GroupsForm = dynamic(() => import("./forms/GroupsForm"), {
  loading: () => <h1>Loading...</h1>,
});

// Tipos permitidos para los formularios
type TableType = "teacher" | "student" | "group" | "curso" | "events" | "pago";

// Objeto que almacena los formularios
const forms: { [key in TableType]: (type: "create" | "update", data?: any) => JSX.Element } = {
  teacher: (type, data) => <TeacherForm />,
  student: (type, data) => <StudentForm   />,
  group: (type, data) => <GroupsForm   />,
  curso: (type, data) => <CursoForm  />,
  events: (type, data) => <CreateEventModal />,
  pago: (type, data) => <CreatePagoModal  />
};

// Componente modal de formularios
const FormModal = ({
  table,
  type,
  data,
  id,
}: {
  table:
    | "events"
    | "miembro"
    | "curso"
    | "profe"
    | "teacher"
    | "student"
    | "group"
    | "grupo"
    | "subject"
    | "class"
    | "lesson"
    | "exam"
    | "assignment"
    | "result"
    | "attendance"
    | "event"
    | "pago";
  type: "create" | "update" | "delete";
  data?: any;
  id?: string;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor =
    type === "create"
      ? "bg-lamaYellow"
      : type === "update"
      ? "bg-lamaSky"
      : "bg-lamaPurple";

  const [open, setOpen] = useState(false);

  // Maneja la eliminación de un registro
  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevenir comportamiento predeterminado
    try {
      const response = await fetch(`${API_URL}${table}/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar el registro.");
      }

      console.log("Eliminación exitosa");
      setOpen(false); // Cierra el modal tras la eliminación
      // Aquí podrías actualizar el estado local para eliminar el elemento sin recargar
    } catch (err: any) {
      console.error("Error:", err.message || err);
    }
  };

  // Verifica si la tabla es válida antes de mostrar el formulario
  const Form = () => {
    const validTables: TableType[] = [
      
      "teacher",
      "student",
      "group",
      "curso",
      "events",
      "pago",
    ];

    if (!validTables.includes(table as TableType)) {
      return <div>Form not found!</div>;
    }

    return type === "delete" && id ? (
      <form action="" className="p-4 flex flex-col gap-4">
        <span className="text-center font-medium">
          ¿Está seguro de borrar {table}?
        </span>
        <button
          className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
          onClick={handleDelete}
        >
          Delete
        </button>
      </form>
    ) : type === "create" || type === "update" ? (
      forms[table as TableType](type, data)
    ) : (
      "Form not found!"
    );
  };

  return (
    <>
      <button
        className={`${size} flex items-center justify-center rounded-full ${bgColor}`}
        onClick={() => setOpen(true)}
      >
        <Image src={`/${type}.png`} alt="" width={16} height={16} />
      </button>
      {open && (
        <div className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
