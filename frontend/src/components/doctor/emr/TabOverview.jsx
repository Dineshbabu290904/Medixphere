import React from 'react';
import moment from 'moment';
import Card from '@/components/ui/Card';
import Alert from '@/components/ui/Alert';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { AlertTriangle, Shield, Activity, FileText, Pill, Calendar, Archive, Stethoscope } from 'lucide-react';

const TabOverview = ({ patient, clinicalData }) => {
    const recentNotes = clinicalData.notes?.slice(0, 3) || [];
    const upcomingAppointments = clinicalData.appointments?.filter(appt => 
        moment(appt.appointmentDate).isAfter(moment()) && ['Scheduled', 'Confirmed'].includes(appt.status)
    ).slice(0, 3) || [];

    // Mock data for demo, should come from patient model
    const allergies = patient.allergies || ['Penicillin', 'Peanuts'];
    const chronicConditions = patient.chronicConditions || ['Hypertension'];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allergies.length > 0 && (
                    <Alert variant="danger"><AlertTriangle className="w-4 h-4" /><div><h4 className="font-medium">Allergies</h4><p className="text-sm">{allergies.join(', ')}</p></div></Alert>
                )}
                {chronicConditions.length > 0 && (
                    <Alert variant="warning"><Shield className="w-4 h-4" /><div><h4 className="font-medium">Chronic Conditions</h4><p className="text-sm">{chronicConditions.join(', ')}</p></div></Alert>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <Card><Card.Body className="text-center"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><FileText className="w-6 h-6 text-blue-600" /></div><h3 className="text-2xl font-bold">{clinicalData.notes?.length || 0}</h3><p className="text-sm text-gray-500">Clinical Notes</p></Card.Body></Card>
                <Card><Card.Body className="text-center"><div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3"><Pill className="w-6 h-6 text-green-600" /></div><h3 className="text-2xl font-bold">{clinicalData.prescriptions?.length || 0}</h3><p className="text-sm text-gray-500">Prescriptions</p></Card.Body></Card>
                <Card><Card.Body className="text-center"><div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3"><Calendar className="w-6 h-6 text-purple-600" /></div><h3 className="text-2xl font-bold">{clinicalData.appointments?.length || 0}</h3><p className="text-sm text-gray-500">Total Visits</p></Card.Body></Card>
                <Card><Card.Body className="text-center"><div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3"><Archive className="w-6 h-6 text-orange-600" /></div><h3 className="text-2xl font-bold">{clinicalData.records?.length || 0}</h3><p className="text-sm text-gray-500">Documents</p></Card.Body></Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card><Card.Header><h3 className="text-lg font-semibold">Recent Notes</h3></Card.Header><Card.Body>{recentNotes.length > 0 ? <div className="space-y-3">{recentNotes.map(note => (<div key={note._id} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"><div className="flex justify-between items-start mb-2"><span className="text-sm font-medium">Dr. {note.doctorId?.firstName}</span><span className="text-xs text-gray-500">{moment(note.createdAt).fromNow()}</span></div><p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{note.assessment}</p></div>))}</div> : <p className="text-center text-gray-500 py-4">No recent notes</p>}</Card.Body></Card>
                <Card><Card.Header><h3 className="text-lg font-semibold">Upcoming Appointments</h3></Card.Header><Card.Body>{upcomingAppointments.length > 0 ? <div className="space-y-3">{upcomingAppointments.map(appt => (<div key={appt._id} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"><div className="flex justify-between items-center"><div><p className="font-medium">{moment(appt.appointmentDate).format('MMM DD, YYYY')}</p><p className="text-sm text-gray-500">{appt.slot} - {appt.status}</p></div><Badge variant={appt.status === 'Confirmed' ? 'success' : 'warning'}>{appt.status}</Badge></div></div>))}</div> : <p className="text-center text-gray-500 py-4">No upcoming appointments</p>}</Card.Body></Card>
            </div>
        </div>
    );
};

export default TabOverview;