"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useState } from "react";
import { API_URL } from "../lib/config";
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
const forms: { [key in TableType]: (type: "create", data?: any) => JSX.Element } = {
  teacher: (type, data) => <TeacherForm type={type} data={data} />,
  student: (type, data) => <StudentForm type={type} data={data} />,
  group: (type, data) => <GroupsForm type={type} data={data} />,
  curso: (type, data) => <CursoForm type={type} data={data} />,
  events: (type, data) => <CreateEventModal type={type} data={data} />,
  pago: (type, data) => <CreatePagoModal type={type} data={data} />,
};

// Componente modal de formularios
const FormModal = ({
  table,
  type,
  data,
}: {
  table:
    | "teacher"
    | "student"
    | "group"
    | "curso"
    | "events"
    | "pago";
  type: "create";
  data?: any;
}) => {
  const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
  const bgColor = type === "create" ? "bg-lamaYellow" : "bg-lamaSky"; // Solo color para 'create'

  const [open, setOpen] = useState(false);

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

    // Solo mostramos el formulario de creación
    return type === "create" ? (
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
