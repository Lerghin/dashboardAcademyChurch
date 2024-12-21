'use client'

import React from "react";

interface PaginationProps {
  totalPages: number;        // Total de páginas
  currentPage: number;       // Página actual
  onPageChange: (page: number) => void; // Función para manejar el cambio de página
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-2 rounded-sm ${i === currentPage ? "bg-lamaSky" : "bg-gray-200"}`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      
      <div className="flex items-center gap-2 text-sm">
        {renderPageNumbers()}
      </div>
      
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
