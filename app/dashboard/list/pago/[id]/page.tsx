'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { API_URL } from '@/app/lib/config';

interface Pago {
  idPago: string;
  miembro: {
    cedula: string;
    nombre: string;
    apellido: string;
  };
  fecha_pago: string;
  metodoPago: string;
  referencia: string;
  observacion: string;
  monto: number;
}

export default function PagoDetail() {
  const { id } = useParams();
  const [pago, setPago] = useState<Pago | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cedula: '',
    fecha_pago: '',
    metodoPago: '',
    referencia: '',
    observacion: '',
    monto: 0,
  });

  // Obtener los datos del pago por ID
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}pago/get/${id}`, { cache: "no-store" });
        if (!response.ok) throw new Error('Error en la solicitud');
        const result = await response.json();
        setFormData(result); // Pre-cargar datos en el formulario
        setPago(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    };
    fetchData();
  }, [id]);

  if (error) return <p>Error: {error}</p>;
  if (!formData.fecha_pago) return <p>Cargando...</p>;

  // Manejo del formulario de edición
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const dataToSend = {
      miembro: {
        cedula: formData.cedula, // Solo la cédula en el objeto miembro
      },
      fecha_pago: formData.fecha_pago, // Se mantiene el formato YYYY-MM-DD
      metodoPago: formData.metodoPago,
      referencia: formData.referencia,
      observacion: formData.observacion,
      monto: formData.monto,
    };

    try {
      const response = await fetch(`${API_URL}pago/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend), // Enviar el JSON con la estructura correcta
      });
      if (!response.ok) throw new Error('Error al guardar los cambios');

      const updatedPago = await response.json();
      setPago(updatedPago);
      setIsEditing(false); // Sale del modo de edición
    } catch (error) {
      console.error(error);
    }
  };

  if (!pago) {
    return <p className="text-center">Cargando datos del pago...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-16 lg:px-32">
      <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-6">
        {!isEditing ? (
          <>
            <h1 className="text-2xl font-semibold text-blue-700 mb-4">
              Pago de  {pago.miembro.nombre}  {pago.miembro.apellido}  C.I. {pago.miembro.cedula}
            </h1>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Fecha de pago:</strong> {pago.fecha_pago}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Método de Pago:</strong> {pago.metodoPago}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Referencia:</strong> {pago.referencia}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Observación:</strong> {pago.observacion}
            </p>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Monto:</strong> {pago.monto}
            </p>
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white p-2 rounded-md"
            >
              Editar Pago
            </button>
          </>
        ) : (
          <form onSubmit={handleSave}>
            <h1 className="text-2xl font-semibold text-blue-700 mb-4">
              Editar Pago
            </h1>
            <input
              type="text"
              name="cedula"
              value={formData.cedula}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="Cédula del Miembro"
              required
            />
            <input
              type="date"
              name="fecha_pago"
              value={formData.fecha_pago}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded-md"
              required
            />
            <input
              type="text"
              name="metodoPago"
              value={formData.metodoPago}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="Método de Pago"
              required
            />
            <input
              type="text"
              name="referencia"
              value={formData.referencia}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="Referencia"
              required
            />
            <textarea
              name="observacion"
              value={formData.observacion}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="Observación"
              rows={4}
            ></textarea>
            <input
              type="number"
              name="monto"
              value={formData.monto}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 border rounded-md"
              placeholder="Monto"
              required
            />
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-green-500 text-white p-2 rounded-md"
              >
                Guardar
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="bg-red-500 text-white p-2 rounded-md"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
