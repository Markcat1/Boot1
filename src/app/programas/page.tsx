"use client";

import React, { useState } from "react";
import { usePipc, Simulacro, Mantenimiento } from "@/context/PipcContext";

export default function ProgramasPage() {
  const { state, addSimulacro, removeSimulacro, addMantenimiento, removeMantenimiento } = usePipc();

  const [nuevoSimulacro, setNuevoSimulacro] = useState<Partial<Simulacro>>({
    fecha: "",
    tipo: "Evacuación por Sismo",
    observaciones: ""
  });

  const [nuevoMante, setNuevoMante] = useState<Partial<Mantenimiento>>({
    equipo: "",
    fecha: "",
    proximoMantenimiento: ""
  });

  const handleAddSimulacro = () => {
    if (!nuevoSimulacro.fecha || !nuevoSimulacro.tipo) return;
    addSimulacro({
      id: crypto.randomUUID(),
      fecha: nuevoSimulacro.fecha,
      tipo: nuevoSimulacro.tipo,
      observaciones: nuevoSimulacro.observaciones || ""
    });
    setNuevoSimulacro({ fecha: "", tipo: "Evacuación por Sismo", observaciones: "" });
  };

  const handleAddMante = () => {
    if (!nuevoMante.equipo || !nuevoMante.fecha) return;
    addMantenimiento({
      id: crypto.randomUUID(),
      equipo: nuevoMante.equipo,
      fecha: nuevoMante.fecha,
      proximoMantenimiento: nuevoMante.proximoMantenimiento || ""
    });
    setNuevoMante({ equipo: "", fecha: "", proximoMantenimiento: "" });
  };

  const simulacrosCount = state.simulacros.length;
  const isSimulacrosCompliant = simulacrosCount >= 2;

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Sección Simulacros */}
      <section className="bg-white p-8 shadow-sm rounded-lg border border-gray-200">
        <div className="flex justify-between items-start mb-2 border-b pb-2">
          <h2 className="text-2xl font-bold text-slate-800">4.1 Cronograma de Simulacros</h2>
          <div className={`px-3 py-1 rounded-full text-xs font-bold ${isSimulacrosCompliant ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isSimulacrosCompliant ? 'Cumple Normativa (≥ 2 anuales)' : 'No Cumple Normativa (< 2 anuales)'}
          </div>
        </div>
        <p className="text-gray-600 mb-6 text-sm">Programación de simulacros. La normatividad local requiere un mínimo de 2 simulacros al año.</p>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              value={nuevoSimulacro.fecha}
              onChange={(e) => setNuevoSimulacro({ ...nuevoSimulacro, fecha: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Hipótesis</label>
            <select
              value={nuevoSimulacro.tipo}
              onChange={(e) => setNuevoSimulacro({ ...nuevoSimulacro, tipo: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white"
            >
              <option value="Evacuación por Sismo">Evacuación por Sismo</option>
              <option value="Evacuación por Incendio">Evacuación por Incendio</option>
              <option value="Amenaza de Bomba">Amenaza de Bomba</option>
              <option value="Fuga de Gas/Químico">Fuga de Gas/Químico</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
            <input
              type="text"
              value={nuevoSimulacro.observaciones}
              onChange={(e) => setNuevoSimulacro({ ...nuevoSimulacro, observaciones: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              placeholder="Ej. Tiempo de evacuación estimado 2min"
            />
          </div>
          <button onClick={handleAddSimulacro} className="bg-orange-600 text-white px-4 py-2 rounded shadow hover:bg-orange-700 transition">
            Agendar Simulacro
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hipótesis</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Observaciones</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.simulacros.map((sim) => (
              <tr key={sim.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{sim.fecha}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{sim.tipo}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{sim.observaciones}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <button onClick={() => removeSimulacro(sim.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Sección Mantenimiento */}
      <section className="bg-white p-8 shadow-sm rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 border-b pb-2 text-slate-800">4.2 Bitácora de Mantenimiento</h2>
        <p className="text-gray-600 mb-6 text-sm">Registro de mantenimientos preventivos a instalaciones y equipos de emergencia.</p>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Equipo / Instalación</label>
            <input
              type="text"
              value={nuevoMante.equipo}
              onChange={(e) => setNuevoMante({ ...nuevoMante, equipo: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              placeholder="Ej. Recarga de extintores, Sistema Eléctrico"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Mtto.</label>
            <input
              type="date"
              value={nuevoMante.fecha}
              onChange={(e) => setNuevoMante({ ...nuevoMante, fecha: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Próximo Mtto.</label>
            <input
              type="date"
              value={nuevoMante.proximoMantenimiento}
              onChange={(e) => setNuevoMante({ ...nuevoMante, proximoMantenimiento: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
            />
          </div>
          <button onClick={handleAddMante} className="bg-teal-600 text-white px-4 py-2 rounded shadow hover:bg-teal-700 transition">
            Registrar Mtto.
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo/Instalación</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Realizada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Fecha</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.mantenimientos.map((m) => (
              <tr key={m.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{m.equipo}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{m.fecha}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{m.proximoMantenimiento}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <button onClick={() => removeMantenimiento(m.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
