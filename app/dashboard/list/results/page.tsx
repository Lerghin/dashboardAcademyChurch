
import FormModal from "@/app/components/FormModal"
import Pagination from "@/app/components/Pagination"
import Table from "@/app/components/Table"
import TableSearch from "@/app/components/TableSearch"
import { API_URL } from "@/app/lib/config" 
import { role } from "@/app/lib/data"
import Image from "next/image"
import Link from "next/link"

type ModuloCursoDTO = {
  idModulo: string;
  idCurso: string;
  nombreCurso: string;
  numModulo: number;
  descripcion: string;
 
  
};

const columns = [
  {
    header: "Nombre del Curso",
    accessor: "nombreCurso",
  },
  {
    header: "Numero de Modulo",
    accessor: "numModulo",
    
  },
  {
    header: "Descripcion",
    accessor: "descripcion",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const ResultListPage = async () => {
  const response = await fetch(`${API_URL}events/get`, { cache: "no-store" });// Usa `no-store` si quieres evitar el almacenamiento en caché
  const eventsData: Student[] = await response.json()

  const renderRow = (item: Student) => (
    <tr
      key={item.idEvents}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
       
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.nameEvents}</h3>
        
        </div>
      </td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td className="hidden md:table-cell text-center">{item.fecha_inicio}</td>
    
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/list/students/${item.idEvents}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="student" type="delete" id={item.idEvents}/>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Todos los Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/filter.png" alt="" width={14} height={14} />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              <Image src="/sort.png" alt="" width={14} height={14} />
            </button>
            {role === "admin" && (
              // <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
              //   <Image src="/plus.png" alt="" width={14} height={14} />
              // </button>
              <FormModal table="student" type="create"/>
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
     <Table columns={columns} renderRow={renderRow} data={eventsData}/>
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ResultListPage;