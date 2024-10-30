
import FormModal from "@/app/components/FormModal"
import Pagination from "@/app/components/Pagination"
import Table from "@/app/components/Table"
import TableSearch from "@/app/components/TableSearch"
import { API_URL } from "@/app/lib/config"
import { role } from "@/app/lib/data"
import Image from "next/image"
import Link from "next/link"


type miembroList = {
    idMiembro: string;
    cedula: string;
    nombre: string;
    apellido: string;

}
type Groups = {
    idGrupo: string;
    numeroGrupo: string;
    miembroList: miembroList[];

}

const columns = [
    {
        header: "Info",
        accesor: "info"
    },
    {
        header: "Lista",
        accesor: "miembrosList",
        className: "hidden md:table-cell",

    },
    {
        header: "Actions",
        accesor: "action",


    },
]

const GroupsListPage = async () => {
    const response = await fetch(`${API_URL}grupo/get`, { cache: "no-store" });
    const groupsData: Groups[] = await response.json()

    const renderRow = (item: Groups) => (

        <tr key={item.idGrupo} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight  ">
            <td className="flex items-center gap-4 p-4  ">

                <div className="flex flex-col">
                    <h3 className="font-semibold">{item.numeroGrupo}</h3>
                </div>


            </td>
            <td className="hidden  md:table-cell">
                <div className="flex flex-col flex-1">
                {item.miembroList.map((miembro, index) => (
                    <span key={index}>{miembro.nombre} {""} {miembro.apellido}{index < item.miembroList.length - 1 && ', '}</span>
                ))}
                </div>
            </td>


            <td>
                <div className="flex items-center gap-2">
                    {role === "admin" && (
                        <>
                            <FormModal table="parent" type="update" data={item} />
                            <FormModal table="parent" type="delete" id={item.idGrupo} />
                        </>
                    )}
                </div>

            </td>
        </tr>
    )

    return (

        <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
            {/* TOP */}
            <div className="flex items-center justify-between">
                <h1 className="hidden md:block text-lg font-semibold">Todos los Grupos</h1>
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
                            <FormModal table="teacher" type="create" />
                        )}
                    </div>
                </div>
            </div>
            {/* LIST */}
            <Table columns={columns} renderRow={renderRow} data={groupsData} />
            {/* PAGINATION */}
            <Pagination />
        </div>
    );
};
export default GroupsListPage