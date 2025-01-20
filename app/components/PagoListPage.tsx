'use client'
import { useState, useEffect } from "react";
import CreatePagoModal from "@/app/components/forms/CreatePago"; // Importar el modal de creación de pago
import Table from "@/app/components/Table"; // Importar el componente Table
import Pagination from "@/app/components/Pagination"; // Importar el componente Pagination
// ...existing code...

const renderRow = (row: any, handleDelete: (id: number) => void) => (
  <tr key={row.id}>
    <td>{row.fecha_pago}</td>
    <td>{row.monto}</td>
    <td>{row.referencia}</td>
    <td>{row.cedula}</td>
    <td>
      <button onClick={() => handleDelete(row.id)} className="text-red-500">Eliminar</button>
    </td>
  </tr>
);

const columns = [
  { header: 'Fecha de Pago', accessor: 'fecha_pago' },
  { header: 'Monto', accessor: 'monto' },
  { header: 'Referencia', accessor: 'referencia' },
  { header: 'Cédula', accessor: 'cedula' },
  { header: 'Acciones', accessor: 'acciones' }
];

const PagoListPage = () => {
  // ...existing code...
  const [showCreateModal, setShowCreateModal] = useState(false); // Estado para mostrar el modal
  interface Pago {
    id: number;
    fecha_pago: string;
    monto: number;
    referencia: string;
    cedula: string;
  }

  const [currentPagos, setCurrentPagos] = useState<Pago[]>([]); // Estado para almacenar los pagos actuales
  const [filters, setFilters] = useState({
    fecha_pago: '',
    monto: '',
    referencia: '',
    cedula: ''
  });

  const [totalPages, setTotalPages] = useState(1); // Estado para almacenar el número total de páginas
  const [currentPage, setCurrentPage] = useState(1); // Estado para almacenar la página actual

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value
    }));
  };

  const handleDelete = (id: number) => {
    setCurrentPagos(prevPagos => prevPagos.filter(pago => pago.id !== id));
  };

  // ...existing code...

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* FORMULARIO DE FILTRO */}
      <div className="mb-4 p-2 bg-gray-50 rounded-md">
        <div className="flex flex-col md:flex-row gap-2 md:gap-4">
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

      {/* BOTÓN PARA ABRIR EL MODAL */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Agregar Pago
        </button>
      </div>

      {/* LISTADO */}
      <Table columns={columns} renderRow={(row) => renderRow(row, handleDelete)} data={currentPagos} />

      {/* PAGINACION */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page: number) => setCurrentPage(page)}
      />

      {/* MODAL DE CREACIÓN */}
      {showCreateModal && (
        <CreatePagoModal
          type="create"
          onClose={() => setShowCreateModal(false)} // Cerrar el modal
        />
      )}
    </div>
  );
};

export default PagoListPage;
