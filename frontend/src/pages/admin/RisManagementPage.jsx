// src/pages/admin/RisManagementPage.jsx
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import ActionCard from '@/components/ui/ActionCard';
import { Activity, FileText } from 'lucide-react';

const RisManagementPage = () => (
    <>
        <PageHeader
            title="RIS Management"
            subtitle="Manage radiology procedures and reports."
            breadcrumbs={['Admin', 'RIS']}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
                to="/admin/ris/radiology-tests"
                icon={Activity}
                title="Manage Procedures"
                description="Add, update, or remove radiology procedures."
                color="blue"
            />
            <ActionCard
                to="/admin/ris/radiology-reports"
                icon={FileText}
                title="Radiology Reports"
                description="View and manage all radiology reports."
                color="emerald"
            />
        </div>
    </>
);

export default RisManagementPage;