import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Plus, Eye, X, CheckCircle } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import BookAppointmentModal from './modals/BookAppointmentModal';
import AppointmentDetailsModal from './modals/AppointmentDetailsModal';

const statusTabs = ['Scheduled', 'Completed', 'Cancelled'];

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [activeTab, setActiveTab] = useState('Scheduled');

  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getAppointments({});
      setAppointments(response.appointments || []);
    } catch (error) {
      toast.error("Could not fetch appointments.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id, status) => {
      const toastId = toast.loading(`Marking appointment as ${status}...`);
      try {
          await apiService.updateAppointmentStatus(id, status);
          toast.success("Status updated successfully!", { id: toastId });
          fetchAppointments(); // Refresh the list
      } catch (error) {
          toast.error(error.message, { id: toastId });
      }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsModalOpen(true);
  };

  const filteredAppointments = useMemo(
    () => appointments.filter(appt => appt.status === activeTab),
    [appointments, activeTab]
  );

  const tableHeaders = ["Patient", "Doctor", "Date & Slot", "Actions"];

  return (
    <>
      <PageHeader
        title="Appointment Management"
        subtitle="Schedule and manage all patient appointments."
        actions={<Button onClick={() => setIsBookModalOpen(true)}><Plus className="w-4 h-4" /> Book Appointment</Button>}
      />

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-6">
          {statusTabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}>
              {tab}
            </button>
          ))}
        </nav>
      </div>
      
      <Table headers={tableHeaders} loading={loading}>
        {loading ? (
           <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center p-8"><Spinner/></Table.Cell></Table.Row>
        ) : filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <Table.Row key={appt._id}>
              <Table.Cell>
                <div>
                    <p className="font-medium text-gray-800">{appt.patientId?.firstName} {appt.patientId?.lastName}</p>
                    <p className="text-xs text-gray-500 font-mono">{appt.patientId?.patientId}</p>
                </div>
              </Table.Cell>
              <Table.Cell>
                 <div>
                    <p className="font-medium text-gray-800">Dr. {appt.doctorId?.firstName} {appt.doctorId?.lastName}</p>
                    <p className="text-xs text-gray-500">{appt.doctorId?.department}</p>
                </div>
              </Table.Cell>
              <Table.Cell>
                {new Date(appt.appointmentDate).toLocaleDateString()} at {appt.slot}
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(appt)}><Eye className="w-4 h-4"/> Details</Button>
                    {activeTab === 'Scheduled' && (
                        <>
                            <Button variant="success" size="sm" onClick={() => handleUpdateStatus(appt._id, 'Completed')}><CheckCircle className="w-4 h-4"/> Complete</Button>
                            <Button variant="danger" size="sm" onClick={() => handleUpdateStatus(appt._id, 'Cancelled')}><X className="w-4 h-4"/> Cancel</Button>
                        </>
                    )}
                </div>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center text-gray-500 py-8">No {activeTab.toLowerCase()} appointments found.</Table.Cell></Table.Row>
        )}
      </Table>
      
      <BookAppointmentModal isOpen={isBookModalOpen} onClose={() => setIsBookModalOpen(false)} onAppointmentBooked={fetchAppointments} />
      <AppointmentDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} appointment={selectedAppointment} />
    </>
  );
};

export default AppointmentsPage;