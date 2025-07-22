import React, { useState, useEffect, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Textarea from '../../../components/ui/Textarea';
import { User, Calendar, Clock, Stethoscope, Briefcase, Search, AlertCircle } from 'lucide-react';

const AppointmentTypeOptions = [
  { value: 'in_person', label: 'In-person Consultation' },
  { value: 'online', label: 'Online Consultation' },
  { value: 'follow_up', label: 'Follow-up' },
  { value: 'new_patient', label: 'New Patient Visit' },
];

const BookAppointmentModal = ({ isOpen, onClose, onAppointmentBooked }) => {
  const methods = useForm();
  const { watch, setValue, handleSubmit, reset } = methods;
  const [allPatients, setAllPatients] = useState([]); // All patients for search
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [selectedPatientObject, setSelectedPatientObject] = useState(null); // To store full patient object

  const selectedDoctorId = watch('doctorId');
  const appointmentDate = watch('appointmentDate');

  // Fetch all patients and doctors on modal open
  useEffect(() => {
    if (isOpen) {
      reset(); // Reset form when modal opens
      setPatientSearchTerm('');
      setFilteredPatients([]);
      setSelectedPatientObject(null);
      setAvailableSlots([]);

      const fetchData = async () => {
        try {
          const [patRes, docRes] = await Promise.all([
            apiService.getDetails('patient'),
            apiService.getDetails('doctor'),
          ]);
          setAllPatients(patRes.user || []); // Store all patients for search
          setDoctors(docRes.user.map(d => ({ value: d._id, label: `Dr. ${d.firstName} ${d.lastName} (${d.department})` })));
        } catch (error) {
          toast.error("Failed to load patients or doctors for booking.");
        }
      };
      fetchData();
    }
  }, [isOpen, reset]);

  // Handle patient search input
  const handlePatientSearchChange = (e) => {
    const term = e.target.value;
    setPatientSearchTerm(term);
    if (term.length > 1) {
      setFilteredPatients(
        allPatients.filter(p =>
          p.patientId.toLowerCase().includes(term.toLowerCase()) ||
          `${p.firstName} ${p.lastName}`.toLowerCase().includes(term.toLowerCase()) ||
          p.phoneNumber.toString().includes(term)
        )
      );
    } else {
      setFilteredPatients([]);
    }
    setSelectedPatientObject(null); // Clear selected patient if search changes
    setValue('patientId', ''); // Clear form patientId
  };

  // Select patient from search results
  const selectPatientFromSearch = (patient) => {
    setPatientSearchTerm(`${patient.firstName} ${patient.lastName} (${patient.patientId})`);
    setValue('patientId', patient._id); // Set the MongoDB ID to the form field
    setSelectedPatientObject(patient);
    setFilteredPatients([]); // Clear suggestions
  };

  // Fetch available slots when doctor or date changes
  useEffect(() => {
    if (selectedDoctorId && appointmentDate) {
      // Clear current slot selection to avoid invalid values
      setValue('slot', ''); 
      setAvailableSlots([]); // Clear previous slots
      
      const fetchSlots = async () => {
        try {
          const response = await apiService.getDoctorAvailability(selectedDoctorId, appointmentDate);
          if (response.success) {
            setAvailableSlots(response.availableSlots.map(slot => ({
              value: slot.start, // Assuming slot.start is the unique identifier for the time slot
              label: `${slot.start} - ${slot.end}`
            })));
          } else {
            setAvailableSlots([]);
            toast.error(response.message || "Could not fetch available slots.");
          }
        } catch (error) {
          setAvailableSlots([]);
          toast.error("Failed to fetch available slots.");
        }
      };
      fetchSlots();
    } else {
      setAvailableSlots([]); // Clear slots if doctor or date is not selected
    }
  }, [selectedDoctorId, appointmentDate, setValue]); // Add setValue to dependency array

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
          ...data,
          appointmentDate: data.appointmentDate, // Already in YYYY-MM-DD format
          status: 'Scheduled' // Default status
      };

      await apiService.request('/appointment/create', {
          method: 'POST',
          body: JSON.stringify(payload)
      });
      
      toast.success('Appointment booked successfully!');
      onAppointmentBooked(); // Callback to refresh appointments on parent page
      onClose(); // Close the modal
    } catch (error) {
      toast.error(error.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    reset();
    setPatientSearchTerm('');
    setFilteredPatients([]);
    setSelectedPatientObject(null);
    setAvailableSlots([]);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleModalClose} title="Book New Appointment" size="lg">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Patient Search Input */}
          <div>
            <label htmlFor="patient-search" className="block text-sm font-medium text-gray-700 mb-1">
              Search Patient
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="patient-search"
                type="text"
                value={patientSearchTerm}
                onChange={handlePatientSearchChange}
                placeholder="Search by ID, Name or Phone"
                className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!!selectedPatientObject} // Disable if a patient is selected
              />
              {selectedPatientObject && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-green-600">Selected</span>
              )}
              {filteredPatients.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-48 overflow-y-auto shadow-lg">
                  {filteredPatients.map(patient => (
                    <li
                      key={patient._id}
                      onClick={() => selectPatientFromSearch(patient)}
                      className="px-4 py-2 cursor-pointer hover:bg-gray-100 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-gray-500"/>
                      {patient.firstName} {patient.lastName} ({patient.patientId}) - {patient.phoneNumber}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Hidden input to hold the actual patientId for validation */}
            <input type="hidden" {...methods.register('patientId', { required: 'Patient is required' })} />
            {methods.formState.errors.patientId && (
              <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" /> {methods.formState.errors.patientId.message}
              </p>
            )}
          </div>

          <Select 
            name="doctorId" 
            label="Doctor" 
            options={doctors} 
            rules={{ required: 'Doctor is required' }} 
            placeholder="Select a doctor"
            // icon prop is hypothetical for the custom Select component
          />
          <Input 
            name="appointmentDate" 
            label="Appointment Date" 
            type="date" 
            rules={{ required: 'Date is required' }} 
            // icon prop is hypothetical
          />
          <Select 
            name="slot" 
            label="Available Time Slot" 
            options={availableSlots} 
            rules={{ required: 'Time slot is required' }} 
            placeholder={selectedDoctorId && appointmentDate ? (availableSlots.length > 0 ? "Select a time slot" : "No slots available for this date/doctor") : "Select doctor and date first"}
            disabled={!selectedDoctorId || !appointmentDate || availableSlots.length === 0}
            // icon prop is hypothetical
          />
          <Select 
            name="appointmentType" 
            label="Appointment Type" 
            options={AppointmentTypeOptions} 
            rules={{ required: 'Appointment type is required' }} 
            placeholder="Select appointment type"
            // icon prop is hypothetical
          />
          <Textarea name="notes" label="Additional Notes (Optional)" />
          
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={handleModalClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} loading={loading}>{loading ? 'Booking...' : 'Book Appointment'}</Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default BookAppointmentModal;