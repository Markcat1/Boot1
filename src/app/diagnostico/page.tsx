"use client";

import React, { useEffect } from "react";
import { usePipc } from "@/context/PipcContext";

const municipiosZMG = [
  "Guadalajara",
  "Zapopan",
  "Tlaquepaque",
  "Tonalá",
  "Tlajomulco de Zúñiga",
  "El Salto",
  "Ixtlahuacán de los Membrillos",
  "Juanacatlán",
  "Zapotlanejo"
];

export default function DiagnosticoPage() {
  const { state, updateDiagnostico } = usePipc();
  const { diagnostico } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let parsedValue: string | number = value;

    if (["superficieConstruida", "poblacionFija", "poblacionFlotante"].includes(name)) {
      parsedValue = value === "" ? 0 : Number(value);
    }

    updateDiagnostico({ [name]: parsedValue });
  };

  // Logic for risk classification according to the Civil Protection Law of Jalisco State
  // This is a simplified estimation based on common ZMG criteria
  useEffect(() => {
    const { superficieConstruida, poblacionFija, poblacionFlotante } = diagnostico;
    const poblacionTotal = poblacionFija + poblacionFlotante;

    let riesgo: "Bajo" | "Medio" | "Alto" | "" = "";

    if (superficieConstruida > 0 || poblacionTotal > 0) {
      if (superficieConstruida < 300 && poblacionTotal < 50) {
        riesgo = "Bajo";
      } else if (superficieConstruida <= 1500 || poblacionTotal <= 250) {
        riesgo = "Medio";
      } else {
        riesgo = "Alto";
      }

      // Some businesses (giroComercial) inherently increase risk, but for this base implementation
      // we use area and population. We can update this later if giro has specific keywords (e.g. gasolinera)
    }

    if (riesgo !== diagnostico.nivelRiesgo) {
        updateDiagnostico({ nivelRiesgo: riesgo });
    }
  }, [diagnostico, updateDiagnostico]);

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-slate-800">1. Datos Generales del Inmueble y Diagnóstico</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Razón Social</label>
          <input
            type="text"
            name="razonSocial"
            value={diagnostico.razonSocial}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="Ej. Empresa SA de CV"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Giro Comercial</label>
          <input
            type="text"
            name="giroComercial"
            value={diagnostico.giroComercial}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
            placeholder="Ej. Oficinas Administrativas"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Superficie Construida (m²)</label>
          <input
            type="number"
            name="superficieConstruida"
            value={diagnostico.superficieConstruida || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Municipio (ZMG)</label>
          <select
            name="municipio"
            value={diagnostico.municipio}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border bg-white"
          >
            <option value="">Seleccione un municipio...</option>
            {municipiosZMG.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Población Fija (Empleados)</label>
          <input
            type="number"
            name="poblacionFija"
            value={diagnostico.poblacionFija || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Población Flotante (Visitantes/día)</label>
          <input
            type="number"
            name="poblacionFlotante"
            value={diagnostico.poblacionFlotante || ""}
            onChange={handleChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
          />
        </div>
      </div>

      <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Diagnóstico Preliminar de Riesgo</h3>
        <p className="text-sm text-gray-600 mb-4">
          Calculado en base a los criterios de la Ley de Protección Civil del Estado de Jalisco, considerando la superficie y afluencia.
        </p>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 font-medium">Nivel de Riesgo Clasificado:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${
            diagnostico.nivelRiesgo === "Bajo" ? "bg-green-100 text-green-800" :
            diagnostico.nivelRiesgo === "Medio" ? "bg-yellow-100 text-yellow-800" :
            diagnostico.nivelRiesgo === "Alto" ? "bg-red-100 text-red-800" :
            "bg-gray-100 text-gray-800"
          }`}>
            {diagnostico.nivelRiesgo || "Sin clasificar"}
          </span>
        </div>
      </div>
    </div>
  );
}
