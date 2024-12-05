'use client';
import { API_URL } from "@/app/lib/config";
import Table from "@/app/components/Table";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type NotaMiembroDTO = {
  idModulo: string;
  cedula: string;
  nota: number;
  statusAprobacion: string;
};

const columns = [
  { header: "Cédula", accessor: "cedula" },
  { header: "Nota", accessor: "nota" },
  { header: "Estado", accessor: "statusAprobacion" },
];

const NotesPage = () => {
  const { id } = useParams<string>();
  const { idMod } = useParams<string>();
  console.log(idMod)
  const [notes, setNotes] = useState<NotaMiembroDTO[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    idModulo: id, // Campo oculto para ID de nota
    cedula: "",
    nota: "",
    statusAprobacion: "",
  });

  useEffect(() => {
    const fetchNotes = async () => {
      const response = await fetch(`${API_URL}nota/getList/${id}`, { cache: "no-store" });
      if (response.ok) {
        const data = await response.json();
        setNotes(data.notaMiembroDTOList);
       
      }
    };
    if (id) fetchNotes();
  }, [id]);

  const handleOpenModal = () => {
    setFormData({
      idModulo: id, // Inicializamos el campo oculto como vacío
      cedula: "",
      nota: "",
      statusAprobacion: "",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSaveNote = async () => {
    const newNote = { ...formData }; // Incluimos idModulo automáticamente
    console.log(newNote);
    const response = await fetch(`${API_URL}nota/createnot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newNote),
    });

    if (response.ok) {
      const createdNote = await response.json();
      setNotes([...notes, createdNote]);
      handleCloseModal();
    } else {
      console.error("Error al guardar la nota");
    }
  };

  return (
    <div className="bg-white p-4 rounded-md flex-1 m-4 mt-0">
      <h1 className="text-lg font-semibold">Notas del Módulo</h1>
      <button
        onClick={handleOpenModal}
        className="bg-blue-500 text-white px-4 py-2 rounded-md mb-4"
      >
        Agregar Nota
      </button>
      {notes.length > 0 ? (
        <Table columns={columns} data={notes} />
      ) : (
        <p>No hay notas disponibles.</p>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-96">
            <h2 className="text-lg font-semibold mb-4">Agregar Nota</h2>
            {/* Campo oculto para idNota */}
            <input
              type="hidden"
              name="idNota"
              value={formData.idModulo}
              onChange={handleInputChange}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium">Cédula</label>
              <input
                type="text"
                name="cedula"
                value={formData.cedula}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium">Nota</label>
              <input
                type="number"
                name="nota"
                value={formData.nota}
                onChange={handleInputChange}
                className="w-full border rounded-md p-2"
              />
            </div>
           
            <div className="flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded-md"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveNote}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesPage;
