"use client";

import { API_URL } from "@/app/lib/config";
import Table from "@/app/components/Table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ModuloDTO = {
  idModulo: string;
  numModulo: number;
  descripcion: string;
};

type ModuloCursoDTO = {
  idCurso: string;
  nombreCurso: string;
  moduloDTOList: ModuloDTO[];
};

const columns = [
  { header: "Número del Módulo", accessor: "numModulo" },
  { header: "Descripción", accessor: "descripcion" },
  { header: "Acciones", accessor: "action" },
];

interface ModuleListPageProps {
  params: {
    idCurso: string;
  };
}

const ModuleListPage = ({ params }: ModuleListPageProps) => {
  const [modules, setModules] = useState<ModuloDTO[]>([]);
  const { id } = useParams<string>();

  useEffect(() => {
    const fetchModules = async () => {
      const response = await fetch(`${API_URL}modulo/getmodulodto/${id}`, { cache: "no-store" });
      console.log(response);
      if (response.ok) {
        const data: ModuloCursoDTO = await response.json();
        setModules(data.moduloDTOList);
      }
    };
    if (id) fetchModules();
  }, [id]);

  const renderRow = (item: ModuloDTO) => (
    <tr
      key={item.idModulo}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td>
        
         {item.numModulo}
       
      </td>
      <td>{item.descripcion}</td>
      <td>
        <Link href={`/dashboard/list/modules/${item.idModulo}`}>
          <button className="bg-blue-500 text-white px-4 py-1 rounded">Ver Notas</button>
        </Link>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">Módulos del Curso</h1>
      {modules.length > 0 ? (
        <Table columns={columns} renderRow={renderRow} data={modules} />
      ) : (
        <p>No hay módulos disponibles.</p>
      )}
    </div>
  );
};

export default ModuleListPage;
