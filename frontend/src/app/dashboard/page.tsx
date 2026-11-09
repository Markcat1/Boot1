import React from 'react';

export default function B2BDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Sidebar/Header Placeholder */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">SafeZMG B2B Portal</h1>
          <nav>
            <ul className="flex space-x-4 text-sm font-medium">
              <li><a href="#" className="hover:text-blue-200">Inmuebles</a></li>
              <li><a href="#" className="hover:text-blue-200">Dictámenes (PIPC)</a></li>
              <li><a href="#" className="hover:text-blue-200">Facturación</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 p-4">
        <h2 className="text-3xl font-semibold mb-6">Dashboard Ejecutivo PIPC</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Resumen de Riesgo */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Estado Normativo</h3>
            <p className="text-sm text-gray-500 mb-4">Cumplimiento con Protección Civil ZMG</p>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-yellow-500"></span>
              <span className="font-medium">1 Inmueble con PIPC por vencer</span>
            </div>
          </div>

          {/* Card 2: Extintores */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Bitácora de Equipos</h3>
            <p className="text-sm text-gray-500 mb-4">Control de Extintores y Alarmas</p>
            <div className="flex items-center space-x-2">
              <span className="h-3 w-3 rounded-full bg-green-500"></span>
              <span className="font-medium">Mantenimiento al día</span>
            </div>
            <button className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded text-sm font-medium transition">
              Actualizar Bitácora
            </button>
          </div>

          {/* Card 3: Acciones Rápidas */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Acciones Rápidas</h3>
            <ul className="space-y-3 mt-4">
              <li>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  + Registrar nuevo inmueble
                </button>
              </li>
              <li>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
                  + Solicitar dictamen estructural
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Tabla de Inmuebles */}
        <div className="mt-10 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-800">Inmuebles Administrados</h3>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nivel Riesgo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado PIPC</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Plaza Comercial Andares</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Zapopan, Jal.</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Medio</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Vigente
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Nave Industrial Parque El Salto</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">El Salto, Jal.</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Alto</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Revisión Pendiente
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
