import React from 'react';
import Card from '@/components/ui/Card';
import { Info, MapPin } from 'lucide-react';

const TabPatientInfo = ({ patient }) => {
    return (
        <Card title="Personal Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                        <p className="text-sm text-gray-500">Gender</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{patient.gender}</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                        <p className="text-sm text-gray-500">Address</p>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{patient.address}</p>
                    </div>
                </div>
                {/* Add more detailed info fields here as needed */}
            </div>
        </Card>
    );
};

export default TabPatientInfo;