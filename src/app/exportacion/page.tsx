"use client";

import React, { useRef } from "react";
import { usePipc } from "@/context/PipcContext";

export default function ExportacionPage() {
  const { state } = usePipc();
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto">

      {/* Botón de impresión oculto al imprimir */}
      <div className="mb-6 flex justify-end print:hidden">
        <button
          onClick={handlePrint}
          className="bg-indigo-600 text-white px-6 py-2 rounded shadow hover:bg-indigo-700 transition font-medium"
        >
          Imprimir / Guardar como PDF
        </button>
      </div>

      {/* Contenedor del reporte (este se imprimirá) */}
      <div
        ref={reportRef}
        className="bg-white p-10 shadow-lg rounded-lg border border-gray-200 print:shadow-none print:border-none print:p-0"
      >
        {/* Portada */}
        <div className="text-center border-b-2 border-gray-800 pb-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 uppercase">Programa Interno de Protección Civil</h1>
          <h2 className="text-xl text-gray-600 mt-2">{state.diagnostico.razonSocial || "[Razón Social]"}</h2>
          <p className="mt-4 text-gray-500">Documento base para validación técnica en la Zona Metropolitana de Guadalajara (ZMG)</p>
          <p className="mt-1 text-gray-500 font-medium">Municipio: {state.diagnostico.municipio || "No especificado"}</p>
        </div>

        {/* 1. Datos Generales */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gray-100 p-2 rounded">1. Datos Generales y Diagnóstico</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div><span className="font-semibold">Giro Comercial:</span> {state.diagnostico.giroComercial || "N/A"}</div>
            <div><span className="font-semibold">Superficie Construida:</span> {state.diagnostico.superficieConstruida} m²</div>
            <div><span className="font-semibold">Población Fija:</span> {state.diagnostico.poblacionFija}</div>
            <div><span className="font-semibold">Población Flotante:</span> {state.diagnostico.poblacionFlotante}</div>
          </div>
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded">
            <span className="font-semibold text-gray-800">Nivel de Riesgo Clasificado (Ley PC Jalisco): </span>
            <span className="font-bold text-indigo-700">{state.diagnostico.nivelRiesgo || "Sin clasificar"}</span>
          </div>
        </section>

        {/* 2. Riesgos */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gray-100 p-2 rounded">2. Matriz de Riesgos y Vulnerabilidades</h3>
          {state.riesgos.length > 0 ? (
            <table className="w-full text-sm border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-2 py-1 text-left">Tipo</th>
                  <th className="border border-gray-300 px-2 py-1 text-left">Descripción</th>
                  <th className="border border-gray-300 px-2 py-1 text-center">Nivel</th>
                </tr>
              </thead>
              <tbody>
                {state.riesgos.map(r => (
                  <tr key={r.id}>
                    <td className="border border-gray-300 px-2 py-1">{r.tipo}</td>
                    <td className="border border-gray-300 px-2 py-1">{r.descripcion}</td>
                    <td className="border border-gray-300 px-2 py-1 text-center font-semibold">{r.nivel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500 italic">No se han registrado riesgos.</p>
          )}
        </section>

        {/* 3. Recursos y Brigadas */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gray-100 p-2 rounded">3. Recursos y Brigadas</h3>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">3.1 Equipamiento de Emergencia</h4>
            {state.equipamiento.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {state.equipamiento.map(e => (
                  <li key={e.id}>{e.cantidad}x {e.tipo} (Ubicación: {e.ubicacion})</li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500 italic">Sin equipamiento registrado.</p>}
          </div>
          <div>
            <h4 className="font-semibold mb-2">3.2 Padrón de Brigadistas</h4>
            {state.brigadistas.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {state.brigadistas.map(b => (
                  <li key={b.id}>{b.nombre} - Brigada de <span className="font-medium">{b.brigada}</span></li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500 italic">Sin brigadistas registrados.</p>}
          </div>
        </section>

        {/* 4. Programas */}
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 bg-gray-100 p-2 rounded">4. Programas y Bitácoras</h3>
          <div className="mb-4">
            <h4 className="font-semibold mb-2">4.1 Cronograma de Simulacros</h4>
            {state.simulacros.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {state.simulacros.map(s => (
                  <li key={s.id}>{s.fecha} - {s.tipo} {s.observaciones && `(${s.observaciones})`}</li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500 italic">Sin simulacros registrados.</p>}
            <p className="text-xs text-gray-500 mt-2">Cumplimiento normativo: {state.simulacros.length >= 2 ? 'Cumple (≥ 2 anuales)' : 'No cumple (< 2 anuales)'}</p>
          </div>
          <div>
            <h4 className="font-semibold mb-2">4.2 Mantenimientos Registrados</h4>
            {state.mantenimientos.length > 0 ? (
              <ul className="list-disc list-inside text-sm">
                {state.mantenimientos.map(m => (
                  <li key={m.id}>{m.equipo} (Realizado: {m.fecha} | Próximo: {m.proximoMantenimiento || 'N/A'})</li>
                ))}
              </ul>
            ) : <p className="text-sm text-gray-500 italic">Sin mantenimientos registrados.</p>}
          </div>
        </section>

        {/* Firmas */}
        <section className="mt-16 pt-8 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-8 text-center mt-8">
            <div>
              <div className="border-b border-gray-800 w-3/4 mx-auto mb-2 h-10"></div>
              <p className="text-sm font-semibold">Representante Legal / Propietario</p>
            </div>
            <div>
              <div className="border-b border-gray-800 w-3/4 mx-auto mb-2 h-10"></div>
              <p className="text-sm font-semibold">Tercero Acreditado / Consultor PC</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
