"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState, useEffect } from "react";
import { API_URL } from "../lib/config";
import EditEventModal from "./forms/EditEventModalProps";
import CreateEventModal from "./forms/CreateEventModal";
import CreatePagoModal from "./forms/CreatePago";

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

const forms: {
  [key: string]: (type: "create" | "update", data?: any) => JSX.Element;
} = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  group: (type, data) => <GroupsForm type={type} data={data} />,
  curso: (type, data) => <CursoForm type={type} data={data} />,
  events: (type, data) => <CreateEventModal type={type} data={data} />,
  pago: (type, data) => <CreatePagoModal type={type} data={data} />,
};

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

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}${table}/delete/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error desconocido");
      }

      alert("Eliminación exitosa");
      window.location.reload();
    } catch (err: any) {
      alert(`Error al eliminar: ${err.message}`);
      console.error("Error:", err);
    }
  };

  const Form = () => {
    if (type === "delete" && id) {
      return (
        <form className="p-4 flex flex-col gap-4">
          <span className="text-center font-medium">
            ¿Está seguro de borrar {table}?
          </span>
          <button
            className="bg-red-700 text-white py-2 px-4 rounded-md border-none w-max self-center"
            onClick={handleDelete}
          >
            Eliminar
          </button>
        </form>
      );
    }

    if ((type === "create" || type === "update") && forms[table]) {
      return forms[table](type, data);
    }

    return <p>¡Formulario no encontrado!</p>;
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
        <div
          role="dialog"
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
          className="w-screen h-screen absolute left-0 top-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
        >
          <div className="bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]">
            <h2 id="modal-title" className="text-lg font-bold">
              Formulario
            </h2>
            <p id="modal-description" className="text-sm text-gray-600">
              Complete la información requerida.
            </p>
            <Form />
            <div
              className="absolute top-4 right-4 cursor-pointer"
              onClick={() => setOpen(false)}
            >
              <Image src="/close.png" alt="Cerrar" width={14} height={14} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FormModal;
