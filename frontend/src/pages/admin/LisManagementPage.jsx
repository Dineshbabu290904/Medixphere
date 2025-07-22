// src/pages/admin/LisManagementPage.jsx
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import ActionCard from '@/components/ui/ActionCard';
import { Beaker, FileText, UploadCloud } from 'lucide-react';

const LisManagementPage = () => (
    <>
        <PageHeader
            title="LIS Management"
            subtitle="Manage lab tests, reports, and uploads."
            breadcrumbs={['Admin', 'LIS']}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
                to="/admin/lis/lab-tests"
                icon={Beaker}
                title="Manage Lab Tests"
                description="View, add, or edit available laboratory tests."
                color="amber"
            />
            <ActionCard
                to="/admin/lis/lab-reports"
                icon={FileText}
                title="Manage Lab Reports"
                description="Access and review submitted lab reports."
                color="blue"
            />
        </div>
    </>
);

export default LisManagementPage;
