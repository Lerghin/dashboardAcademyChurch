// app/dashboard/list/teachers/page.tsx
import FormModal from "@/app/components/FormModal"
import Pagination from "@/app/components/Pagination"
import Table from "@/app/components/Table"
import TableSearch from "@/app/components/TableSearch"
import { API_URL } from "@/app/lib/config" // Importa la URL desde el archivo de configuración
import { role } from "@/app/lib/data"
import Image from "next/image"
import Link from "next/link"

type Teacher = {
    idProfessor: string
    fecha_nacimiento: string,
    name: string,
    lastName: string,
    email?: string,
    address: string,
    cedula: string,
    cursos: string [],
    phone: string
};


const columns = [
    { header: "Info", accessor: "info" },
    { header: "Cedula", accessor: "cedula", className: "hidden md:table-cell" },
    { header: "Cursos", accessor: "cursos", className: "hidden lg:table-cell" },
    { header: "Telefono", accessor: "phone", className: "hidden lg:table-cell" },
    { header: "Direccion", accessor: "direccion", className: "hidden lg:table-cell" },
    { header: "Actions", accessor: "action" },
]

// Cambia a un componente asíncrono para poder usar `await` en `fetch`
const TeacherListPage = async () => {
    // Realiza la solicitud de datos a la API
    const response = await fetch(`${API_URL}profe/get`, { cache: "no-store" });// Usa `no-store` si quieres evitar el almacenamiento en caché
    const teachersData: Teacher[] = await response.json()

    const renderRow = (item: Teacher) => (
        <tr key={item.idProfessor} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
            <td className="flex items-center gap-4 p-4">
                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.name} 
                      {" "} {item.lastName}</h3>
                    <p className="text-xs text-gray-500">{item?.email}</p>
                </div>
            </td>
            <td className="hidden md:table-cell">{item.cedula}</td>
            <td className="hidden md:table-cell">{item.cursos.join(",")}</td>
            <td className="hidden md:table-cell">{item.phone}</td>
            <td className="hidden md:table-cell px-4">{item.address}</td>
            <td>
                <div className="flex items-center gap-2">
                    <Link href={`/list/teachers/${item.idProfessor}`}>
                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
                            <Image src="/view.png" alt="" width={16} height={16} />
                        </button>
                    </Link>
                    {role === "admin" && (
                        <FormModal table="teacher" type="delete" id={item.idProfessor} />
                    )}
                </div>
            </td>
        </tr>
    )

    return (
        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todos los Profesores</h1>
                <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
                    <TableSearch />
                    <div className="flex items-center gap-4">
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/filter.png" alt="filter" width={14} height={14} />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-full bg-lamaYellow">
                            <Image src="/sort.png" alt="sort" width={14} height={14} />
                        </button>
                        {role === "admin" && (
                            <FormModal table="teacher" type="create" />
                        )}
                    </div>
                </div>
            </div>
            <Table columns={columns} renderRow={renderRow} data={teachersData} />
            <Pagination />
        </div>
    )
}

export default TeacherListPage
