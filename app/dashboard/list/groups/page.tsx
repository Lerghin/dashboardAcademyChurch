'use client'
import { useState, useEffect } from "react";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import { API_URL } from "@/app/lib/config";
import { role } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";

type MiembroList = {
  idMiembro: string;
  cedula: string;
  nombre: string;
  apellido: string;
};

type Groups = {
  idGrupo: string;
  numeroGrupo: string;
  miembroList: MiembroList[];
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Lista",
    accessor: "miembrosList",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const GroupsListPage = () => {
  const [groupsData, setGroupsData] = useState<Groups[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Número de grupos por página
  const groupsPerPage = 10;
  const token = useAuthStore((state) => state.getToken()); // Obtener el token usando getToken
  // Inicializa el enrutador para redirigir si no hay token
 
   useEffect(() => {
     if (!token) {
       window.location.href = "/"; // Redirige a la página de login si no hay token
     }
   }, [token]); // Ejecuta el efecto cada vez que el token cambie
  // Obtener los grupos cuando el componente se monta
  useEffect(() => {
    const fetchGroups = async () => {
      const response = await fetch(`${API_URL}grupo/get`, { cache: "no-store" });
      const data: Groups[] = await response.json();
      setGroupsData(data);
    };

    fetchGroups();
  }, []);

  // Calcular el rango de grupos a mostrar en base a la página actual
  const indexOfLastGroup = currentPage * groupsPerPage;
  const indexOfFirstGroup = indexOfLastGroup - groupsPerPage;
  const currentGroups = groupsData.slice(indexOfFirstGroup, indexOfLastGroup);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(groupsData.length / groupsPerPage);

  const renderRow = (item: Groups) => (
    <tr
      key={item.idGrupo}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.numeroGrupo}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">
        <div className="flex flex-col flex-1">
          {item.miembroList.map((miembro, index) => (
            <span key={index}>
              {miembro.nombre} {miembro.apellido}
              {index < item.miembroList.length - 1 && ", "}
            </span>
          ))}
        </div>
      </td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/list/groups/${item.idGrupo}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="grupo" type="delete" id={item.idGrupo} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Todos los Grupos</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            {role === "admin" && <FormModal table="grupo" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={currentGroups} />
      {/* PAGINATION */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page: number) => setCurrentPage(page)} // Actualiza la página actual
      />
    </div>
  );
};

export default GroupsListPage;
