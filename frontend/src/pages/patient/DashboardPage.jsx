import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, User, Receipt } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';

// Import Patient Pages
import PatientOverview from './Overview';
import MyAppointmentsPage from './MyAppointmentsPage';
import MyRecordsPage from './MyRecordsPage';
import MyBillingPage from './MyBillingPage';
import ProfilePage from './ProfilePage';

const PatientDashboard = () => {
  const patientNavItems = [
    { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
    { name: 'Appointments', path: '/patient/appointments', icon: Calendar },
    { name: 'My Records', path: '/patient/records', icon: FileText },
    { name: 'Billing', path: '/patient/billing', icon: Receipt },
    { name: 'My Profile', path: '/patient/profile', icon: User },
  ];

  return (
    <DashboardLayout sidebarNavItems={patientNavItems}>
      <Routes>
        <Route path="dashboard" element={<PatientOverview />} />
        <Route path="appointments" element={<MyAppointmentsPage />} />
        <Route path="records" element={<MyRecordsPage />} />
        <Route path="billing" element={<MyBillingPage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="/" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default PatientDashboard;