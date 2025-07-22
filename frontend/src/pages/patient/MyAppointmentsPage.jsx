import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import { FormProvider, useForm } from 'react-hook-form';

// UI Components
import PageHeader from '@/components/ui/PageHeader';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import StatusBadge from '@/components/ui/StatusBadge';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';

// NEW: Import the EMR Modal
import PastAppointmentEMRModal from './modals/PastAppointmentEMRModal';

// Icons
import { Plus, XCircle, Eye } from 'lucide-react';

const BookAppointmentForm = ({ patientId, onAppointmentBooked, onCancel }) => {
    // This defaultValues object is key to including the patientId automatically
    const methods = useForm({
        defaultValues: {
            patientId: patientId, // Automatically set the logged-in patient's ID
            department: '',
            doctorId: '',
            appointmentDate: '',
            slot: ''
        }
    });
    const { watch, setValue, setFocus } = methods;
    const [departments, setDepartments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const [doctorsLoading, setDoctorsLoading] = useState(false);
    const [slotsLoading, setSlotsLoading] = useState(false);

    const selectedDepartment = watch('department');
    const selectedDoctorId = watch('doctorId');
    const appointmentDate = watch('appointmentDate');

    useEffect(() => {
        apiService.getDepartments().then(res => setDepartments(res.departments.map(d => ({ value: d.name, label: d.name }))));
    }, []);

    useEffect(() => {
        if (selectedDepartment) {
            setValue('doctorId', '');
            setValue('appointmentDate', '');
            setValue('slot', '');
            setDoctors([]);
            setAvailableSlots([]);
            setDoctorsLoading(true);
            apiService.request(`/doctor/details/by-department/${selectedDepartment}`)
                .then(res => {
                    setDoctors(res.doctors.map(d => ({ value: d._id, label: `Dr. ${d.firstName} ${d.lastName}` })));
                    setFocus('doctorId'); // Auto-focus the next field
                })
                .finally(() => setDoctorsLoading(false));
        }
    }, [selectedDepartment, setValue, setFocus]);

    useEffect(() => {
        if (selectedDoctorId && appointmentDate) {
            setValue('slot', '');
            setAvailableSlots([]);
            setSlotsLoading(true);
            apiService.getDoctorAvailability(selectedDoctorId, appointmentDate)
                .then(res => setAvailableSlots(res.availableSlots.map(s => ({ value: s.start, label: `${s.start} - ${s.end}` }))))
                .finally(() => setSlotsLoading(false));
        }
    }, [selectedDoctorId, appointmentDate, setValue]);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            await apiService.request('/appointment/create', { method: 'POST', body: data });
            toast.success('Appointment booked successfully!');
            onAppointmentBooked();
        } catch(e) {
            // Error toast handled globally by apiService
        } finally {
            setLoading(false);
        }
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
                <Select name="department" label="Select Department" options={departments} rules={{ required: "Please select a department" }} placeholder="Choose a department..." />
                <Select name="doctorId" label="Select Doctor" options={doctors} rules={{ required: "Please select a doctor" }} disabled={!selectedDepartment || doctorsLoading} placeholder={doctorsLoading ? "Loading doctors..." : "Choose a doctor..."} />
                <Input name="appointmentDate" label="Select Date" type="date" rules={{ required: "Please select a date" }} disabled={!selectedDoctorId} min={moment().format('YYYY-MM-DD')} />
                <Select name="slot" label="Available Slot" options={availableSlots} rules={{ required: "Please select a time slot" }} disabled={!appointmentDate || slotsLoading || availableSlots.length === 0} placeholder={slotsLoading ? "Fetching slots..." : (availableSlots.length > 0 ? "Choose a slot..." : "No slots available")} />
                <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
                    <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" loading={loading} className="w-full">Book Now</Button>
                </div>
            </form>
        </FormProvider>
    );
};


