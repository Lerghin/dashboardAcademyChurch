'use client';

import { useState, useEffect } from "react";
import Table from "@/app/components/Table";
import Pagination from "@/app/components/Pagination";
import { API_URL } from "@/app/lib/config";
import { useAuthStore } from "@/app/store/authStore";

type Teacher = {
  idProfessor: string;
  fecha_nacimiento: string;
  name: string;
  lastName: string;
  email?: string;
  address: string;
  cedula: string;
  cursos: string[];
  phone: string;
};

const columns = [
  { header: "Info", accessor: "info" },
  { header: "Cedula", accessor: "cedula", className: "hidden md:table-cell" },
  { header: "Cursos", accessor: "cursos", className: "hidden lg:table-cell" },
  { header: "Telefono", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Direccion", accessor: "direccion", className: "hidden lg:table-cell" },
  { header: "Actions", accessor: "action" },
];

const perPage = 10; // Número de elementos por página

const TeacherListPage = () => {
  const [teachersData, setTeachersData] = useState<Teacher[]>([]); // Todos los datos cargados
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState(""); // Término de búsqueda

  const token = useAuthStore((state) => state.getToken()); // Obtener el token usando getToken
 // Inicializa el enrutador para redirigir si no hay token

  useEffect(() => {
    if (!token) {
      window.location.href = "/"; // Redirige a la página de login si no hay token
    }
  }, [token]); // Ejecuta el efecto cada vez que el token cambie
  // Obtener los datos de la API
  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${API_URL}profe/get`, {
        cache: "no-store",
      });
      const data: Teacher[] = await response.json();
      setTeachersData(data);
      setTotalPages(Math.ceil(data.length / perPage));
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filtrar los datos en función del término de búsqueda
  const filteredTeachersData = teachersData.filter((teacher) =>
    `${teacher.name} ${teacher.lastName} ${teacher.cedula}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calcular los datos de la página actual para mostrar
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    return filteredTeachersData.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Volver a la primera página cuando se cambia el término de búsqueda
  };

  const renderRow = (item: Teacher) => (
    <tr
      key={item.idProfessor}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">
            {item.name} {item.lastName}
          </h3>
          <p className="text-xs text-gray-500">{item?.email}</p>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.cedula}</td>
      <td className="hidden md:table-cell">{item.cursos.join(",")}</td>
      <td className="hidden md:table-cell">{item.phone}</td>
      <td className="hidden md:table-cell px-4">{item.address}</td>
      <td>
        <div className="flex items-center gap-2">
          <button className="text-blue-500 hover:text-blue-700">Editar</button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-lg font-semibold">Todos los Profesores</h1>

        {/* Campo de búsqueda */}
        <div className="flex items-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border p-2 rounded-md ml-4"
            placeholder="Buscar por nombre, apellido o cédula"
          />
        </div>
      </div>

      {/* Tabla con datos paginados */}
      <Table columns={columns} renderRow={renderRow} data={getPaginatedData()} />

      {/* Componente de paginación */}
      <Pagination
        totalPages={Math.ceil(filteredTeachersData.length / perPage)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TeacherListPage;
