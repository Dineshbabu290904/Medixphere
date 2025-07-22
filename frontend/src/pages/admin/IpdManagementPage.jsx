// src/pages/admin/IpdManagementPage.jsx
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import ActionCard from '@/components/ui/ActionCard';
import { Bed, UserPlus } from 'lucide-react';

const IpdManagementPage = () => (
    <>
        <PageHeader
            title="IPD Management"
            subtitle="Manage inpatient admissions, discharges, and bed allocation."
            breadcrumbs={['Admin', 'IPD']}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
                to="/admin/ipd/wards"
                icon={UserPlus}
                title="Manage Admissions"
                description="Handle patient admissions, discharges, and transfers."
                color="blue"
            />
            <ActionCard
                to="/admin/ipd/beds"
                icon={Bed}
                title="Bed Management"
                description="Allocate and track bed occupancy across all wards."
                color="amber"
            />
        </div>
    </>
);

export default IpdManagementPage;