const MyAppointmentsPage = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    
    // --- NEW: State for the EMR modal ---
    const [isEMRModalOpen, setIsEMRModalOpen] = useState(false);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);

    const fetchAppointments = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiService.request('/patient/appointments');
            setAppointments(data || []);
        } catch (error) { /* Handled globally */ } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

    const handleCancelAppointment = async (appointmentId) => {
        if (window.confirm("Are you sure you want to cancel this appointment?")) {
            const toastId = toast.loading("Cancelling appointment...");
            try {
                await apiService.updateAppointmentStatus(appointmentId, 'Cancelled');
                toast.success("Appointment cancelled.", { id: toastId });
                fetchAppointments();
            } catch (error) { /* handled by apiService */ }
        }
    };

    // --- NEW: Function to handle viewing EMR ---
    const handleViewEMR = (appointmentId) => {
        setSelectedAppointmentId(appointmentId);
        setIsEMRModalOpen(true);
    };

    const { upcoming, past } = useMemo(() => ({
        upcoming: appointments.filter(a => moment(a.appointmentDate).isSameOrAfter(moment(), 'day')).sort((a,b) => new Date(a.appointmentDate) - new Date(b.appointmentDate)),
        past: appointments.filter(a => moment(a.appointmentDate).isBefore(moment(), 'day')),
    }), [appointments]);
    
    const tableHeaders = ["Doctor", "Department", "Date & Slot", "Status", "Actions"];

    return (
        <>
            <PageHeader
                title="My Appointments"
                subtitle="Schedule new appointments and view your history."
                actions={<Button onClick={() => setIsBookingModalOpen(true)}><Plus className="w-4 h-4 mr-2"/>Book New Appointment</Button>}
            />
            <Card>
                <Card.Header><h3 className="text-xl font-bold">Upcoming Appointments</h3></Card.Header>
                <Card.Body padding="none">
                    <Table headers={tableHeaders} loading={loading}>
                        {upcoming.length > 0 ? upcoming.map(appt => (
                            <Table.Row key={appt._id}>
                                <Table.Cell>Dr. {appt.doctorId.firstName} {appt.doctorId.lastName}</Table.Cell>
                                <Table.Cell>{appt.doctorId.department}</Table.Cell>
                                <Table.Cell>{moment(appt.appointmentDate).format('LL')} at {appt.slot}</Table.Cell>
                                <Table.Cell><StatusBadge status={appt.status} /></Table.Cell>
                                <Table.Cell>
                                    {appt.status === 'Scheduled' && (
                                        <Button variant="danger" size="sm" onClick={() => handleCancelAppointment(appt._id)}>
                                            <XCircle className="w-4 h-4 mr-1"/> Cancel
                                        </Button>
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        )) : <Table.Row><Table.Cell colSpan={5} className="text-center py-8">No upcoming appointments.</Table.Cell></Table.Row>}
                    </Table>
                </Card.Body>
            </Card>

            <div className="mt-8">
                <Card>
                    <Card.Header><h3 className="text-xl font-bold">Past Appointments</h3></Card.Header>
                    <Card.Body padding="none">
                        <Table headers={tableHeaders}>
                            {past.length > 0 ? past.map(appt => (
                                <Table.Row key={appt._id}>
                                    <Table.Cell>Dr. {appt.doctorId.firstName} {appt.doctorId.lastName}</Table.Cell>
                                    <Table.Cell>{appt.doctorId.department}</Table.Cell>
                                    <Table.Cell>{moment(appt.appointmentDate).format('LL')} at {appt.slot}</Table.Cell>
                                    <Table.Cell><StatusBadge status={appt.status} /></Table.Cell>
                                    <Table.Cell>
                                        <Button variant="secondary" size="sm" onClick={() => handleViewEMR(appt._id)}>
                                            <Eye className="w-4 h-4 mr-1"/> View Details
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )) : <Table.Row><Table.Cell colSpan={5} className="text-center py-8">No past appointments.</Table.Cell></Table.Row>}
                        </Table>
                    </Card.Body>
                </Card>
            </div>
            
            <Modal isOpen={isBookingModalOpen} onClose={() => setIsBookingModalOpen(false)} title="Book a New Appointment">
                <BookAppointmentForm 
                    patientId={user.id}
                    onAppointmentBooked={() => {
                        fetchAppointments();
                        setIsBookingModalOpen(false);
                    }}
                    onCancel={() => setIsBookingModalOpen(false)}
                />
            </Modal>

            <PastAppointmentEMRModal 
                isOpen={isEMRModalOpen}
                onClose={() => setIsEMRModalOpen(false)}
                appointmentId={selectedAppointmentId}
            />
        </>
    );
};

export default MyAppointmentsPage;