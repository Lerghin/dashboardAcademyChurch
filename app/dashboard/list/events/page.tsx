'use client';

import { useState, useEffect } from "react";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import Table from "@/app/components/Table";
import { API_URL } from "@/app/lib/config";
import { role } from "@/app/lib/data";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/app/store/authStore";

type Event = {
  idEvents: string;
  nameEvents: string;
  description: string;
  fecha_inicio: string;
};

const columns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Descripcion",
    accessor: "description",
    className: "hidden md:table-cell",
  },
  {
    header: "Fecha",
    accessor: "fecha_inicio",
    className: "hidden md:table-cell",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

const EventListPage = () => {


  const [eventsData, setEventsData] = useState<Event[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState(""); // Captura la búsqueda por nombre
  const [searchDate, setSearchDate] = useState(""); // Captura la búsqueda por fecha
  
  const token = useAuthStore((state) => state.getToken()); // Obtener el token usando getToken
  // Inicializa el enrutador para redirigir si no hay token
 
   useEffect(() => {
     if (!token) {
       window.location.href = "/"; // Redirige a la página de login si no hay token
     }
   }, [token]); // Ejecuta el efecto cada vez que el token cambie


  const eventsPerPage = 10;

  // Obtener los eventos cuando el componente se monta
  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch(`${API_URL}events/get`, { cache: "no-store" });
      const data: Event[] = await response.json();
      setEventsData(data);
    };

    fetchEvents();
  }, []);

  // Calcular el rango de eventos a mostrar en base a la página actual
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;

  // Función para filtrar los datos
  const filteredEvents = eventsData.filter((event) => {
    const matchesName = event.nameEvents.toLowerCase().includes(searchName.toLowerCase());
    const matchesDate = searchDate
      ? event.fecha_inicio.startsWith(searchDate) // Filtrar por fecha de inicio
      : true;
    return matchesName && matchesDate;
  });

  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const renderRow = (item: Event) => (
    <tr
      key={item.idEvents}
      className="border-b border-gray-200 even:bg-slate-50 text-sm hover:bg-lamaPurpleLight"
    >
      <td className="flex items-center gap-4 p-4">
        <div className="flex flex-col">
          <h3 className="font-semibold">{item.nameEvents}</h3>
        </div>
      </td>
      <td className="hidden md:table-cell">{item.description}</td>
      <td className="hidden md:table-cell text-left">{item.fecha_inicio}</td>
      <td>
        <div className="flex items-center gap-2">
          <Link href={`/dashboard/list/events/${item.idEvents}`}>
            <button className="w-7 h-7 flex items-center justify-center rounded-full bg-lamaSky">
              <Image src="/view.png" alt="" width={16} height={16} />
            </button>
          </Link>
          {role === "admin" && (
            <FormModal table="events" type="delete" id={item.idEvents} />
          )}
        </div>
      </td>
    </tr>
  );

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <h1 className="hidden md:block text-lg font-semibold">Todos los Events</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-4 self-end">
            {role === "admin" && <FormModal table="events" type="create" />}
          </div>
        </div>
      </div>
      
      {/* Search Section */}
      <div className="my-4 flex gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border p-2 rounded"
        />
        <button
          className="bg-blue-500 text-white px-3 py-2 rounded"
          onClick={() => setCurrentPage(1)} // Reiniciar a la primera página
        >
          Buscar
        </button>
      </div>

      {/* LIST */}
      <Table columns={columns} renderRow={renderRow} data={currentEvents} />

      {/* PAGINATION */}
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page: number) => setCurrentPage(page)} 
      />
    </div>
  );
};

export default EventListPage;
