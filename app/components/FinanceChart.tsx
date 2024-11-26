"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { API_URL } from "../lib/config";  // Asegúrate de que esta URL esté configurada

type IncomeData = {
  month: string;
  income: number;
};

const FinanceChart = () => {
  const [data, setData] = useState<IncomeData[]>([]);

  useEffect(() => {
    const fetchIncomeData = async () => {
      try {
        const response = await fetch(`${API_URL}pago/get/ingresos`);
        if (!response.ok) {
          throw new Error("Error fetching income data");
        }
        const data = await response.json();
        
        // Convertir el mapa de ingresos por mes en un array de objetos
        const chartData = Object.keys(data).map((key) => ({
          month: key,       // El mes (como "JANUARY 2024")
          income: data[key], // El monto total del mes
        }));
        
        setData(chartData);
      } catch (error) {
        console.error("Error fetching income data:", error);
      }
    };

    fetchIncomeData();
  }, []);

  // Función para formatear el monto con el signo de dólar
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Finanzas</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
            tickMargin={10}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} tickMargin={20} />
          <Tooltip
            formatter={(value) => formatCurrency(value as number)} // Formatea los valores en el tooltip
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px" }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="#C3EBFA"
            strokeWidth={5}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;
