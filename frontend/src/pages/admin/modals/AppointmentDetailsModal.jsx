import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { Calendar, Clock, User, Stethoscope, FileText, CheckSquare, XSquare } from 'lucide-react';

const DetailRow = ({ icon: Icon, label, children }) => (
    <div className="flex items-start py-2">
        <Icon className="w-5 h-5 text-gray-500 mr-4 mt-1" />
        <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            <div className="text-base font-medium text-gray-800">{children}</div>
        </div>
    </div>
);

const StatusBadge = ({ status }) => {
    const config = {
        Scheduled: 'bg-blue-100 text-blue-800',
        Completed: 'bg-green-100 text-green-800',
        Cancelled: 'bg-red-100 text-red-800',
        'No Show': 'bg-yellow-100 text-yellow-800',
    };
    return <span className={`px-3 py-1 text-sm font-semibold rounded-full ${config[status]}`}>{status}</span>;
}

const AppointmentDetailsModal = ({ isOpen, onClose, appointment }) => {
  if (!appointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Appointment Details" size="lg">
      <div className="space-y-4">
        <DetailRow icon={Calendar} label="Date">
            {new Date(appointment.appointmentDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </DetailRow>
        <DetailRow icon={Clock} label="Slot">
            {appointment.slot}
        </DetailRow>
        <DetailRow icon={User} label="Patient">
            <div className="flex items-center gap-3">
                <img src={`${import.meta.env.VITE_MEDIA_LINK}/${appointment.patientId.profile}`} alt="" className="w-10 h-10 rounded-full object-cover"/>
                <div>
                    <p>{appointment.patientId.firstName} {appointment.patientId.lastName}</p>
                    <p className="text-sm font-mono text-gray-500">{appointment.patientId.patientId}</p>
                </div>
            </div>
        </DetailRow>
         <DetailRow icon={Stethoscope} label="Doctor">
             <div className="flex items-center gap-3">
                <img src={`${import.meta.env.VITE_MEDIA_LINK}/${appointment.doctorId.profile}`} alt="" className="w-10 h-10 rounded-full object-cover"/>
                <div>
                    <p>Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}</p>
                    <p className="text-sm text-gray-500">{appointment.doctorId.department}</p>
                </div>
            </div>
        </DetailRow>
        <DetailRow icon={FileText} label="Booking Notes">
            <p className="whitespace-pre-wrap">{appointment.notes || 'No notes provided at booking.'}</p>
        </DetailRow>
        <DetailRow icon={appointment.status === 'Completed' ? CheckSquare : XSquare} label="Status">
            <StatusBadge status={appointment.status} />
        </DetailRow>
      </div>

       <div className="flex justify-end pt-6 mt-6 border-t">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default AppointmentDetailsModal;