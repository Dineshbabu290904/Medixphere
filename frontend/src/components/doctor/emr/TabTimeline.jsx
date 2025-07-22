import React, { useMemo } from 'react';
import moment from 'moment';
import { Calendar, FileText, Pill } from 'lucide-react';
import Card from '@/components/ui/Card';

const getTimelineIcon = (type) => {
    switch (type) {
        case 'appointment': return <Calendar className="w-5 h-5 text-white" />;
        case 'note': return <FileText className="w-5 h-5 text-white" />;
        case 'prescription': return <Pill className="w-5 h-5 text-white" />;
        default: return <div className="w-5 h-5 bg-gray-400 rounded-full" />;
    }
};

const getTimelineColor = (type) => {
    switch (type) {
        case 'appointment': return 'bg-blue-500';
        case 'note': return 'bg-indigo-500';
        case 'prescription': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
};

const TabTimeline = ({ clinicalData }) => {
    const timelineEvents = useMemo(() => {
        const events = [];
        clinicalData.appointments?.forEach(appt => events.push({ id: `appt-${appt._id}`, type: 'appointment', date: appt.appointmentDate, title: `${appt.status} Appointment`, subtitle: `Slot: ${appt.slot}` }));
        clinicalData.notes?.forEach(note => events.push({ id: `note-${note._id}`, type: 'note', date: note.createdAt, title: 'Clinical Note Added', subtitle: `By Dr. ${note.doctorId?.firstName}`, description: note.assessment }));
        clinicalData.prescriptions?.forEach(pres => events.push({ id: `pres-${pres._id}`, type: 'prescription', date: pres.date, title: 'Prescription Created', subtitle: `${pres.medications.length} medication(s)` }));
        
        return events.sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [clinicalData]);

    return (
        <Card>
            <Card.Header>
                <h3 className="text-xl font-semibold">Patient Timeline</h3>
            </Card.Header>
            <Card.Body className="max-h-[70vh] overflow-y-auto">
                <div className="relative pl-6 border-l-2 border-gray-200 dark:border-slate-700">
                    {timelineEvents.length > 0 ? timelineEvents.map(event => (
                        <div key={event.id} className="mb-8">
                            <div className={`absolute -left-4 top-1 w-7 h-7 rounded-full flex items-center justify-center ${getTimelineColor(event.type)}`}>
                                {getTimelineIcon(event.type)}
                            </div>
                            <p className="text-sm text-gray-500">{moment(event.date).format('MMM DD, YYYY - hh:mm A')}</p>
                            <h4 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{event.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{event.subtitle}</p>
                            {event.description && <p className="mt-1 text-sm text-gray-500 italic">"{event.description}"</p>}
                        </div>
                    )) : (
                        <p className="text-center text-gray-500 py-8">No events found in patient timeline.</p>
                    )}
                </div>
            </Card.Body>
        </Card>
    );
};

export default TabTimeline;