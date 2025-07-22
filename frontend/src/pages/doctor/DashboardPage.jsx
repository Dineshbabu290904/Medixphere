import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, User, HeartPulse, Clock, Bell } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout';
import DoctorOverview from './Overview';
import MyPatientsPage from './MyPatientsPage';
import ProfilePage from './ProfilePage';
import CriticalCareChartPage from './CriticalCareChartPage';
import PatientDetailsPage from './PatientDetailsPage';
import AppointmentsPage from './AppointmentsPage';
import MySchedulePage from './MySchedulePage';
import NoticesPage from './NoticesPage';

const DoctorDashboardPage = () => {
  const doctorNavItems = [
    { name: 'Overview', path: '/doctor', icon: LayoutDashboard },
    { name: 'Appointments', path: '/doctor/appointments', icon: Calendar },
    { name: 'My Schedule', path: '/doctor/schedule', icon: Clock },
    { name: 'My Patients', path: '/doctor/patients', icon: Users },
    { name: 'Critical Care', path: '/doctor/critical-care', icon: HeartPulse },
    { name: 'Notices', path: '/doctor/notices', icon: Bell },
    { name: 'Profile', path: '/doctor/profile', icon: User },
  ];

  return (
    <DashboardLayout sidebarNavItems={doctorNavItems}>
      <Routes>
        <Route path="/" element={<DoctorOverview />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/schedule" element={<MySchedulePage />} />
        <Route path="/patients" element={<MyPatientsPage />} />
        <Route path="/patient-details/:patientLoginId" element={<PatientDetailsPage />} />
        <Route path="/critical-care" element={<CriticalCareChartPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notices" element={<NoticesPage />} />
        <Route path="/*" element={<Navigate to="/doctor" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default DoctorDashboardPage;