import { API_URL } from "@/app/lib/config";
import { useState } from "react";

interface Miembro {
  cedula: string;
}

interface Pago {
  miembro: Miembro;
  fecha_pago: string;
  metodoPago: string;
  referencia: string;
  observacion: string;
  monto: number; // Agregado monto
}

interface FormModalProps {
  table: string;
  onClose: () => void;
  onSave: (pago: Pago) => void;
}

const CreatePagoModal: React.FC<FormModalProps> = ({ table, onClose, onSave }) => {
  const [cedula, setCedula] = useState<string>("");
  const [fecha_pago, setFechaPago] = useState<string>("");
  const [metodoPago, setMetodoPago] = useState<string>("");
  const [referencia, setReferencia] = useState<string>("");
  const [observacion, setObservacion] = useState<string>("");
  const [monto, setMonto] = useState<number>(0); // Nuevo estado para monto

  const handleSubmit = async () => {
    const pagoPayload: Pago = {
      miembro: { cedula },
      fecha_pago,
      metodoPago,
      referencia,
      observacion,
      monto, // Incluyendo el monto
    };

    try {
      console.log(pagoPayload); // Verifica los datos que se enviarán
      const response = await fetch(`${API_URL}pago/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pagoPayload),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el pago");
      }

      const savedPago = await response.text();
      window.location.reload(); // Recarga la página para reflejar los cambios
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">Crear Pago</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Cédula del Miembro</label>
          <input
            type="text"
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Fecha de Pago</label>
          <input
            type="date"
            value={fecha_pago}
            onChange={(e) => setFechaPago(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Método de Pago</label>
          <input
            type="text"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Referencia</label>
          <input
            type="text"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Observación</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Monto</label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(parseFloat(e.target.value))}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-between">
        <button
            onClick={() => {
            
              window.location.reload(); // Recarga la página
            }}
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePagoModal;
