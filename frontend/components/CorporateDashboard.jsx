import React, { useState } from 'react';

const CorporateDashboard = () => {
  const [facilities, setFacilities] = useState([
    { id: '1', name: 'Planta Industrial Zapotlanejo', status: 'OK' },
    { id: '2', name: 'Oficinas Corporativas Andares', status: 'PENDING_PIPC' }
  ]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">SafeZMG - Corporate Dashboard</h1>
        <p className="text-sm text-gray-500">Multi-tenant B2B PIPC Management</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Facilities List */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Your Facilities</h2>
          <ul>
            {facilities.map(f => (
              <li key={f.id} className="border-b py-2 flex justify-between items-center">
                <span>{f.name}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${f.status === 'OK' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {f.status}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Action Panel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-2 hover:bg-blue-700">
            Upload New PIPC Log
          </button>
          <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700">
            Request Third-Party Validation
          </button>
        </div>
      </div>
    </div>
  );
};

export default CorporateDashboard;