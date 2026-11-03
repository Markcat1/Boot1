import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-slate-900 mb-6">
        Sistema de Gestión PIPC
      </h1>
      <p className="text-lg text-slate-600 mb-8">
        Herramienta técnica para la estructuración y gestión de Programas Internos de Protección Civil alineados a la normatividad de la Zona Metropolitana de Guadalajara y la Ley Estatal de Jalisco.
      </p>
      <Link
        href="/diagnostico"
        className="bg-slate-800 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-slate-700 transition font-semibold text-lg"
      >
        Comenzar Diagnóstico
      </Link>
    </div>
  );
}
