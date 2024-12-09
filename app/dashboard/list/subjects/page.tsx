"use client";

import { useState, useEffect } from "react";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import { API_URL } from "@/app/lib/config";
import { role } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";

type ProfessorDTO = {
  id: string;
  name: string;
  lastName: string;
};

type Subject = {
  idCurso: string;
  nombreCurso: string;
  professorDTOS: ProfessorDTO[];
  fecha_inicio: string;
  fecha_fin: string;
};

const columns = [
  {
    header: "Nombre del Curso",
    accessor: "nombreCurso",
  },
  {
    header: "Profesor",
    accessor: "profesor",
    className: "hidden md:table-cell",
  },
  {
    header: "Fecha de Inicio",
    accessor: "fecha_inicio",
    className: "hidden md:table-cell",
  },
  {
    header: "Fecha de Finalización",
    accessor: "fecha_fin",
    className: "hidden md:table-cell",
  },
  {
    header: "Acciones",
    accessor: "action",
  },
];

const ResultListPage = () => {
  const [subjectsData, setSubjectsData] = useState<Subject[]>([]);
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Número de cursos por página
  const subjectsPerPage = 10;

  // Estados para los filtros
  const [nombreCurso, setNombreCurso] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Obtener todos los cursos al montar el componente
  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch(`${API_URL}curso/getcur`, {
        cache: "no-store",
      });
      const data = await response.json();
      setSubjectsData(data);
      setFilteredSubjects(data);
    };

    fetchSubjects();
  }, []);

  // Filtrar datos según los criterios seleccionados
  const handleFilter = () => {
    let filtered = subjectsData;

    if (nombreCurso) {
      filtered = filtered.filter((subject) =>
        subject.nombreCurso.toLowerCase().includes(nombreCurso.toLowerCase())
      );
    }

    if (fechaInicio) {
      filtered = filtered.filter(
        (subject) => new Date(subject.fecha_inicio) >= new Date(fechaInicio)
      );
    }

    if (fechaFin) {
      filtered = filtered.filter(
        (subject) => new Date(subject.fecha_fin) <= new Date(fechaFin)
      );
    }

    setFilteredSubjects(filtered);
    setCurrentPage(1); // Reiniciar la paginación al aplicar un filtro
  };

  // Calcular el rango de datos a mostrar en la página actual
  const indexOfLastSubject = currentPage * subjectsPerPage;
  const indexOfFirstSubject = indexOfLastSubject - subjectsPerPage;
  const currentSubjects = filteredSubjects.slice(
    indexOfFirstSubject,
    indexOfLastSubject
  );

  // Calcular el número total de páginas
  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage);

  const renderRow = (item: Subject) => (
    <tr
      key={item.idCurso}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <Link
          className="text-blue-600 hover:underline"
          href={`/dashboard/list/results/${item.idCurso}`}
        >
          {item.nombreCurso}
        </Link>
      </td>
      <td className="hidden md:table-cell">
        {item.professorDTOS.map((professor, index) => (
          <span key={index}>
            {professor.name} {professor.lastName}
            {index < item.professorDTOS.length - 1 && ", "}
          </span>
        ))}
      </td>
      <td className="hidden md:table-cell px-6">{item.fecha_inicio}</td>
      <td className="hidden md:table-cell px-8">{item.fecha_fin}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/list/subjects/${item.idCurso}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="curso" type="delete" id={item.idCurso} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">
          Todos los Cursos
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={nombreCurso}
              onChange={(e) => setNombreCurso(e.target.value)}
              className="border px-2 py-1 rounded-md"
            />
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="border px-2 py-1 rounded-md"
            />
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="border px-2 py-1 rounded-md"
            />
            <button
              onClick={handleFilter}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
            >
              Filtrar
            </button>

            <div className="flex items-center gap-4 self-end">
              {role === "admin" && <FormModal table="curso" type="create" />}
            </div>
          </div>
        </div>
      </div>
      {/* LIST */}
      {currentSubjects.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={currentSubjects} />
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p>No hay cursos todavía agregados.</p>
        </div>
      )}
      {/* PAGINATION */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page: number) => setCurrentPage(page)} // Actualiza la página actual
      />
    </div>
  );
};

export default ResultListPage;
