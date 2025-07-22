import React, { useState, useEffect, useCallback } from 'react';
import { Users, UserPlus as DoctorIcon, Bed, Calendar, Plus, Activity, Bell, BarChart2 } from 'lucide-react';
import StatCard from '@/components/ui/StatCard';
import { apiService } from '@/services/api';
import PageHeader from '@/components/ui/PageHeader';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Modal imports
import AddPatientModal from './modals/AddPatientModal';
import AddDoctorModal from './modals/AddDoctorModal';
import BookAppointmentModal from './modals/BookAppointmentModal';
import AddEditNoticeModal from './modals/AddEditNoticeModal';

const timeSince = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return `${Math.floor(interval)}y ago`;
    interval = seconds / 2592000;
    if (interval > 1) return `${Math.floor(interval)}mo ago`;
    interval = seconds / 86400;
    if (interval > 1) return `${Math.floor(interval)}d ago`;
    interval = seconds / 3600;
    if (interval > 1) return `${Math.floor(interval)}h ago`;
    interval = seconds / 60;
    if (interval > 1) return `${Math.floor(interval)}m ago`;
    return "Just now";
};

const Overview = () => {
    const [stats, setStats] = useState({ patients: 0, doctors: 0, appointments: 0, occupiedBeds: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const [modalState, setModalState] = useState({
        addPatient: false,
        addDoctor: false,
        addAppointment: false,
        addNotice: false,
    });

    const openModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: true }));
    const closeModal = (modalName) => setModalState(prev => ({ ...prev, [modalName]: false }));

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [patientsRes, doctorsRes, appointmentsRes, activityRes, bedsRes] = await Promise.all([
                apiService.getCount('patient'),
                apiService.getCount('doctor'),
                apiService.getAppointmentCount({ status: 'Scheduled' }),
                apiService.getRecentActivities(),
                apiService.request('/ipd/beds'),
            ]);

            const occupiedBeds = (bedsRes || []).filter(bed => bed.isOccupied).length;

            setStats({
                patients: patientsRes.count || 0,
                doctors: doctorsRes.count || 0,
                appointments: appointmentsRes.count || 0,
                occupiedBeds: occupiedBeds,
            });
            setRecentActivity(activityRes.activities || []);
        } catch (error) {
            console.error('Failed to load dashboard data', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const quickActions = [
      { title: "Register Patient", icon: Users, action: () => openModal('addPatient') },
      { title: "Add Doctor", icon: DoctorIcon, action: () => openModal('addDoctor') },
      { title: "Book Appointment", icon: Calendar, action: () => openModal('addAppointment') },
      { title: "Post Notice", icon: Bell, action: () => openModal('addNotice') }
    ];

    return (
        <>
            <PageHeader
                title="Admin Dashboard"
                subtitle="Welcome back! Here's a summary of your hospital's operations."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Patients" value={stats.patients.toLocaleString()} icon={Users} color="blue" loading={loading} change="+5 this week" trend="up"/>
                <StatCard title="Specialist Doctors" value={stats.doctors} icon={DoctorIcon} color="emerald" loading={loading} change="+1 this month" trend="up"/>
                <StatCard title="Upcoming Appointments" value={stats.appointments} icon={Calendar} color="yellow" loading={loading} />
                <StatCard title="Occupied Beds" value={stats.occupiedBeds} icon={Bed} color="rose" loading={loading} change="-2" trend="down"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area: Chart and Quick Actions */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                       <Card.Header>
                           <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                               <BarChart2 className="text-blue-500"/>
                               Hospital Analytics
                           </h3>
                       </Card.Header>
                       <Card.Body>
                           <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-slate-800 rounded-lg">
                               <p className="text-gray-500 dark:text-gray-400">Chart data will be displayed here.</p>
                           </div>
                       </Card.Body>
                    </Card>
                    <Card>
                        <Card.Header><h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Quick Actions</h3></Card.Header>
                        <Card.Body>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {quickActions.map((action) => (
                                    <Button key={action.title} variant="outline" onClick={action.action} className="flex-col h-24 gap-2">
                                        <action.icon className="w-6 h-6 text-blue-600"/>
                                        <span className="text-xs font-semibold text-center">{action.title}</span>
                                    </Button>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Sidebar Area: Recent Activity */}
                <Card>
                    <Card.Header><h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h3></Card.Header>
                    <Card.Body padding="none">
                        <div className="space-y-1 max-h-[450px] overflow-y-auto">
                            {loading ? <div className="flex justify-center p-8"><Spinner/></div> :
                             recentActivity.length > 0 ? recentActivity.map((item) => (
                                <div key={item._id} className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                    <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full mr-4 mt-1">
                                        <Activity className="w-5 h-5 text-gray-500 dark:text-gray-300" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">{item.description}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timeSince(item.timestamp)}</p>
                                    </div>
                                </div>
                            )) : <p className="text-gray-500 text-center py-8">No recent activity.</p>}
                        </div>
                    </Card.Body>
                </Card>
            </div>

            {/* Modals */}
            <AddPatientModal isOpen={modalState.addPatient} onClose={() => closeModal('addPatient')} onPatientAdded={fetchData} />
            <AddDoctorModal isOpen={modalState.addDoctor} onClose={() => closeModal('addDoctor')} onDoctorAdded={fetchData} />
            <BookAppointmentModal isOpen={modalState.addAppointment} onClose={() => closeModal('addAppointment')} onAppointmentBooked={fetchData} />
            <AddEditNoticeModal isOpen={modalState.addNotice} onClose={() => closeModal('addNotice')} onSuccess={fetchData} />
        </>
    );
};

export default Overview;