'use client'
import React, { useState, useEffect } from 'react';
import OfflineMap from './OfflineMap';

export default function Dashboard() {
  const [facilities, setFacilities] = useState([]);
  const [riskZones, setRiskZones] = useState([]);

  useEffect(() => {
    // In a real implementation, we would fetch from our FastAPI backend
    // For this prototype, we'll set some mock data that matches our backend schema

    setFacilities([
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "Planta Industrial Centro",
        address: "Av. Vallarta 123",
        facility_type: "Industrial",
        organization_id: "mock-org-uuid"
      }
    ]);

    setRiskZones([
      {
        id: "223e4567-e89b-12d3-a456-426614174000",
        name: "Zona Inundable El Dean",
        risk_type: "Flood",
        description: "Zona con alto riesgo de inundación temporal."
      }
    ]);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">SafeZMG & Resilience Core</h1>
        <p className="text-gray-600">Dashboard Corporativo Multi-Inquilino (B2B)</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Facilities Section (B2B) */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Mis Inmuebles (PIPC)</h2>
          <ul className="space-y-4">
            {facilities.map(facility => (
              <li key={facility.id} className="border-b pb-4">
                <h3 className="font-medium text-lg">{facility.name}</h3>
                <p className="text-sm text-gray-600">{facility.address}</p>
                <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                  {facility.facility_type}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* Social Module Map (B2C) */}
        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Módulo Comunitario - Zonas de Riesgo</h2>
          <OfflineMap riskZones={riskZones} />
        </section>
      </div>
    </div>
  );
}
