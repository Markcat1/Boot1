import React, { useState } from 'react';
import axios from 'axios';

const ZMG_MUNICIPIOS = ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Tlajomulco", "El Salto", "Ixtlahuacán de los Membrillos", "Juanacatlán", "Zapotlanejo"];

export const GeneralDataForm: React.FC = () => {
    const [nombre, setNombre] = useState('');
    const [municipio, setMunicipio] = useState(ZMG_MUNICIPIOS[0]);
    const [giro, setGiro] = useState('');
    const [poblacionFija, setPoblacionFija] = useState(0);
    const [poblacionFlotante, setPoblacionFlotante] = useState(0);
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:8000/inmuebles/', {
                nombre,
                municipio,
                giro_comercial: giro,
                poblacion_fixa: poblacionFija,
                poblacion_flotante: poblacionFlotante
            });
            setResult(res.data);
            setError('');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Error creating Inmueble');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h2>1. Módulo de Catálogos y Datos Generales del Inmueble</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Nombre del Inmueble: </label>
                    <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} required />
                </div>
                <div>
                    <label>Municipio (ZMG): </label>
                    <select value={municipio} onChange={e => setMunicipio(e.target.value)}>
                        {ZMG_MUNICIPIOS.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div>
                    <label>Giro Comercial: </label>
                    <input type="text" value={giro} onChange={e => setGiro(e.target.value)} required />
                </div>
                <div>
                    <label>Población Fija: </label>
                    <input type="number" value={poblacionFija} onChange={e => setPoblacionFija(Number(e.target.value))} required />
                </div>
                <div>
                    <label>Población Flotante: </label>
                    <input type="number" value={poblacionFlotante} onChange={e => setPoblacionFlotante(Number(e.target.value))} required />
                </div>
                <button type="submit">Guardar Datos Generales</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {result && (
                <div style={{ marginTop: '1rem', background: '#eef', padding: '0.5rem' }}>
                    <p><strong>Inmueble ID:</strong> {result.id}</p>
                    <p><strong>Riesgo Calculado:</strong> {result.riesgo_calculado}</p>
                    <p><em>Determina la obligatoriedad del PIPC según la afluencia total.</em></p>
                </div>
            )}
        </div>
    );
};
