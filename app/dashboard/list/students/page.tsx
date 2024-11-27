
import FormModal from "@/app/components/FormModal"
import Pagination from "@/app/components/Pagination"
import Table from "@/app/components/Table"
import TableSearch from "@/app/components/TableSearch"
import { API_URL } from "@/app/lib/config" 
import { role } from "@/app/lib/data"
import Image from "next/image"
import Link from "next/link"

type Student = {
  idMiembro: string;
  nombre: string;
  apellido: string;
  email?: string;
  cedula:string;
  telefono?: string;
  fecha_nacimiento: string;
  direccion: string;
  status: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Cedula",
    accessor: "cedula",
    className: "hidden md:table-cell",
  },
  {
    header: "Fecha Nacimiento",
    accessor: "fecha_nacimiento",
    className: "hidden md:table-cell",
  },
  {
    header: "Direccion",
    accessor: "direccion",
    className: "hidden lg:table-cell",
  },
  {
    header: "Telefono",
    accessor: "telefono",
    className: "hidden lg:table-cell",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const StudentListPage = async () => {
  const response = await fetch(`${API_URL}miembro/get`, { cache: "no-store" });// Usa `no-store` si quieres evitar el almacenamiento en caché
  const studentsData: Student[] = await response.json()

  const renderRow = (item: Student) => (
    <tr
      key={item.idMiembro}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
       
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.nombre}{" "}{item.apellido}</h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.cedula}</td>
      <td className="hidden md:table-cell text-center">{item.fecha_nacimiento}</td>
      <td className="hidden md:table-cell">{item.direccion}</td>
      <td className="hidden md:table-cell">{item.telefono}</td>
      <td className="hidden md:table-cell">{item.status}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/list/students/${item.idMiembro}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            // <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaPurple">
            //   <Image src="/delete.png" alt="" width={16} height={16} />
            // </button>
            <FormModal table="miembro" type="delete" id={item.idMiembro}/>
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Todos los Miembros</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
           
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
     <Table columns={columns} renderRow={renderRow} data={studentsData}/>
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default StudentListPage;