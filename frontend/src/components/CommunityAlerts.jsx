import React from 'react';

export default function CommunityAlerts() {
  return (
    <div className="p-4 md:p-8 max-w-2xl mx-auto bg-gray-50 min-h-screen">
      <header className="mb-6 flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-red-600">SafeZMG Community Alerts</h1>
        <div className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
          Live
        </div>
      </header>

      <div className="space-y-4">
        {/* Alert Card 1 */}
        <div className="bg-white border-l-4 border-red-500 rounded shadow p-4 flex gap-4">
          <div className="flex-shrink-0 text-red-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Heavy Rainfall Warning</h3>
            <p className="text-gray-600 text-sm mt-1">
              High risk of flooding in lower basin areas. Avoid underpasses and report any blocked drains.
            </p>
            <p className="text-xs text-gray-400 mt-2">Issued 10 mins ago • ZMG Central</p>
          </div>
        </div>

        {/* Alert Card 2 */}
        <div className="bg-white border-l-4 border-yellow-500 rounded shadow p-4 flex gap-4">
          <div className="flex-shrink-0 text-yellow-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <h3 className="font-bold text-lg">Air Quality Alert</h3>
            <p className="text-gray-600 text-sm mt-1">
              Poor air quality due to nearby urban fire. Sensitive groups should stay indoors.
            </p>
            <p className="text-xs text-gray-400 mt-2">Issued 2 hours ago • Tlaquepaque Sector</p>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button className="bg-red-600 text-white font-bold py-3 px-6 rounded-full shadow-lg w-full md:w-auto hover:bg-red-700 transition">
          Report an Incident
        </button>
      </div>
    </div>
  );
}
