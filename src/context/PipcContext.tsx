"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export interface DiagnosticoData {
  razonSocial: string;
  giroComercial: string;
  superficieConstruida: number;
  poblacionFija: number;
  poblacionFlotante: number;
  municipio: string;
  nivelRiesgo: "Bajo" | "Medio" | "Alto" | "";
}

export interface Riesgo {
  id: string;
  tipo: "Interno" | "Externo";
  descripcion: string;
  probabilidad: number; // 1-5
  impacto: number; // 1-5
  nivel: "Bajo" | "Medio" | "Alto" | "";
}

export interface Equipamiento {
  id: string;
  tipo: string;
  cantidad: number;
  ubicacion: string;
}

export interface Brigadista {
  id: string;
  nombre: string;
  brigada: "Evacuación" | "Primeros Auxilios" | "Búsqueda y Rescate" | "Prevención y Combate de Incendios";
}

export interface Simulacro {
  id: string;
  fecha: string;
  tipo: string;
  observaciones: string;
}

export interface Mantenimiento {
  id: string;
  equipo: string;
  fecha: string;
  proximoMantenimiento: string;
}

interface PipcState {
  diagnostico: DiagnosticoData;
  riesgos: Riesgo[];
  equipamiento: Equipamiento[];
  brigadistas: Brigadista[];
  simulacros: Simulacro[];
  mantenimientos: Mantenimiento[];
}

interface PipcContextType {
  state: PipcState;
  updateDiagnostico: (data: Partial<DiagnosticoData>) => void;
  addRiesgo: (riesgo: Riesgo) => void;
  removeRiesgo: (id: string) => void;
  addEquipamiento: (equipo: Equipamiento) => void;
  removeEquipamiento: (id: string) => void;
  addBrigadista: (brigadista: Brigadista) => void;
  removeBrigadista: (id: string) => void;
  addSimulacro: (simulacro: Simulacro) => void;
  removeSimulacro: (id: string) => void;
  addMantenimiento: (mante: Mantenimiento) => void;
  removeMantenimiento: (id: string) => void;
}

const initialState: PipcState = {
  diagnostico: {
    razonSocial: "",
    giroComercial: "",
    superficieConstruida: 0,
    poblacionFija: 0,
    poblacionFlotante: 0,
    municipio: "",
    nivelRiesgo: "",
  },
  riesgos: [],
  equipamiento: [],
  brigadistas: [],
  simulacros: [],
  mantenimientos: [],
};

const PipcContext = createContext<PipcContextType | undefined>(undefined);

export const PipcProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PipcState>(initialState);

  const updateDiagnostico = (data: Partial<DiagnosticoData>) => {
    setState((prev) => ({
      ...prev,
      diagnostico: { ...prev.diagnostico, ...data },
    }));
  };

  const addRiesgo = (riesgo: Riesgo) => setState((prev) => ({ ...prev, riesgos: [...prev.riesgos, riesgo] }));
  const removeRiesgo = (id: string) => setState((prev) => ({ ...prev, riesgos: prev.riesgos.filter((r) => r.id !== id) }));

  const addEquipamiento = (equipo: Equipamiento) => setState((prev) => ({ ...prev, equipamiento: [...prev.equipamiento, equipo] }));
  const removeEquipamiento = (id: string) => setState((prev) => ({ ...prev, equipamiento: prev.equipamiento.filter((e) => e.id !== id) }));

  const addBrigadista = (brigadista: Brigadista) => setState((prev) => ({ ...prev, brigadistas: [...prev.brigadistas, brigadista] }));
  const removeBrigadista = (id: string) => setState((prev) => ({ ...prev, brigadistas: prev.brigadistas.filter((b) => b.id !== id) }));

  const addSimulacro = (simulacro: Simulacro) => setState((prev) => ({ ...prev, simulacros: [...prev.simulacros, simulacro] }));
  const removeSimulacro = (id: string) => setState((prev) => ({ ...prev, simulacros: prev.simulacros.filter((s) => s.id !== id) }));

  const addMantenimiento = (mante: Mantenimiento) => setState((prev) => ({ ...prev, mantenimientos: [...prev.mantenimientos, mante] }));
  const removeMantenimiento = (id: string) => setState((prev) => ({ ...prev, mantenimientos: prev.mantenimientos.filter((m) => m.id !== id) }));


  return (
    <PipcContext.Provider
      value={{
        state,
        updateDiagnostico,
        addRiesgo,
        removeRiesgo,
        addEquipamiento,
        removeEquipamiento,
        addBrigadista,
        removeBrigadista,
        addSimulacro,
        removeSimulacro,
        addMantenimiento,
        removeMantenimiento
      }}
    >
      {children}
    </PipcContext.Provider>
  );
};

export const usePipc = () => {
  const context = useContext(PipcContext);
  if (!context) {
    throw new Error("usePipc must be used within a PipcProvider");
  }
  return context;
};
