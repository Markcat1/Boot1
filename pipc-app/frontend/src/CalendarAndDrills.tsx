import React, { useState } from 'react';
import axios from 'axios';

export const CalendarAndDrills: React.FC<{ inmuebleId: number | null }> = ({ inmuebleId }) => {
    const [tipo, setTipo] = useState('Simulacro');
    const [descripcion, setDescripcion] = useState('');
    const [fecha, setFecha] = useState('');
    const [eventos, setEventos] = useState<any[]>([]);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inmuebleId) return alert('Inmueble no registrado');
        const res = await axios.post(`http://localhost:8000/inmuebles/${inmuebleId}/calendario/`, {
            tipo_evento: tipo,
            descripcion,
            fecha_programada: fecha,
            estado: 'Pendiente'
        });
        setEventos([...eventos, res.data]);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h2>4. Módulo de Calendarios y Simulacros</h2>
            <form onSubmit={handleAdd}>
                <select value={tipo} onChange={e=>setTipo(e.target.value)}>
                    <option>Simulacro</option>
                    <option>Mantenimiento</option>
                </select>
                <input type="text" placeholder="Descripción" value={descripcion} onChange={e=>setDescripcion(e.target.value)} required />
                <input type="date" value={fecha} onChange={e=>setFecha(e.target.value)} required />
                <button type="submit">Programar</button>
            </form>
            <ul>
                {eventos.map((ev, i) => (
                    <li key={i}>{ev.fecha_programada} - <strong>{ev.tipo_evento}</strong>: {ev.descripcion} ({ev.estado})</li>
                ))}
            </ul>
        </div>
    );
};
