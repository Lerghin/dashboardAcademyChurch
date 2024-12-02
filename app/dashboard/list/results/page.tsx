import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { API_URL } from "@/app/lib/config";
import { role } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";

type NotaMiembro = {
  idNota: string;
  idModulo: string;
  nota: number;
  cedula: string;
  statusAprobacion: string;
};

type ModuloNota = {
  idModulo: string;
  idCurso: string;
  nombreCurso: string;
  numModulo: number;
  descripcion: string;
  notaMiembroDTOList: NotaMiembro[];
};

const columns = [
  {
    header: "Curso",
    accessor: "nombreCurso",
  },
  {
    header: "Modulo",
    accessor: "numModulo",
  },
  {
    header: "Descripción",
    accessor: "descripcion",
  },
  {
    header: "Acciones",
    accessor: "actions",
  },
];

const ModuloNotaListPage = async () => {
  // Realizamos la llamada a la API
  const response = await fetch(`${API_URL}modulo/getmodulos`, { cache: "no-store" });
  
  // Verificamos si la respuesta fue exitosa y si los datos son correctos
  if (!response.ok) {
    // Manejamos errores si es necesario
    return <div>Error al cargar los módulos</div>;
  }

  const modulosData: ModuloNota[] = await response.json();

  const renderRow = (item: ModuloNota) => (
    <tr key={item.idModulo} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
      <td className="p-4">{item.nombreCurso}</td>
      <td className="text-center">{item.numModulo}</td>
      <td>{item.descripcion}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/list/modulos/${item.idModulo}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="Ver" width={16} height={16} />
            </button>
          </Link>
          <FormModal
            table="moduloNota"
            type="view"
            id={item.idModulo}
            content={
              <Table
                columns={[
                  { header: "Cedula", accessor: "cedula" },
                  { header: "Nota", accessor: "nota" },
                  { header: "Estado", accessor: "statusAprobacion" },
                ]}
                renderRow={(notaItem: NotaMiembro) => (
                  <tr key={notaItem.idNota} className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight">
                    <td className="p-4">{notaItem.cedula}</td>
                    <td className="text-center">{notaItem.nota}</td>
                    <td>{notaItem.statusAprobacion}</td>
                  </tr>
                )}
                data={item.notaMiembroDTOList}
              />
            }
          />
        </div>
      </td>
    </tr>
  );

  // Verificación adicional para que no se intente renderizar la tabla hasta que los datos estén listos
  if (!modulosData || modulosData.length === 0) {
    return <div>No se encontraron módulos disponibles.</div>;
  }

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Todos los Modulos</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-4 self-end">
            {role === "admin" && (
              <FormModal table="moduloNota" type="create" />
            )}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={modulosData} />
      {/* PAGINATION */}
      <Pagination />
    </div>
  );
};

export default ModuloNotaListPage;
