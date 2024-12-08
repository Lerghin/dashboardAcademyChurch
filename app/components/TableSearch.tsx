'use client'
import { useState } from "react";
import Image from "next/image";

interface TableSearchProps {
  onSearch: (searchTerm: string) => void; // Función para manejar la búsqueda
}

const TableSearch = ({ onSearch }: TableSearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Llamar a la función de búsqueda
  };

  return (
    <div className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2">
      <Image src="/search.png" alt="Search icon" width={14} height={14} />
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearch}
        placeholder="Search..."
        className="rounded-full w-[200px] p-2 bg-transparent outline-none border-inherit"
      />
    </div>
  );
};

export default TableSearch;
