import React from 'react';
import Card from '@/components/ui/Card';
import VitalsChart from '@/components/doctor/VitalsChart';

const TabLiveVitals = ({ patient }) => {
    return (
        <Card>
            <Card.Header>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Real-time Vitals (Simulation)</h3>
            </Card.Header>
            <Card.Body>
                <VitalsChart patient={patient} />
            </Card.Body>
        </Card>
    );
};

export default TabLiveVitals;