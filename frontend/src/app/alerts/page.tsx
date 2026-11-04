import React from 'react';

export default function B2CCommunityAlerts() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
      {/* Header optimizado para móviles */}
      <header className="bg-red-700 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">SafeZMG Alerta</h1>
          <button className="bg-red-800 hover:bg-red-900 p-2 rounded-full transition" aria-label="Menu">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 flex flex-col space-y-4">

        {/* Banner de Alerta Activa (Ejemplo) */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 rounded shadow-sm">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-md font-bold text-yellow-800">Aviso de Lluvia Intensa (ZMG)</h3>
              <p className="text-sm text-yellow-700 mt-1">
                Pronóstico de lluvias fuertes en las próximas 2 horas. Evite cruzar pasos a desnivel (ej. Arcos del Milenio).
              </p>
            </div>
          </div>
        </div>

        {/* Mapa Placeholder (Bajo consumo de datos) */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden flex-grow flex flex-col border border-gray-200 min-h-[300px]">
           <div className="bg-gray-200 flex-grow flex items-center justify-center">
              <div className="text-center p-4">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                <p className="text-gray-500 font-medium">Mapa de Riesgo ZMG</p>
                <p className="text-xs text-gray-400 mt-1">Toca para cargar capa de inundaciones</p>
              </div>
           </div>
        </div>

        {/* Botón de Reporte Rápido */}
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-lg shadow-lg text-lg flex items-center justify-center space-x-2 transition active:scale-95">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span>Reportar Incidencia (S.O.S)</span>
        </button>

      </main>
    </div>
  );
}
