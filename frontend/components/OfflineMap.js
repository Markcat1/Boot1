'use client'
import React, { useState, useEffect } from 'react';

export default function OfflineMap({ riskZones }) {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Simple check for online status
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="border rounded overflow-hidden relative bg-gray-100 min-h-[300px] flex flex-col">
      {isOffline && (
        <div className="bg-red-500 text-white text-xs font-bold px-4 py-2 absolute top-0 left-0 w-full z-10 text-center">
          Modo Sin Conexión Activado (PWA)
        </div>
      )}

      {/* Mock Map Representation */}
      <div className="flex-1 p-4 mt-8">
        <p className="text-gray-500 text-sm mb-4">
          [Representación de mapa geoespacial interactivo]
        </p>
        <div className="space-y-3">
          {riskZones.map(zone => (
            <div key={zone.id} className="bg-red-100 border border-red-300 p-3 rounded text-red-900">
              <strong className="block text-sm">{zone.name} (Riesgo: {zone.risk_type})</strong>
              <span className="text-xs">{zone.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
