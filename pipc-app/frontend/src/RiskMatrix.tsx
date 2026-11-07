import React, { useState } from 'react';
import axios from 'axios';

interface RiskMatrixProps {
    inmuebleId: number | null;
}

export const RiskMatrix: React.FC<RiskMatrixProps> = ({ inmuebleId }) => {
    const [tipo, setTipo] = useState('Interno');
    const [categoria, setCategoria] = useState('Contra incendio');
    const [descripcion, setDescripcion] = useState('');
    const [probabilidad, setProbabilidad] = useState(1);
    const [impacto, setImpacto] = useState(1);
    const [riesgos, setRiesgos] = useState<any[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inmuebleId) return alert('Primero debe registrar un inmueble.');

        try {
            const res = await axios.post(`http://localhost:8000/inmuebles/${inmuebleId}/riesgos/`, {
                tipo,
                categoria,
                descripcion,
                probabilidad,
                impacto
            });
            setRiesgos([...riesgos, res.data]);
            setDescripcion('');
            setProbabilidad(1);
            setImpacto(1);
        } catch (err) {
            console.error(err);
            alert('Error al agregar riesgo');
        }
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h2>2. Módulo de Análisis de Riesgos y Vulnerabilidades</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Tipo: </label>
                    <select value={tipo} onChange={e => setTipo(e.target.value)}>
                        <option value="Interno">Interno</option>
                        <option value="Externo">Externo</option>
                    </select>
                </div>
                <div>
                    <label>Categoría: </label>
                    <input type="text" value={categoria} onChange={e => setCategoria(e.target.value)} required />
                </div>
                <div>
                    <label>Descripción: </label>
                    <input type="text" value={descripcion} onChange={e => setDescripcion(e.target.value)} required />
                </div>
                <div>
                    <label>Probabilidad (1-5): </label>
                    <input type="number" min="1" max="5" value={probabilidad} onChange={e => setProbabilidad(Number(e.target.value))} required />
                </div>
                <div>
                    <label>Impacto (1-5): </label>
                    <input type="number" min="1" max="5" value={impacto} onChange={e => setImpacto(Number(e.target.value))} required />
                </div>
                <button type="submit">Agregar Riesgo a la Matriz</button>
            </form>

            {riesgos.length > 0 && (
                <table style={{ marginTop: '1rem', width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid #aaa' }}>Tipo</th>
                            <th style={{ border: '1px solid #aaa' }}>Categoría</th>
                            <th style={{ border: '1px solid #aaa' }}>Probabilidad</th>
                            <th style={{ border: '1px solid #aaa' }}>Impacto</th>
                            <th style={{ border: '1px solid #aaa' }}>Puntaje (Nivel)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {riesgos.map((r, i) => (
                            <tr key={i}>
                                <td style={{ border: '1px solid #aaa' }}>{r.tipo}</td>
                                <td style={{ border: '1px solid #aaa' }}>{r.categoria}</td>
                                <td style={{ border: '1px solid #aaa' }}>{r.probabilidad}</td>
                                <td style={{ border: '1px solid #aaa' }}>{r.impacto}</td>
                                <td style={{ border: '1px solid #aaa', fontWeight: 'bold' }}>{r.puntaje}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};
