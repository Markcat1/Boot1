"use client";

import { useEffect, useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

type Intervention = {
  id: number;
  datetime: string;
  streetAndNumber: string;
  colony: string;
  userName: string;
  gasCompany: string;
  cylinderCapacity: string;
  damageTypes: string[];
  observations?: string;
  finalStatus: string;
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28CF8", "#F87171"];

export default function Dashboard() {
  const [data, setData] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/interventions");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // 1. Gráfica mensual: Total de servicios atendidos por mes
  const monthlyData = useMemo(() => {
    const counts = data.reduce((acc, intervention) => {
      const date = new Date(intervention.datetime);
      const monthYear = date.toLocaleString("es-MX", { month: "short", year: "numeric" });
      acc[monthYear] = (acc[monthYear] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts).map(([month, total]) => ({
      name: month,
      total,
    }));
  }, [data]);

  // 2. Métricas secundarias: Desglose por empresa distribuidora
  const companyData = useMemo(() => {
    const counts = data.reduce((acc, intervention) => {
      acc[intervention.gasCompany] = (acc[intervention.gasCompany] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  // 3. Métricas secundarias: Tipo de daño predominante
  const damageData = useMemo(() => {
    const counts = data.reduce((acc, intervention) => {
      intervention.damageTypes.forEach((damage) => {
        acc[damage] = (acc[damage] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Panel Analítico: Fugas de Gas (GLP)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Gráfica Mensual (Bar Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-md col-span-1 lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Servicios Atendidos por Mes</h2>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Bar dataKey="total" name="Total Servicios" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfica por Empresa (Pie Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Servicios por Empresa Distribuidora</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={companyData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  >
                    {companyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gráfica por Tipo de Daño (Bar Chart Horizontal) */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Tipos de Daño / Causas de Fuga</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={damageData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                  <RechartsTooltip />
                  <Bar dataKey="value" name="Casos Reportados" fill="#10B981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabla Resumen de Datos */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Últimos Registros (Base 2)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Empresa</th>
                  <th className="px-6 py-3 font-medium text-gray-500 uppercase tracking-wider">Estatus Final</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(-5).reverse().map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {new Date(item.datetime).toLocaleString("es-MX")}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {item.streetAndNumber}, {item.colony}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700">{item.gasCompany}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {item.finalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                      No hay registros disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
