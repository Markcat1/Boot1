"use client";

import React, { useState } from "react";
import { usePipc, Riesgo } from "@/context/PipcContext";

export default function RiesgosPage() {
  const { state, addRiesgo, removeRiesgo } = usePipc();
  const [nuevoRiesgo, setNuevoRiesgo] = useState<Partial<Riesgo>>({
    tipo: "Interno",
    descripcion: "",
    probabilidad: 1,
    impacto: 1,
  });

  const calcularNivel = (p: number, i: number): "Bajo" | "Medio" | "Alto" => {
    const score = p * i;
    if (score <= 5) return "Bajo";
    if (score <= 15) return "Medio";
    return "Alto";
  };

  const handleAdd = () => {
    if (!nuevoRiesgo.descripcion) return;

    const nivel = calcularNivel(nuevoRiesgo.probabilidad || 1, nuevoRiesgo.impacto || 1);

    addRiesgo({
      id: crypto.randomUUID(),
      tipo: nuevoRiesgo.tipo as "Interno" | "Externo",
      descripcion: nuevoRiesgo.descripcion,
      probabilidad: nuevoRiesgo.probabilidad || 1,
      impacto: nuevoRiesgo.impacto || 1,
      nivel
    });

    setNuevoRiesgo({
      tipo: "Interno",
      descripcion: "",
      probabilidad: 1,
      impacto: 1,
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white p-8 shadow-sm rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-2 border-b pb-2 text-slate-800">2. Análisis de Riesgos y Vulnerabilidades</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Identificación y evaluación de riesgos internos (eléctricos, incendio, etc.) y externos (hidrometeorológicos, socio-organizativos).
      </p>

      {/* Formulario para agregar riesgo */}
      <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-8">
        <h3 className="text-lg font-semibold mb-4 text-slate-800">Agregar Riesgo a la Matriz</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Origen</label>
            <select
              value={nuevoRiesgo.tipo}
              onChange={(e) => setNuevoRiesgo({ ...nuevoRiesgo, tipo: e.target.value as "Interno" | "Externo" })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white"
            >
              <option value="Interno">Interno</option>
              <option value="Externo">Externo</option>
            </select>
          </div>

          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción del Riesgo</label>
            <input
              type="text"
              value={nuevoRiesgo.descripcion}
              onChange={(e) => setNuevoRiesgo({ ...nuevoRiesgo, descripcion: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              placeholder="Ej. Falla eléctrica en tablero principal"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Probabilidad (1-5)</label>
            <input
              type="number"
              min="1" max="5"
              value={nuevoRiesgo.probabilidad}
              onChange={(e) => setNuevoRiesgo({ ...nuevoRiesgo, probabilidad: Number(e.target.value) })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
            />
          </div>

          <div className="lg:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Impacto (1-5)</label>
            <input
              type="number"
              min="1" max="5"
              value={nuevoRiesgo.impacto}
              onChange={(e) => setNuevoRiesgo({ ...nuevoRiesgo, impacto: Number(e.target.value) })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
            />
          </div>
        </div>
        <button
          onClick={handleAdd}
          className="mt-4 bg-slate-800 text-white px-4 py-2 rounded shadow hover:bg-slate-700 transition"
        >
          Agregar Riesgo
        </button>
      </div>

      {/* Tabla de Riesgos */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probabilidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impacto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel de Riesgo</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.riesgos.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No se han registrado riesgos.
                </td>
              </tr>
            ) : (
              state.riesgos.map((riesgo) => (
                <tr key={riesgo.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{riesgo.tipo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{riesgo.descripcion}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{riesgo.probabilidad}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{riesgo.impacto}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      riesgo.nivel === 'Bajo' ? 'bg-green-100 text-green-800' :
                      riesgo.nivel === 'Medio' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {riesgo.nivel}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => removeRiesgo(riesgo.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
