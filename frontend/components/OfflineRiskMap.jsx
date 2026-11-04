import React, { useEffect, useState } from 'react';

const OfflineRiskMap = () => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Simple check for online status
    const handleStatusChange = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);

    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  return (
    <div className="relative w-full h-screen bg-gray-200">
      {/* Map placeholder (would use react-leaflet in full implementation) */}
      <div className="absolute inset-0 flex items-center justify-center text-gray-500">
        <p className="text-xl">Interactive Map Placeholder (Leaflet)</p>
      </div>

      {/* Offline Indicator */}
      {isOffline && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg z-50 flex items-center space-x-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          <span className="font-semibold">Offline Mode - Serving cached risk zones & shelters</span>
        </div>
      )}

      {/* Control Panel */}
      <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-96 bg-white rounded-xl shadow-2xl overflow-hidden z-40">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ZMG Risk Map</h2>
          <p className="text-sm text-gray-600 mb-4">View flood zones, fault lines, and emergency shelters.</p>

          <div className="space-y-3">
            <button className="w-full flex items-center justify-between bg-blue-50 p-3 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="font-medium text-blue-800">Flood Zones (Inundaciones)</span>
              <span className="w-4 h-4 rounded-full bg-blue-500"></span>
            </button>
            <button className="w-full flex items-center justify-between bg-orange-50 p-3 rounded-lg hover:bg-orange-100 transition-colors">
              <span className="font-medium text-orange-800">Fault Lines (Fallas Geológicas)</span>
              <span className="w-4 h-4 rounded-full bg-orange-500"></span>
            </button>
            <button className="w-full flex items-center justify-between bg-green-50 p-3 rounded-lg hover:bg-green-100 transition-colors">
              <span className="font-medium text-green-800">Shelters (Refugios)</span>
              <span className="w-4 h-4 rounded-full bg-green-500"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineRiskMap;