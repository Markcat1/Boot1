"use client";

import React, { useState } from "react";
import { usePipc, Equipamiento, Brigadista } from "@/context/PipcContext";

export default function RecursosPage() {
  const { state, addEquipamiento, removeEquipamiento, addBrigadista, removeBrigadista } = usePipc();

  const [nuevoEquipo, setNuevoEquipo] = useState<Partial<Equipamiento>>({
    tipo: "",
    cantidad: 1,
    ubicacion: "",
  });

  const [nuevoBrigadista, setNuevoBrigadista] = useState<Partial<Brigadista>>({
    nombre: "",
    brigada: "Evacuación",
  });

  const handleAddEquipo = () => {
    if (!nuevoEquipo.tipo || !nuevoEquipo.ubicacion) return;
    addEquipamiento({
      id: crypto.randomUUID(),
      tipo: nuevoEquipo.tipo,
      cantidad: nuevoEquipo.cantidad || 1,
      ubicacion: nuevoEquipo.ubicacion,
    });
    setNuevoEquipo({ tipo: "", cantidad: 1, ubicacion: "" });
  };

  const handleAddBrigadista = () => {
    if (!nuevoBrigadista.nombre) return;
    addBrigadista({
      id: crypto.randomUUID(),
      nombre: nuevoBrigadista.nombre,
      brigada: nuevoBrigadista.brigada as "Evacuación" | "Primeros Auxilios" | "Búsqueda y Rescate" | "Prevención y Combate de Incendios",
    });
    setNuevoBrigadista({ nombre: "", brigada: "Evacuación" });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Sección Equipamiento */}
      <section className="bg-white p-8 shadow-sm rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 border-b pb-2 text-slate-800">3.1 Recursos Materiales</h2>
        <p className="text-gray-600 mb-6 text-sm">Inventario de equipos de seguridad (extintores, botiquines, señalética).</p>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Equipo</label>
            <input
              type="text"
              value={nuevoEquipo.tipo}
              onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, tipo: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              placeholder="Ej. Extintor PQS 4.5kg"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 mb-1">Cantidad</label>
            <input
              type="number" min="1"
              value={nuevoEquipo.cantidad}
              onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, cantidad: Number(e.target.value) })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
            <input
              type="text"
              value={nuevoEquipo.ubicacion}
              onChange={(e) => setNuevoEquipo({ ...nuevoEquipo, ubicacion: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              placeholder="Ej. Pasillo Principal"
            />
          </div>
          <button onClick={handleAddEquipo} className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
            Agregar Equipo
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ubicación</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.equipamiento.map((eq) => (
              <tr key={eq.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{eq.tipo}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{eq.cantidad}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{eq.ubicacion}</td>
                <td className="px-6 py-4 text-right text-sm">
                  <button onClick={() => removeEquipamiento(eq.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Sección Brigadas */}
      <section className="bg-white p-8 shadow-sm rounded-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-2 border-b pb-2 text-slate-800">3.2 Conformación de Brigadas</h2>
        <p className="text-gray-600 mb-6 text-sm">Asignación de personal a las brigadas básicas obligatorias.</p>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 mb-6 flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={nuevoBrigadista.nombre}
              onChange={(e) => setNuevoBrigadista({ ...nuevoBrigadista, nombre: e.target.value })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border"
              placeholder="Ej. Juan Pérez"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Brigada</label>
            <select
              value={nuevoBrigadista.brigada}
              onChange={(e) => setNuevoBrigadista({ ...nuevoBrigadista, brigada: e.target.value as "Evacuación" | "Primeros Auxilios" | "Búsqueda y Rescate" | "Prevención y Combate de Incendios" })}
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border bg-white"
            >
              <option value="Evacuación">Evacuación</option>
              <option value="Primeros Auxilios">Primeros Auxilios</option>
              <option value="Búsqueda y Rescate">Búsqueda y Rescate</option>
              <option value="Prevención y Combate de Incendios">Prevención y Combate de Incendios</option>
            </select>
          </div>
          <button onClick={handleAddBrigadista} className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700 transition">
            Asignar Brigadista
          </button>
        </div>

        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Brigada Asignada</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {state.brigadistas.map((b) => (
              <tr key={b.id}>
                <td className="px-6 py-4 text-sm text-gray-900">{b.nombre}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {b.brigada}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm">
                  <button onClick={() => removeBrigadista(b.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}
