'use client';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Image from 'next/image';
import { API_URL } from '../lib/config';

// Define the type for the data you expect
type ChartData = {
  name: string;
  cantidad: number;
};

const AttendanceChart = () => {
  // Define the state with the correct type
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}miembro/distribucion-edad`);
        
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }

        const data = await response.json();
        
        // Map the fetched data to the structure expected by Recharts
        const chartData: ChartData[] = Object.keys(data).map(key => ({
          name: key,
          cantidad: data[key]
        }));
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-white rounded-lg p-4 h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Distribución por Edad</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={500} height={300} data={data} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#d1d5db" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#d1d5db" }} tickLine={false} />
          <Tooltip contentStyle={{ borderRadius: '10px', borderColor: 'lightgray' }} />
          <Legend
            align="left"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: '20px', paddingBottom: '40px' }}
          />
          <Bar
            dataKey="cantidad"
            fill="#88B2FA"
            legendType="circle"
            radius={[10, 10, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AttendanceChart;
