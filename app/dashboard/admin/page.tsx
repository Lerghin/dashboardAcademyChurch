"use client";

import AttendanceChart from "@/app/components/AttendanceChart";
import CountChart from "@/app/components/CountChart";
import EventCalendar from "@/app/components/EventCalendar";
import FinanceChart from "@/app/components/FinanceChart";
import UseCard from "@/app/components/UseCard";
import { API_URL } from "@/app/lib/config";
import { useAuthStore } from "@/app/store/authStore";
import withAuth from "@/app/store/withAuth";
import { FC, useEffect, useState } from "react";
// Importa useRouter para redirigir si no hay token

const AdminPage = () => {
  const [miembroData, setMiembroData] = useState<any>(null);
  const [profData, setProfData] = useState<any>(null);

  const token = useAuthStore((state) => state.getToken()); // Obtener el token usando getToken
 // Inicializa el enrutador para redirigir si no hay token

  useEffect(() => {
    if (!token) {
      window.location.href = "/"; // Redirige a la página de login si no hay token
    }
  }, [token]); // Ejecuta el efecto cada vez que el token cambie

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}miembro/get/number`, { cache: "no-store" });
        const miembroResult = await response.json();
        setMiembroData(miembroResult);

        const responseProf = await fetch(`${API_URL}profe/get/number`, { cache: "no-store" });
        const profResult = await responseProf.json();
        setProfData(profResult);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (token) { // Solo fetch los datos si hay token
      fetchData();
    }
  }, [token]); // Ejecuta la carga de datos cuando el token esté presente

  if (!token) {
    return null; // No renderiza nada si no hay token
  }

  if (!miembroData || !profData) {
    return <div>Loading...</div>; // Show a loading state until data is fetched
  }

  return (
    <div className="p-4 flex gap-4 flex-col md:flex-row">
      {/* LEFT */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER CARDS */}
        <div className="flex gap-4 justify-between flex-wrap">
          <UseCard type="Miembros" data={miembroData} />
          <UseCard type="Profesores" data={profData} />
        </div>
        {/* MIDDLE CHARTS */}
        <div className="flex gap-4 flex-col lg:flex-row">
          {/* COUNT CHART */}
          <div className="w-full lg:w-1/3 h-[450px]">
            <CountChart />
          </div>
          {/* ATTENDANCE CHART */}
          <div className="w-full lg:w-2/3 h-[450px]">
            <AttendanceChart />
          </div>
        </div>
        {/* BOTTOM CHART */}
        <div className="w-full h-[500px]">
          <FinanceChart />
        </div>
      </div>
      {/* RIGHT */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <EventCalendar />
      </div>
    </div>
  );
};

export default AdminPage; // Protege la página con withAuth
