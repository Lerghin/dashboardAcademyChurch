'use client'
import { useState, useEffect } from "react";
import FormModal from "@/app/components/FormModal"; // Componente para el formulario de estudiantes
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import TableSearch from "@/app/components/TableSearch";
import { API_URL } from "@/app/lib/config";
import { role } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";
import StudentForm from "@/app/components/forms/StudentForm";

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
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado del modal para crear estudiante


const closeModal = () => {
  setIsModalOpen(false);
};

  const token = useAuthStore((state) => state.getToken());

  useEffect(() => {
    if (!token) {
      window.location.href = "/";
    }
  }, [token]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}miembro/get`, { cache: "no-store" });
      const data: Student[] = await response.json();
      setStudentsData(data);
      setFilteredStudents(data); // Establecer los datos por defecto
    };
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = studentsData.filter((student) =>
      student.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.cedula.includes(searchTerm)
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [searchTerm, studentsData]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstItem, indexOfLastItem);

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
            <button
              onClick={() => handleDelete(item.idMiembro)}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-red-500"
            >
              <Image src="/delete.png" alt="Eliminar" width={16} height={16} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );

  const handleDelete = (idMiembro: string) => {
    const confirmed = window.confirm("¿Estás seguro de que deseas eliminar este miembro?");
    if (confirmed) {
      fetch(`${API_URL}miembro/delete/${idMiembro}`, { method: "DELETE" })
        .then((response) => response.text())
        .then(() => {
          alert("Miembro eliminado exitosamente");
          setStudentsData((prevData) => prevData.filter((student) => student.idMiembro !== idMiembro));
          setFilteredStudents((prevData) => prevData.filter((student) => student.idMiembro !== idMiembro));
        })
        .catch((error) => {
          console.error("Error al eliminar el miembro", error);
          alert("Hubo un error al eliminar el miembro");
        });
    } else {
      alert("Eliminación cancelada");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <div className="flex items-center justify-between mb-4">
        <h1 className="hidden md:block text-lg font-semibold">Todos los Miembros</h1>
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md"
            placeholder="Buscar por nombre, apellido o cédula"
          />
          {role === "admin" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-lamaSky text-white p-2 rounded-md"
            >
              Agregar Miembro
            </button>
          )}
        </div>
      </div>

      <Table columns={columns} renderRow={renderRow} data={currentStudents} />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="bg-white p-6 rounded-md w-96" onClick={(e) => e.stopPropagation()}>
           <StudentForm type={"create"}   closeModal={closeModal} />
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

export default StudentListPage;
