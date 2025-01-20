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
import CreatePagoModal from "@/app/components/forms/CreatePago";

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
  const token = useAuthStore((state) => state.getToken()); // Obtener el token usando getToken
 // Inicializa el enrutador para redirigir si no hay token

  useEffect(() => {
    if (!token) {
      window.location.href = "/"; // Redirige a la página de login si no hay token
    }
  }, [token]); // Ejecuta el efecto cada vez que el token cambie

  // Estados para filtros
  const [filters, setFilters] = useState({
    fecha_pago: "",
    monto: "",
    referencia: "",
    cedula: "",
  });

  const [filteredData, setFilteredData] = useState<Pago[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleDelete = (idPago: string) => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este pago?"
    );
    if (confirmed) {
      fetch(`${API_URL}pago/delete/${idPago}`, { method: "DELETE" })
        .then((response) => {
          if (response.ok) {
            alert("Pago eliminado exitosamente");
            setPagosData((prevPagos) => prevPagos.filter((pago) => pago.idPago !== idPago));
            setFilteredData((prevFiltered) => prevFiltered.filter((pago) => pago.idPago !== idPago));
          } else {
            // Si la respuesta no es exitosa
            alert("Hubo un problema al eliminar el pago");
            console.error(`Error al eliminar el pago: ${response.statusText}`);
          }
        })
        .catch((error) => {
          console.error("Error al eliminar el pago", error);
          alert("Error al intentar eliminar el pago. Por favor, intenta nuevamente.");
        });
    } else {
      alert("Eliminación cancelada");
    }
  };
  

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
          <button
            onClick={() => handleDelete(item.idPago)}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500"
          >
            <Image src="/delete.png" alt="Eliminar" width={16} height={16} />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* FORMULARIO DE FILTRO */}
      <div className="mb-4 p-2 bg-gray-50 rounded-md">
        <div className="flex flex-col gap-2 md:flex-row md:gap-4">
          <input
            name="fecha_pago"
            type="date"
            placeholder="Fecha de Pago"
            className="border p-2 rounded w-full md:w-auto"
            value={filters.fecha_pago}
            onChange={handleFilterChange}
          />
          <input
            name="monto"
            type="number"
            placeholder="Monto"
            className="border p-2 rounded w-full md:w-auto"
            value={filters.monto}
            onChange={handleFilterChange}
          />
          <input
            name="referencia"
            type="text"
            placeholder="Referencia"
            className="border p-2 rounded w-full md:w-auto"
            value={filters.referencia}
            onChange={handleFilterChange}
          />
          <input
            name="cedula"
            type="text"
            placeholder="Cédula"
            className="border p-2 rounded w-full md:w-auto"
            value={filters.cedula}
            onChange={handleFilterChange}
          />
           {role === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-lamaSky text-white p-2 rounded-md w-full md:w-auto"
            >
              Agregar Pago 
            </button>
          )}
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
       {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-md w-96" onClick={(e) => e.stopPropagation()}>
           <CreatePagoModal type={"create"}  onClose={() => setIsModalOpen(false)} />
            <button
              onClick={() => setIsModalOpen(false)}
              className="mt-4 w-full py-2 bg-red-500 text-white rounded-md"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PagoListPage;
