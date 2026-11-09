import React from 'react';

export default function Dashboard() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-4">PIPC Management Dashboard (B2B)</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric Cards */}
        <div className="bg-white p-4 rounded shadow-md border-t-4 border-blue-500">
          <h2 className="text-gray-500 font-semibold">Active Facilities</h2>
          <p className="text-3xl font-bold">12</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md border-t-4 border-red-500">
          <h2 className="text-gray-500 font-semibold">Expiring Dictums</h2>
          <p className="text-3xl font-bold">2</p>
        </div>
        <div className="bg-white p-4 rounded shadow-md border-t-4 border-green-500">
          <h2 className="text-gray-500 font-semibold">Brigades Trained</h2>
          <p className="text-3xl font-bold">45</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Recent PIPC Documents</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                <th className="py-2 px-4 border-b text-left">Facility</th>
                <th className="py-2 px-4 border-b text-left">Document Type</th>
                <th className="py-2 px-4 border-b text-left">Status</th>
                <th className="py-2 px-4 border-b text-left">Expiration Date</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">Industrial Plant A</td>
                <td className="py-2 px-4 border-b">Dictamen Estructural</td>
                <td className="py-2 px-4 border-b text-green-600 font-semibold">Valid</td>
                <td className="py-2 px-4 border-b">2024-12-01</td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">Office Tower B</td>
                <td className="py-2 px-4 border-b">Programa Interno PC</td>
                <td className="py-2 px-4 border-b text-red-600 font-semibold">Expiring Soon</td>
                <td className="py-2 px-4 border-b">2023-11-15</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
