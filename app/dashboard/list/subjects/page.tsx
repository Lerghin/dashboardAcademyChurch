import FormModal from "@/app/components/FormModal"
import Pagination from "@/app/components/Pagination"
import Table from "@/app/components/Table"
import TableSearch from "@/app/components/TableSearch"
import { API_URL } from "@/app/lib/config"
import {  role } from "@/app/lib/data"
import Image from "next/image"
import Link from "next/link"

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
    fecha_fin:string;
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
      header: "Fecha de Finalizacion",
      accessor: "fecha_fin",
      className: "hidden md:table-cell",
    },
    {
      header: "Actions",
      accessor: "action",
    },
  ];
  
  const SubjectListPage = async () => {
      // Realiza la solicitud de datos a la API
      const response = await fetch(`${API_URL}curso/getcur`, { cache: "no-store" });
      const subjectsData: Subject[] = await response.json()
    const renderRow = (item: Subject) => (
      <tr
        key={item.idCurso}
        className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
      >
        <td className="flex items-center gap-4 p-4">{item.nombreCurso}</td>
     
        <td className="hidden md:table-cell"> {item.professorDTOS.map((professor, index) => (
    <span key={index}>{professor.name} {""} {professor.lastName}{index < item.professorDTOS.length - 1 && ', '}</span>
  ))}</td>
        <td className="hidden md:table-cell px-6">{item.fecha_inicio}</td>
        <td className="hidden md:table-cell px-8">{item.fecha_inicio}</td>
        <td>
          <div className="flex items-center gap-2">
            {role === "admin" && (
              <>
                <FormModal table="subject" type="update" data={item} />
                <FormModal table="subject" type="delete" id={item.idCurso} />
              </>
            )}
          </div>
        </td>
      </tr>
    );
  
    return (
      <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <h1 className="hidden md:block text-lg font-semibold">Todos los Cursos</h1>
          <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
            <TableSearch />
            <div className="flex items-center gap-4 self-end">
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/filter.png" alt="" width={14} height={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                <Image src="/sort.png" alt="" width={14} height={14} />
              </button>
              {role === "admin" && <FormModal table="teacher" type="create" />}
            </div>
          </div>
        </div>
        {/* LIST */}
        <Table columns={columns} renderRow={renderRow} data={subjectsData} />
        {/* PAGINATION */}
        <Pagination />
      </div>
    );
  };
  
  export default SubjectListPage;