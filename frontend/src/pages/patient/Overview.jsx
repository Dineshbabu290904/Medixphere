import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import PageHeader from '@/components/ui/PageHeader';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { Calendar, FileText, Pill, Stethoscope, AlertCircle } from 'lucide-react';

const OverviewCard = ({ title, icon: Icon, children }) => (
    <Card>
        <Card.Header>
            <div className="flex items-center gap-3">
                <Icon className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">{title}</h3>
            </div>
        </Card.Header>
        <Card.Body>{children}</Card.Body>
    </Card>
);

const PatientOverview = () => {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiService.request('/patient/dashboard');
            setSummary(data);
        } catch (error) {
            // Error is handled globally
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

    return (
        <>
            <PageHeader title={`Welcome, ${user?.loginid}!`} subtitle="Here is a summary of your health and activities." />
            
            <div className="mb-6">
                <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700 p-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <AlertCircle className="w-8 h-8 text-blue-600" />
                            <div>
                                <h4 className="font-bold text-lg text-blue-900 dark:text-blue-100">Your next appointment is approaching!</h4>
                                <p className="text-blue-700 dark:text-blue-200">Remember to arrive 15 minutes early.</p>
                            </div>
                        </div>
                        <Link to="/patient/appointments">
                            <Button>View Appointment</Button>
                        </Link>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <OverviewCard title="Upcoming Appointments" icon={Calendar}>
                    {summary?.upcomingAppointments?.length > 0 ? (
                        <ul className="space-y-3">
                            {summary.upcomingAppointments.map(appt => (
                                <li key={appt._id} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                    <p className="font-semibold">Dr. {appt.doctorId.firstName} {appt.doctorId.lastName}</p>
                                    <p className="text-sm text-gray-500">{moment(appt.appointmentDate).format('MMMM Do, YYYY')} at {appt.slot}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500">No upcoming appointments.</p>}
                </OverviewCard>

                <OverviewCard title="Recent Prescriptions" icon={Pill}>
                    {summary?.recentPrescriptions?.length > 0 ? (
                        <ul className="space-y-3">
                            {summary.recentPrescriptions.map(pres => (
                                <li key={pres._id} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                    <p className="font-semibold">{pres.medications[0].name} (+{pres.medications.length - 1} more)</p>
                                    <p className="text-sm text-gray-500">Prescribed by Dr. {pres.doctor.firstName} on {moment(pres.date).format('LL')}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500">No recent prescriptions.</p>}
                </OverviewCard>

                <OverviewCard title="Recent Lab Results" icon={FileText}>
                    {summary?.recentReports?.length > 0 ? (
                        <ul className="space-y-3">
                            {summary.recentReports.map(report => (
                                <li key={report._id} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                    <p className="font-semibold">{report.labTest.name}</p>
                                    <p className="text-sm text-gray-500">Result available since {moment(report.reportDate).format('LL')}</p>
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-gray-500">No recent lab results.</p>}
                </OverviewCard>
            </div>
        </>
    );
};

export default PatientOverview;