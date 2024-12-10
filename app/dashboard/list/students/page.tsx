'use client';
import { useState, useEffect } from "react";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { API_URL } from "@/app/lib/config";
import { role } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";

// Define el tipo para la estructura de datos.
type Student = {
  idMiembro: string;
  nombre: string;
  apellido: string;
  email?: string;
  cedula: string;
  telefono?: string;
  fecha_nacimiento: string;
  direccion: string;
  status: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Cedula", accessor: "cedula", className: "hidden md:table-cell" },
  { header: "Fecha Nacimiento", accessor: "fecha_nacimiento", className: "hidden md:table-cell" },
  { header: "Direccion", accessor: "direccion", className: "hidden lg:table-cell" },
  { header: "Telefono", accessor: "telefono", className: "hidden lg:table-cell" },
  { header: "Status", accessor: "status", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const StudentListPage = () => {
  const [studentsData, setStudentsData] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]); // Estado para los datos filtrados
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Cantidad de elementos por página
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda

  const token = useAuthStore((state) => state.getToken()); // Obtener el token usando getToken
 // Inicializa el enrutador para redirigir si no hay token

  useEffect(() => {
    if (!token) {
      window.location.href = "/"; // Redirige a la página de login si no hay token
    }
  }, [token]); // Ejecuta el efecto cada vez que el token cambie
  // Simulación de datos cargados desde la API.
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}miembro/get`, { cache: "no-store" });
      const data: Student[] = await response.json();
      setStudentsData(data);
      setFilteredStudents(data); // Establecer los datos por defecto al inicio
    };
    fetchData();
  }, []);

  // Actualizar el filtro basado en el término de búsqueda
  useEffect(() => {
    const filtered = studentsData.filter((student) =>
      student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.cedula.includes(searchTerm)
    );
    setFilteredStudents(filtered);
    setCurrentPage(1); // Resetear la página al buscar
  }, [searchTerm, studentsData]);

  // Calcular el subconjunto de datos de la página actual.
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

  // Cambiar la página.
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const renderRow = (item: Student) => (
    <tr
      key={item.idMiembro}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.nombre} {item.apellido}</h3>
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
            <FormModal table="miembro" type="delete" id={item.idMiembro} />
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
          {/* Campo de búsqueda */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Buscar por nombre, apellido o cédula"
              className="border px-3 py-1 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)} // Actualizar el término de búsqueda
            />
          </div>
          <div className="flex items-center gap-4 self-end">
            {role === "admin" && (
              <FormModal table="student" type="create" />
            )}
          </div>
        </div>
      </div>

      {/* Tabla de datos dinámicos */}
      <Table columns={columns} renderRow={renderRow} data={currentStudents} />

      {/* PAGINACIÓN */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default StudentListPage;
