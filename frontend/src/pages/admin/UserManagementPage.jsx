import React from 'react';
import { NavLink, useParams, Navigate } from 'react-router-dom';
import PageHeader from '@/components/ui/PageHeader';
import PatientsManagementPage from './PatientsManagementPage';
import DoctorsManagementPage from './DoctorsManagementPage';
import StaffManagementPage from './StaffManagementPage'; // <-- Import new page

const UserManagementPage = () => {
    const { userType = 'patients' } = useParams(); // Default to 'patients'

    const tabs = [
        { name: 'Patients', path: 'patients' },
        { name: 'Doctors', path: 'doctors' },
        { name: 'Staff', path: 'staff' },
    ];

    const renderContent = () => {
        switch (userType) {
            case 'patients':
                return <PatientsManagementPage />;
            case 'doctors':
                return <DoctorsManagementPage />;
            case 'staff':
                return <StaffManagementPage />; // <-- Render staff page
            default:
                return <Navigate to="/admin/users/patients" replace />;
        }
    };

    return (
        <div>
            <PageHeader
                title="User Management"
                subtitle="Manage all user accounts within the hospital system."
            />
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <NavLink
                            key={tab.name}
                            to={`/admin/users/${tab.path}`}
                            className={({ isActive }) => `whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                                ${isActive
                                ? 'border-blue-500 text-blue-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`
                            }
                        >
                            {tab.name}
                        </NavLink>
                    ))}
                </nav>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
};

export default UserManagementPage;