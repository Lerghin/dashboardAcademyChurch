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
  const pagosPerPage = 10;

  // Estados para filtros
  const [filters, setFilters] = useState({
    fecha_pago: "",
    monto: "",
    referencia: "",
    cedula: "",
  });

  const [filteredData, setFilteredData] = useState<Pago[]>([]);

  // Obtener los pagos cuando el componente se monta
  useEffect(() => {
    const fetchPagos = async () => {
      const response = await fetch(`${API_URL}pago/get`, { cache: "no-store" });
      const data: Pago[] = await response.json();
      setPagosData(data);
      setFilteredData(data); // Cargar datos al inicio
    };

    fetchPagos();
  }, []);

  // Manejo de cambio en los filtros
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  // Filtrar datos en función de los filtros
  useEffect(() => {
    const applyFilters = () => {
      let results = pagosData;

      if (filters.fecha_pago) {
        results = results.filter((item) =>
          item.fecha_pago.includes(filters.fecha_pago)
        );
      }

      if (filters.monto) {
        results = results.filter(
          (item) => item.monto.toString().includes(filters.monto)
        );
      }

      if (filters.referencia) {
        results = results.filter((item) =>
          item.referencia.toLowerCase().includes(filters.referencia.toLowerCase())
        );
      }

      if (filters.cedula) {
        results = results.filter((item) =>
          item.miembro.cedula.includes(filters.cedula)
        );
      }

      setFilteredData(results);
      setCurrentPage(1); // Reiniciar la paginación al aplicar un filtro
    };

    applyFilters();
  }, [filters, pagosData]);

  // Paginación lógica
  const indexOfLastPago = currentPage * pagosPerPage;
  const indexOfFirstPago = indexOfLastPago - pagosPerPage;
  const currentPagos = filteredData.slice(indexOfFirstPago, indexOfLastPago);

  const totalPages = Math.ceil(filteredData.length / pagosPerPage);

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
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* FORMULARIO DE FILTRO */}
      <div className="mb-4 p-2 bg-gray-50 rounded-md">
        <div className="flex gap-2 md:gap-4">
          <input
            name="fecha_pago"
            type="date"
            placeholder="Fecha de Pago"
            className="border p-2 rounded"
            value={filters.fecha_pago}
            onChange={handleFilterChange}
          />
          <input
            name="monto"
            type="number"
            placeholder="Monto"
            className="border p-2 rounded"
            value={filters.monto}
            onChange={handleFilterChange}
          />
          <input
            name="referencia"
            type="text"
            placeholder="Referencia"
            className="border p-2 rounded"
            value={filters.referencia}
            onChange={handleFilterChange}
          />
          <input
            name="cedula"
            type="text"
            placeholder="Cédula"
            className="border p-2 rounded"
            value={filters.cedula}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      
      {/* LISTADO */}
      <Table columns={columns} renderRow={renderRow} data={currentPagos} />

      {/* PAGINACION */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page: number) => setCurrentPage(page)}
      />
    </div>
  );
};

export default PagoListPage;
