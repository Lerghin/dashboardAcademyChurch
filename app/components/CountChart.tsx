"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { API_URL } from "../lib/config";

// Define the type for the data structure returned from the API
type DataPercentage = {
  total: number;
  countMen: number;
  countWomen: number;
  fillWomen: string;
  fillMen: string;
  fillTot: string;
  porcentWomen: number;
  porcenMen: number;
};

const CountChart = () => {
  // Initialize state variables for storing data
  const [data, setData] = useState<any[]>([]);
  const [porcent, setPorcent] = useState<{ porcentWomen: number; porcenMen: number }>({
    porcentWomen: 0,
    porcenMen: 0,
  });
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`${API_URL}miembro/get/percent`, { cache: "no-store" });
      const porcentData: DataPercentage = await response.json();
      console.log(porcentData);

      // Dynamically populate the data for the chart
      setData([
        {
          name: "Total",
          count: porcentData.total,
          fill: porcentData.fillTot,
        },
        {
          name: "Girls",
          count: porcentData.countWomen,
          fill: porcentData.fillWomen,
        },
        {
          name: "Boys",
          count: porcentData.countMen,
          fill: porcentData.fillMen,
        },
      ]);
      setPorcent({
        porcentWomen: porcentData.porcentWomen,
        porcenMen: porcentData.porcenMen,
      });

      setLoading(false);
    };

    fetchData();
  }, []);

  // If loading, show a loading message or spinner
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-xl w-full h-full p-4">
      {/* TITLE */}
      <div className="flex justify-between items-center">
        <h1 className="text-lg font-semibold">Miembros</h1>
        <Image src="/moreDark.png" alt="" width={20} height={20} />
      </div>

      {/* CHART */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={data}
          >
            <RadialBar background dataKey="count" />
          </RadialBarChart>
        </ResponsiveContainer>
        <Image
          src="/maleFemale.png"
          alt=""
          width={50}
          height={50}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* BOTTOM */}
      <div className="flex justify-center gap-16">
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaSky rounded-full" />
          <h1 className="font-bold">{data[2]?.count}</h1>
          <h2 className="text-xs text-gray-300">{porcent.porcenMen}% Hombres</h2>
        </div>
        <div className="flex flex-col gap-1">
          <div className="w-5 h-5 bg-lamaYellow rounded-full" />
          <h1 className="font-bold">{data[1]?.count}</h1>
          <h2 className="text-xs text-gray-300">{porcent.porcentWomen}% Mujeres</h2>
        </div>
      </div>
    </div>
  );
};

export default CountChart;
