// src/pages/admin/HrManagementPage.jsx
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import ActionCard from '@/components/ui/ActionCard';
import { Users, UserPlus } from 'lucide-react';

const HrManagementPage = () => (
    <>
        <PageHeader
            title="HR Management"
            subtitle="Manage hospital staff, departments, and payroll."
            breadcrumbs={['Admin', 'HR']}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
                to="/admin/hr/employees"
                icon={Users}
                title="Manage Employees"
                description="Add, update, or remove hospital employees and their details."
                color="violet"
            />
            <ActionCard
                to="/admin/hr/duty-roster"
                icon={UserPlus}
                title="Duty Roster Management"
                description="Manage employee shifts, leaves, and attendance."
                color="amber"
            />
        </div>
    </>
);

export default HrManagementPage;
