import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User, Users, Bell, Settings, Activity, Calendar, Shield, DollarSign, Pill, Beaker, Radio, Bed, UserCog } from 'lucide-react';

// Core Layout & Pages
import DashboardLayout from '../../layouts/DashboardLayout';
import Overview from './Overview';
import AppointmentsPage from './AppointmentsPage';
import UserManagementPage from './UserManagementPage';
import DepartmentsPage from './DepartmentsPage';
import DepartmentDetailsPage from './DepartmentDetailsPage';
import RolesManagementPage from './RolesManagementPage';
import NoticesPage from './NoticesPage';
import ProfilePage from './ProfilePage';

// Hub Pages (New)
import BillingManagementPage from './BillingManagementPage';
import PharmacyManagementPage from './PharmacyManagementPage';
import LisManagementPage from './LisManagementPage';
import RisManagementPage from './RisManagementPage';
import IpdManagementPage from './IpdManagementPage';
import HrManagementPage from './HrManagementPage';

// Specific Management Pages (Old Sub-menu pages)
import ServicesPage from './ServicesPage';
import InvoicesPage from './InvoicesPage'; // Renamed from BillingPage
import MedicinesPage from './MedicinesPage';
import DispensePage from './DispensePage';
import LabTestsPage from './LabTestsPage';
import LabReportsPage from './LabReportsPage';
import UploadLabReportPage from './UploadLabReportPage';
import RadiologyTestsPage from './RadiologyTestsPage';
import RadiologyReportsPage from './RadiologyReportsPage';
import WardsPage from './WardsPage';
import BedsPage from './BedsPage';
import EmployeesPage from './EmployeesPage';
import DutyRosterPage from './DutyRosterPage';

const AdminDashboard = () => {
  // Navigation items now point to the hub pages
  const adminNavItems = [
    { name: 'Overview', path: '/admin', icon: Activity },
    { name: 'Appointments', path: '/admin/appointments', icon: Calendar },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Departments', path: '/admin/departments', icon: Settings },
    { name: 'Roles & Permissions', path: '/admin/roles', icon: Shield },
    { name: 'Billing', path: '/admin/billing', icon: DollarSign },
    { name: 'Pharmacy', path: '/admin/pharmacy', icon: Pill },
    { name: 'LIS', path: '/admin/lis', icon: Beaker },
    { name: 'RIS', path: '/admin/ris', icon: Radio },
    { name: 'IPD', path: '/admin/ipd', icon: Bed },
    { name: 'HR', path: '/admin/hr', icon: UserCog },
    { name: 'Notices', path: '/admin/notices', icon: Bell },
    { name: 'Profile', path: '/admin/profile', icon: User },
  ];

  return (
    <DashboardLayout sidebarNavItems={adminNavItems}>
      <Routes>
        {/* Core Routes */}
        <Route path="/" element={<Overview />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/users" element={<UserManagementPage />}>
          <Route index element={<Navigate to="patients" replace />} />
          <Route path=":userType" element={<UserManagementPage />} />
        </Route>
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route path="/departments/:departmentName" element={<DepartmentDetailsPage />} />
        <Route path="/roles" element={<RolesManagementPage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        
        {/* Hub Page Routes */}
        <Route path="/billing" element={<BillingManagementPage />} />
        <Route path="/pharmacy" element={<PharmacyManagementPage />} />
        <Route path="/lis" element={<LisManagementPage />} />
        <Route path="/ris" element={<RisManagementPage />} />
        <Route path="/ipd" element={<IpdManagementPage />} />
        <Route path="/hr" element={<HrManagementPage />} />

        {/* Specific Management Routes (linked from Hub Pages) */}
        <Route path="/billing/services" element={<ServicesPage />} />
        <Route path="/billing/invoices" element={<InvoicesPage />} />
        <Route path="/pharmacy/medicines" element={<MedicinesPage />} />
        <Route path="/pharmacy/dispense" element={<DispensePage />} />
        <Route path="/lis/lab-tests" element={<LabTestsPage />} />
        <Route path="/lis/lab-reports" element={<LabReportsPage />} />
        <Route path="/ris/radiology-tests" element={<RadiologyTestsPage />} />
        <Route path="/ris/radiology-reports" element={<RadiologyReportsPage />} />
        <Route path="/ipd/wards" element={<WardsPage />} />
        <Route path="/ipd/beds" element={<BedsPage />} />
        <Route path="/hr/employees" element={<EmployeesPage />} />
        <Route path="/hr/duty-roster" element={<DutyRosterPage />} />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboard;