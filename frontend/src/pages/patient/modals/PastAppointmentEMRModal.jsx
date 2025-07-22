import React , { useState, useEffect } from 'react';
import moment from 'moment';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import { Stethoscope, FileText, Pill, AlertCircle } from 'lucide-react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';


const EMRSection = ({ title, icon: Icon, children, hasData }) => (
    <div>
        <h4 className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
            <Icon className="w-5 h-5 text-blue-600" />
            {title}
        </h4>
        <Card className="bg-gray-50 dark:bg-slate-800/50 p-4">
            {hasData ? children : (
                <p className="text-sm text-gray-500 text-center py-4">No {title.toLowerCase()} recorded for this consultation.</p>
            )}
        </Card>
    </div>
);

const PastAppointmentEMRModal = ({ isOpen, onClose, appointmentId }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && appointmentId) {
            const fetchDetails = async () => {
                setLoading(true);
                try {
                    const data = await apiService.request(`/patient/appointments/${appointmentId}`);
                    setDetails(data);
                } catch (error) {
                    toast.error("Could not load appointment details.");
                    onClose();
                } finally {
                    setLoading(false);
                }
            };
            fetchDetails();
        }
    }, [isOpen, appointmentId]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Consultation Summary" size="2xl">
            {loading && <div className="flex justify-center p-16"><Spinner size="lg" /></div>}
            
            {!loading && details && (
                <div className="space-y-6">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-blue-700 dark:text-blue-300">Consultation on {moment(details.appointment.appointmentDate).format('LL')}</p>
                                <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                                    Dr. {details.appointment.doctorId.firstName} {details.appointment.doctorId.lastName}
                                </h3>
                            </div>
                            <StatusBadge status={details.appointment.status} />
                        </div>
                    </div>
                    
                    <EMRSection title="Clinical Note" icon={FileText} hasData={details.clinicalNote}>
                        <div className="space-y-2 text-sm">
                            <p><strong>Problem:</strong> {details.clinicalNote?.subjective || 'N/A'}</p>
                            <p><strong>Assessment:</strong> {details.clinicalNote?.assessment || 'N/A'}</p>
                            <p><strong>Objective:</strong> {details.clinicalNote?.objective || 'N/A'}</p>
                            <p><strong>Treatment Plan:</strong> {details.clinicalNote?.plan || 'N/A'}</p>
                        </div>
                    </EMRSection>

                    <EMRSection title="Prescription" icon={Pill} hasData={details.prescription}>
                        <ul className="space-y-2">
                            {details.prescription?.medications.map((med, index) => (
                                <li key={index} className="p-2 bg-white dark:bg-slate-700 rounded-md">
                                    <p className="font-semibold">{med.name}</p>
                                    <p className="text-xs text-gray-500">{med.dosage} | {med.frequency} | {med.duration}</p>
                                </li>
                            ))}
                        </ul>
                        {details.prescription?.notes && (
                            <div className="mt-3 pt-3 border-t dark:border-slate-600">
                                <p className="text-sm"><strong>Notes:</strong> {details.prescription.notes}</p>
                            </div>
                        )}
                    </EMRSection>
                </div>
            )}
             <div className="flex justify-end pt-6 mt-6 border-t dark:border-slate-700">
                <Button variant="secondary" onClick={onClose}>Close</Button>
            </div>
        </Modal>
    );
};

export default PastAppointmentEMRModal;