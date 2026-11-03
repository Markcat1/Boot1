import type { Metadata } from "next";
import "./globals.css";
import { PipcProvider } from "@/context/PipcContext";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sistema de Gestión PIPC ZMG",
  description: "Gestión de Programas Internos de Protección Civil - Jalisco",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased bg-gray-50 text-gray-900">
        <PipcProvider>
          <div className="flex h-screen overflow-hidden">
            {/* Sidebar Navigation */}
            <nav className="w-64 bg-slate-800 text-white flex flex-col">
              <div className="p-4 bg-slate-900">
                <h1 className="text-xl font-bold">PIPC Gestión ZMG</h1>
                <p className="text-xs text-slate-400 mt-1">Protección Civil Jalisco</p>
              </div>
              <ul className="flex-1 p-4 space-y-2 overflow-y-auto">
                <li>
                  <Link href="/" className="block py-2 px-4 rounded hover:bg-slate-700 transition">Inicio</Link>
                </li>
                <li>
                  <Link href="/diagnostico" className="block py-2 px-4 rounded hover:bg-slate-700 transition">1. Diagnóstico e Inmueble</Link>
                </li>
                <li>
                  <Link href="/riesgos" className="block py-2 px-4 rounded hover:bg-slate-700 transition">2. Análisis de Riesgos</Link>
                </li>
                <li>
                  <Link href="/recursos" className="block py-2 px-4 rounded hover:bg-slate-700 transition">3. Recursos y Brigadas</Link>
                </li>
                <li>
                  <Link href="/programas" className="block py-2 px-4 rounded hover:bg-slate-700 transition">4. Programas y Simulacros</Link>
                </li>
                <li>
                  <Link href="/exportacion" className="block py-2 px-4 rounded hover:bg-slate-700 transition">5. Exportación Documental</Link>
                </li>
              </ul>
            </nav>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
              {children}
            </main>
          </div>
        </PipcProvider>
      </body>
    </html>
  );
}
