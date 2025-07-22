import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Eye } from 'lucide-react'; // Import Eye icon
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import AddPatientModal from './modals/AddPatientModal';
import ViewUserDetailsModal from './modals/ViewUserDetailsModal'; // <-- Import the new modal

const PatientsManagementPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // <-- State for view modal
  const [selectedPatient, setSelectedPatient] = useState(null);    // <-- State for selected user
  const [searchTerm, setSearchTerm] = useState('');

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getDetails('patient');
      setPatients(response.user || []);
    } catch (error) {
      toast.error("Could not fetch patient data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setIsViewModalOpen(true);
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaders = ["Patient ID", "Name", "Email", "Phone", "Gender", "Actions"];

  return (
    <>
      <PageHeader
        title="Patient Management"
        subtitle="View and manage all registered patients."
        actions={<Button onClick={() => setIsAddModalOpen(true)}><Plus className="w-4 h-4" /> Add Patient</Button>}
      />

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-sm pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
          />
        </div>
      </div>

      <Table headers={tableHeaders} loading={loading}>
        {loading ? (
           <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center p-8"><Spinner/></Table.Cell></Table.Row>
        ) : filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => (
            <Table.Row key={patient._id}>
              <Table.Cell className="font-mono text-xs">{patient.patientId}</Table.Cell>
              <Table.Cell className="font-medium flex items-center gap-2">
                 <img src={`${import.meta.env.VITE_MEDIA_LINK}/${patient.profile}`} alt={patient.firstName} className="w-8 h-8 rounded-full object-cover" />
                {`${patient.firstName} ${patient.lastName}`}
              </Table.Cell>
              <Table.Cell>{patient.email}</Table.Cell>
              <Table.Cell>{patient.phoneNumber}</Table.Cell>
              <Table.Cell>{patient.gender}</Table.Cell>
              <Table.Cell>
                {/* --- FIX: Added onClick handler --- */}
                <Button variant="secondary" size="sm" onClick={() => handleViewPatient(patient)}>
                    <Eye className="w-4 h-4" /> View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center text-gray-500 py-8">No patients found.</Table.Cell></Table.Row>
        )}
      </Table>

      <AddPatientModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onPatientAdded={fetchPatients} />

      {/* --- Render the View Modal --- */}
      <ViewUserDetailsModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedPatient}
        userType="patient"
      />
    </>
  );
};

export default PatientsManagementPage;