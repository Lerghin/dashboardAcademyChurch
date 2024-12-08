'use client'
import { useState, useEffect } from "react";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import { API_URL } from "@/app/lib/config";
import { role } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";

type Miembro = {
  idMiembro: string;
  nombre: string;
  apellido: string;
  cedula: string;
};

type Pago = {
  idPago: string;
  miembro: Miembro;
  fecha_pago: string;
  metodoPago: string;
  referencia: string;
  observacion: string;
  monto: number;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Fecha Pago",
    accessor: "fecha_pago",
    className: "hidden md:table-cell",
  },
  {
    header: "Metodo de Pago",
    accessor: "metodoPago",
    className: "hidden lg:table-cell",
  },
  {
    header: "Referencia",
    accessor: "referencia",
    className: "hidden lg:table-cell",
  },
  {
    header: "Observación",
    accessor: "observacion",
    className: "hidden lg:table-cell",
  },
  {
    header: "Monto",
    accessor: "monto",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const PagoListPage = () => {
  const [pagosData, setPagosData] = useState<Pago[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  
  // Número de pagos por página
  const pagosPerPage = 10;

  // Obtener los pagos cuando el componente se monta
  useEffect(() => {
    const fetchPagos = async () => {
      const response = await fetch(`${API_URL}pago/get`, { cache: "no-store" });
      const data: Pago[] = await response.json();
      setPagosData(data);
    };

    fetchPagos();
  }, []);

  // Calcular el rango de pagos a mostrar en base a la página actual
  const indexOfLastPago = currentPage * pagosPerPage;
  const indexOfFirstPago = indexOfLastPago - pagosPerPage;
  const currentPagos = pagosData.slice(indexOfFirstPago, indexOfLastPago);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(pagosData.length / pagosPerPage);

  const renderRow = (item: Pago) => (
    <tr
      key={item.idPago}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.miembro.nombre} {item.miembro.apellido} {item.miembro.cedula}
          </h3>
        </div>
      </td>
      <td className="hidden md:table-cell text-center">{item.fecha_pago}</td>
      <td className="hidden lg:table-cell text-center">{item.metodoPago}</td>
      <td className="hidden lg:table-cell text-center">{item.referencia}</td>
      <td className="hidden lg:table-cell text-center">{item.observacion}</td>
      <td className="hidden lg:table-cell text-center">{item.monto}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/list/pago/${item.idPago}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="pago" type="delete" id={item.idPago} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Todos los Pagos</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            {role === "admin" && <FormModal table="pago" type="create" />}
          </div>
        </div>
      </div>
      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={currentPagos} />
      {/* PAGINATION */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page: number) => setCurrentPage(page)} // Actualiza la página actual
      />
    </div>
  );
};

export default PagoListPage;

