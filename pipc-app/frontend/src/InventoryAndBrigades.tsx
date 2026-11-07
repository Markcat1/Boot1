import React, { useState } from 'react';
import axios from 'axios';

interface InventoryProps {
    inmuebleId: number | null;
}

export const InventoryAndBrigades: React.FC<InventoryProps> = ({ inmuebleId }) => {
    // Equipos
    const [tipoEquipo, setTipoEquipo] = useState('Extintor');
    const [especificacion, setEspecificacion] = useState('Tipo A, B, C');
    const [ubicacion, setUbicacion] = useState('');
    const [cantidad, setCantidad] = useState(1);

    // Brigadistas
    const [nombre, setNombre] = useState('');
    const [brigada, setBrigada] = useState('Primeros Auxilios');
    const [capacitado, setCapacitado] = useState(true);

    const [equipos, setEquipos] = useState<any[]>([]);
    const [brigadistas, setBrigadistas] = useState<any[]>([]);

    const handleAddEquipo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inmuebleId) return alert('Inmueble no registrado.');
        const res = await axios.post(`http://localhost:8000/inmuebles/${inmuebleId}/inventario/equipos`, {
            tipo: tipoEquipo, especificacion, ubicacion, cantidad
        });
        setEquipos([...equipos, res.data]);
    };

    const handleAddBrigadista = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inmuebleId) return alert('Inmueble no registrado.');
        const res = await axios.post(`http://localhost:8000/inmuebles/${inmuebleId}/inventario/brigadas`, {
            nombre, brigada, capacitado
        });
        setBrigadistas([...brigadistas, res.data]);
    };

    return (
        <div style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
            <h2>3. Módulo de Inventario de Equipos y Brigadas</h2>

            <div style={{ display: 'flex', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <h3>Registrar Equipo</h3>
                    <form onSubmit={handleAddEquipo}>
                        <div><label>Tipo: </label><input value={tipoEquipo} onChange={e=>setTipoEquipo(e.target.value)} /></div>
                        <div><label>Especificación (NOM): </label><input value={especificacion} onChange={e=>setEspecificacion(e.target.value)} /></div>
                        <div><label>Ubicación: </label><input value={ubicacion} onChange={e=>setUbicacion(e.target.value)} /></div>
                        <div><label>Cantidad: </label><input type="number" value={cantidad} onChange={e=>setCantidad(Number(e.target.value))} /></div>
                        <button type="submit">Agregar Equipo</button>
                    </form>
                    <ul>
                        {equipos.map((eq, i) => <li key={i}>{eq.cantidad}x {eq.tipo} ({eq.especificacion}) - {eq.ubicacion}</li>)}
                    </ul>
                </div>

                <div style={{ flex: 1 }}>
                    <h3>Registrar Brigadista</h3>
                    <form onSubmit={handleAddBrigadista}>
                        <div><label>Nombre: </label><input value={nombre} onChange={e=>setNombre(e.target.value)} /></div>
                        <div>
                            <label>Brigada: </label>
                            <select value={brigada} onChange={e=>setBrigada(e.target.value)}>
                                <option>Primeros Auxilios</option>
                                <option>Evacuación</option>
                                <option>Prevención y Combate de Incendios</option>
                                <option>Búsqueda y Rescate</option>
                            </select>
                        </div>
                        <div>
                            <label>Capacitado: </label>
                            <input type="checkbox" checked={capacitado} onChange={e=>setCapacitado(e.target.checked)} />
                        </div>
                        <button type="submit">Agregar Brigadista</button>
                    </form>
                    <ul>
                        {brigadistas.map((b, i) => <li key={i}>{b.nombre} - {b.brigada} (Capacitado: {b.capacitado?'Sí':'No'})</li>)}
                    </ul>
                </div>
            </div>
        </div>
    );
};
