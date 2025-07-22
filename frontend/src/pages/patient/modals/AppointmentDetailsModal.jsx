import React from 'react';
import moment from 'moment';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { Calendar, Clock, User, Stethoscope, FileText } from 'lucide-react';

const DetailRow = ({ icon: Icon, label, value }) => (
    <div className="flex items-start py-2">
        <Icon className="w-5 h-5 text-gray-500 mr-4 mt-1 flex-shrink-0" />
        <div className="flex-1">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="text-base font-medium text-gray-800 dark:text-gray-200">{value || 'N/A'}</p>
        </div>
    </div>
);

const AppointmentDetailsModal = ({ isOpen, onClose, appointment }) => {
  if (!appointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Appointment Details" size="lg">
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        Consultation with Dr. {appointment.doctorId.firstName} {appointment.doctorId.lastName}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.doctorId.department}</p>
                </div>
                <StatusBadge status={appointment.status} />
            </div>
        </div>
        
        <DetailRow 
            icon={Calendar} 
            label="Date" 
            value={moment(appointment.appointmentDate).format('dddd, MMMM Do YYYY')} 
        />
        <DetailRow 
            icon={Clock} 
            label="Time Slot" 
            value={appointment.slot} 
        />
        <DetailRow 
            icon={FileText} 
            label="Booking Notes" 
            value={appointment.notes || 'No notes were provided during booking.'}
        />
      </div>

       <div className="flex justify-end pt-6 mt-6 border-t dark:border-slate-700">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default AppointmentDetailsModal;