import React, { useState } from 'react';
import { GeneralDataForm } from './GeneralDataForm';
import { RiskMatrix } from './RiskMatrix';
import { InventoryAndBrigades } from './InventoryAndBrigades';
import { CalendarAndDrills } from './CalendarAndDrills';
import { ExportView } from './ExportView';

const App: React.FC = () => {
    // In a real app, this might come from context or a router.
    // For this prototype, we simulate a single selected "Inmueble" flow.
    const [inmuebleId] = useState<number | null>(1); // Default to 1 to ease testing if we assume standard creation order

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <header style={{ padding: '1rem', background: '#004A8F', color: 'white' }}>
                <h1>Sistema GIR - PIPC (ZMG)</h1>
                <p>Gestión Integral de Riesgos - Programas Internos de Protección Civil</p>
            </header>

            <main>
                <GeneralDataForm />

                <hr style={{ margin: '2rem 0' }} />

                <RiskMatrix inmuebleId={inmuebleId} />
                <InventoryAndBrigades inmuebleId={inmuebleId} />
                <CalendarAndDrills inmuebleId={inmuebleId} />
                <ExportView inmuebleId={inmuebleId} />
            </main>
        </div>
    );
};

export default App;
