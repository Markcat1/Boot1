import React, { useState } from 'react';
import axios from 'axios';

export const ExportView: React.FC<{ inmuebleId: number | null }> = ({ inmuebleId }) => {
    const [memoria, setMemoria] = useState<any>(null);

    const handleGenerate = async () => {
        if (!inmuebleId) return alert('Inmueble no registrado');
        try {
            const res = await axios.get(`http://localhost:8000/inmuebles/${inmuebleId}/export/`);
            setMemoria(res.data);
        } catch (err) {
            alert('Error generando memoria');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h2>5. Módulo de Exportación y Memoria Descriptiva</h2>
            <button onClick={handleGenerate}>Generar Memoria Descriptiva</button>

            {memoria && (
                <div style={{ marginTop: '1rem', padding: '1rem', background: '#fafafa', border: '1px solid #ddd' }}>
                    <h3>{memoria.titulo}</h3>

                    <h4>Datos Generales</h4>
                    <p>Ubicación: {memoria.datos_generales.municipio}</p>
                    <p>Riesgo: {memoria.datos_generales.nivel_riesgo_pipc}</p>

                    <h4>Riesgos (Total: {memoria.analisis_riesgos.length})</h4>

                    <h4>Equipamiento (Total: {memoria.inventario_equipos.length})</h4>

                    <h4>Brigadistas (Total: {memoria.brigadas_emergencia.length})</h4>

                    <h4>Eventos Programados (Total: {memoria.calendario_actividades.length})</h4>

                    <button style={{ marginTop: '1rem' }} onClick={() => alert('Generación de PDF en progreso...')}>
                        Exportar a PDF
                    </button>
                </div>
            )}
        </div>
    );
};
