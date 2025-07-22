import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { Users, Calendar, Clock, Search, User as UserIcon } from 'lucide-react';

import PageHeader from '@/components/ui/PageHeader';
import StatCard from '@/components/ui/StatCard';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

// Helper to format time since an event
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

const DoctorOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({ appointmentsToday: 0, totalPatients: 0, pendingReports: 0 });
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDashboardData = useCallback(async () => {
        if (!user?.id) { setLoading(false); return; }
        setLoading(true);
        try {
            const [apptRes, activityRes] = await Promise.all([
                apiService.getAppointments({ doctorId: user.id }),
                apiService.getRecentActivities(5)
            ]);

            const allAppointments = apptRes.appointments || [];
            const today = moment().startOf('day');
            
            const todaysScheduled = allAppointments.filter(a => 
                moment(a.appointmentDate).isSame(today, 'day') && a.status === 'Scheduled'
            ).sort((a, b) => a.slot.localeCompare(b.slot));

            const uniquePatientIds = new Set(allAppointments.map(a => a.patientId?._id).filter(Boolean));

            setStats({
                appointmentsToday: todaysScheduled.length,
                totalPatients: uniquePatientIds.size,
                pendingReports: 5, // Placeholder
            });
            setUpcomingAppointments(todaysScheduled);
            setRecentActivity(activityRes.activities || []);

        } catch (error) {
            console.error("Failed to load doctor dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

    const quickActions = [
        { title: "My Patients", icon: Users, path: "/doctor/patients" },
        { title: "Full Schedule", icon: Calendar, path: "/doctor/schedule" },
        { title: "Find Patient", icon: Search, path: "/doctor/critical-care" },
        { title: "My Profile", icon: UserIcon, path: "/doctor/profile" },
    ];

    return (
        <>
            <PageHeader title="Doctor's Overview" subtitle="Welcome back! Here’s a summary of your activities."/>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard title="Today's Appointments" value={stats.appointmentsToday} icon={Calendar} color="blue" loading={loading} change="+2 from yesterday" trend="up" />
                <StatCard title="Total Assigned Patients" value={stats.totalPatients} icon={Users} color="emerald" loading={loading} />
                <StatCard title="Pending Lab Reports" value={stats.pendingReports} icon={Clock} color="yellow" loading={loading} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content Area */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <Card.Header>
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Upcoming Appointments Today</h3>
                        </Card.Header>
                        <Card.Body padding="none">
                            {loading ? <div className="p-8 text-center"><Spinner/></div> :
                             upcomingAppointments.length > 0 ? (
                                <div className="divide-y divide-gray-200 dark:divide-slate-700">
                                    {upcomingAppointments.map(appt => (
                                        <div key={appt._id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                            <div className="flex items-center gap-4">
                                                <img src={`${import.meta.env.VITE_MEDIA_LINK}/${appt.patientId.profile}`} alt="" className="w-10 h-10 rounded-full object-cover"/>
                                                <div>
                                                    <p className="font-semibold text-gray-900 dark:text-gray-100">{appt.patientId.firstName} {appt.patientId.lastName}</p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">ID: {appt.patientId.patientId}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-mono font-bold text-blue-600 dark:text-blue-400">{appt.slot}</p>
                                                <Link to={`/doctor/patient-details/${appt.patientId.patientId}`} className="text-xs text-gray-500 hover:underline">View EMR</Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="p-8 text-center text-gray-500">No more appointments scheduled for today.</p>
                            )}
                        </Card.Body>
                        <Card.Footer>
                            <Link to="/doctor/appointments">
                                <Button variant="secondary" className="w-full">View All Appointments</Button>
                            </Link>
                        </Card.Footer>
                    </Card>

                    <Card>
                        <Card.Header><h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Quick Actions</h3></Card.Header>
                        <Card.Body>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {quickActions.map(action => (
                                    <Link to={action.path} key={action.title}>
                                        <Button variant="outline" className="w-full h-24 flex-col gap-2">
                                            <action.icon className="w-6 h-6 text-blue-600"/>
                                            <span className="text-xs font-semibold">{action.title}</span>
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        </Card.Body>
                    </Card>
                </div>

                {/* Sidebar Area */}
                <Card>
                    <Card.Header><h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recent Activity</h3></Card.Header>
                    <Card.Body padding="none">
                        <div className="space-y-1 max-h-[450px] overflow-y-auto">
                            {loading ? <div className="flex justify-center p-8"><Spinner/></div> :
                             recentActivity.length > 0 ? recentActivity.map((item) => (
                                <div key={item._id} className="flex items-start p-4 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                                    <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded-full mr-4 mt-1">
                                        <Users className="w-5 h-5 text-gray-500 dark:text-gray-300" />
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
        </>
    );
};

export default DoctorOverview;