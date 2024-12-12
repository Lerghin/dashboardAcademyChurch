import { useState, useEffect } from "react";
import { API_URL } from "@/app/lib/config";

// Interfaz de las props
interface FormProps {
  table:string
  type: string;  // Aquí se define si es para crear o editar
  data?: Pago;  // En caso de ser edición, se pasan los datos del pago
}

interface Pago {
  miembro: Miembro;
  fecha_pago: string;
  metodoPago: string;
  referencia: string;
  observacion: string;
  monto: number;
}

interface Miembro {
  cedula: string;
}

const CreatePagoModal: React.FC<FormProps> = ({ table, onClose, onSave, type, data }) => {
  // Definir el estado de los campos del formulario
  const [cedula, setCedula] = useState<string>(data?.miembro?.cedula || "");
  const [fecha_pago, setFechaPago] = useState<string>(data?.fecha_pago || "");
  const [metodoPago, setMetodoPago] = useState<string>(data?.metodoPago || "");
  const [referencia, setReferencia] = useState<string>(data?.referencia || "");
  const [observacion, setObservacion] = useState<string>(data?.observacion || "");
  const [monto, setMonto] = useState<number>(data?.monto || 0);

  // Manejar el envío del formulario
  const handleSubmit = async () => {
    const pagoPayload: Pago = {
      miembro: { cedula },
      fecha_pago,
      metodoPago,
      referencia,
      observacion,
      monto,
    };

    try {
      const response = await fetch(`${API_URL}pago/${type}`, {  // Usar el tipo para determinar la URL (create o edit)
        method: type === "create" ? "POST" : "PUT",  // POST para crear, PUT para editar
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pagoPayload),
      });

      if (!response.ok) {
        throw new Error("Error al guardar el pago");
      }

      const savedPago = await response.text();
      onSave(savedPago);  // Llamar al callback onSave con el pago guardado
      onClose();  // Cerrar el modal
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  useEffect(() => {
    // Si el tipo es editar, establecer los datos del pago en los estados
    if (type === "edit" && data) {
      setCedula(data.miembro.cedula);
      setFechaPago(data.fecha_pago);
      setMetodoPago(data.metodoPago);
      setReferencia(data.referencia);
      setObservacion(data.observacion);
      setMonto(data.monto);
    }
  }, [type, data]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">{type === "create" ? "Crear Pago" : "Editar Pago"}</h2>

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
            onClick={onClose}  // Usar onClose para cerrar el modal
            className="px-4 py-2 bg-gray-300 rounded-md text-gray-700 hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            {type === "create" ? "Crear" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePagoModal;
