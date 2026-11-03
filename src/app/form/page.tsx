"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  datetime: z.string().min(1, "Fecha y hora son obligatorias"),
  streetAndNumber: z.string().min(1, "La calle y número son obligatorios"),
  colony: z.string().min(1, "La colonia es obligatoria"),
  userName: z.string().min(1, "El nombre del afectado es obligatorio"),
  gasCompany: z.string().min(1, "La empresa distribuidora es obligatoria"),
  cylinderCapacity: z.string().min(1, "La capacidad del contenedor es obligatoria"),
  damageTypes: z.array(z.string()).min(1, "Debe seleccionar al menos un tipo de daño"),
  observations: z.string().optional(),
  finalStatus: z.string().min(1, "El estatus final es obligatorio"),
});

type FormValues = z.infer<typeof formSchema>;

const DAMAGE_TYPES = [
  "Válvula defectuosa",
  "Base picada/corrosión",
  "Cuerpo golpeado/fisura",
  "Sobrellenado",
  "Maniobra de conexión",
  "Otro",
];

export default function MobileForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      damageTypes: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setSuccessMessage("");
    try {
      const response = await fetch("/api/interventions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSuccessMessage("Registro guardado con éxito.");
        reset();
      } else {
        alert("Error al guardar el registro.");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Registro de Fuga GLP</h1>

        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Fecha y hora */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
            <input
              type="datetime-local"
              {...register("datetime")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
            {errors.datetime && <p className="text-red-500 text-xs mt-1">{errors.datetime.message}</p>}
          </div>

          {/* Ubicación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Calle y número</label>
            <input
              type="text"
              placeholder="Ej. Av. Vallarta 1234, Int 2"
              {...register("streetAndNumber")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
            {errors.streetAndNumber && <p className="text-red-500 text-xs mt-1">{errors.streetAndNumber.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Colonia</label>
            <input
              type="text"
              placeholder="Ej. Americana"
              {...register("colony")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
            {errors.colony && <p className="text-red-500 text-xs mt-1">{errors.colony.message}</p>}
          </div>

          {/* Usuario Afectado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Afectado / Usuario</label>
            <input
              type="text"
              placeholder="Nombre completo"
              {...register("userName")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            />
            {errors.userName && <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>}
          </div>

          {/* Especificaciones del cilindro */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa Distribuidora</label>
            <select
              {...register("gasCompany")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            >
              <option value="">Seleccione una empresa...</option>
              <option value="Zeta Gas">Zeta Gas</option>
              <option value="SoniGas">SoniGas</option>
              <option value="Global Gas">Global Gas</option>
              <option value="Gas Express Nieto">Gas Express Nieto</option>
              <option value="Otra">Otra</option>
            </select>
            {errors.gasCompany && <p className="text-red-500 text-xs mt-1">{errors.gasCompany.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidad del Contenedor</label>
            <select
              {...register("cylinderCapacity")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            >
              <option value="">Seleccione capacidad...</option>
              <option value="10 kg">10 kg</option>
              <option value="20 kg">20 kg</option>
              <option value="30 kg">30 kg</option>
              <option value="45 kg">45 kg</option>
              <option value="Estacionario">Estacionario / Otro</option>
            </select>
            {errors.cylinderCapacity && <p className="text-red-500 text-xs mt-1">{errors.cylinderCapacity.message}</p>}
          </div>

          {/* Tipo de daño (Múltiple) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Daño o Fuga (Puede seleccionar varios)</label>
            <div className="space-y-2">
              {DAMAGE_TYPES.map((type) => (
                <label key={type} className="flex items-center">
                  <input
                    type="checkbox"
                    value={type}
                    {...register("damageTypes")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
            {errors.damageTypes && <p className="text-red-500 text-xs mt-1">{errors.damageTypes.message}</p>}
          </div>

          {/* Observaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <textarea
              rows={3}
              {...register("observations")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
              placeholder="Detalles adicionales..."
            ></textarea>
          </div>

          {/* Estatus Final */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estatus Final</label>
            <select
              {...register("finalStatus")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            >
              <option value="">Seleccione estatus...</option>
              <option value="Retiro de cilindro">Retiro de cilindro</option>
              <option value="Control en sitio">Control en sitio</option>
              <option value="Entrega a empresa">Entrega a empresa</option>
              <option value="Otro">Otro</option>
            </select>
            {errors.finalStatus && <p className="text-red-500 text-xs mt-1">{errors.finalStatus.message}</p>}
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? "Guardando..." : "Guardar Registro"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
