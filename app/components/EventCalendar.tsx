"use client";

import { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import Image from "next/image";

// Asumiendo que la URL de la API está definida en el archivo de configuración
import { API_URL } from "../lib/config";  // Cambia esta ruta si es necesario

type Event = {
  idEvents: string;
  nameEvents: string;
  fecha_inicio: string;  // Esta será una cadena de texto
  description: string;
};

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${API_URL}events/get`);
        if (!response.ok) {
          throw new Error("Error fetching events");
        }
        const data = await response.json();

        // Filtrar los eventos para que solo queden los que están entre hoy y dentro de 30 días
        const today = new Date();
        const next30Days = new Date(today);
        next30Days.setDate(today.getDate() + 30); // Establece el límite de 30 días

        const filteredEvents = data.filter((event: Event) => {
          const eventDate = new Date(event.fecha_inicio);
          return eventDate >= today && eventDate <= next30Days; // Filtra eventos en el rango de 30 días
        });

        setEvents(filteredEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-white p-4 rounded-md">
      <Calendar onChange={onChange} value={value} />
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold my-4">Events</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-col gap-4">
        {events.length === 0 ? (
          <p>No events available</p>
        ) : (
          events.map((event) => (
            <div
              className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
              key={event.idEvents}
            >
              <div className="flex items-center justify-between">
                <h1 className="font-semibold text-gray-600">{event.nameEvents}</h1>
                <span className="text-gray-300 text-xs">
                  {new Date(event.fecha_inicio).toLocaleDateString()}
                </span>
              </div>
              <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
