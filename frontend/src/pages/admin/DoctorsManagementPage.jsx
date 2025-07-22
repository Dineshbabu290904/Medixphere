import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Eye } from 'lucide-react'; // Import Eye icon
import { toast } from 'react-hot-toast';
import { apiService } from '../../services/api';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import AddDoctorModal from './modals/AddDoctorModal';
import ViewUserDetailsModal from './modals/ViewUserDetailsModal'; // <-- Import the new modal

const DoctorsManagementPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // <-- State for view modal
  const [selectedDoctor, setSelectedDoctor] = useState(null);    // <-- State for selected user
  const [searchTerm, setSearchTerm] = useState('');

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
        const response = await apiService.getDetails('doctor');
        setDoctors(response.user || []);
    } catch(e) {
        // error handling is in apiService
        console.error("Failed to fetch doctors:", e);
        toast.error("Failed to fetch doctors. Please try again later."); // Added toast
        setDoctors([]);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleViewDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    setIsViewModalOpen(true);
  };

  const filteredDoctors = doctors.filter(doc =>
    `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaders = ["Employee ID", "Name", "Department", "Email", "Phone", "Actions"];

  return (
    <>
      <PageHeader
        title="Doctor Management"
        subtitle="Add, view, and manage doctor profiles."
        actions={<Button onClick={() => setIsAddModalOpen(true)}><Plus className="w-4 h-4" /> Add Doctor</Button>}
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
        ) : filteredDoctors?.length > 0 ? (
          filteredDoctors.map((doc) => (
            <Table.Row key={doc._id}>
              <Table.Cell className="font-mono text-xs">{doc.employeeId}</Table.Cell>
              <Table.Cell className="font-medium flex items-center gap-2">
                 <img src={`${import.meta.env.VITE_MEDIA_LINK}/${doc.profile}`} alt={doc.firstName} className="w-8 h-8 rounded-full object-cover" />
                {`Dr. ${doc.firstName} ${doc.lastName}`} {/* Added Dr. prefix */}
              </Table.Cell>
              <Table.Cell>{doc.department}</Table.Cell>
              <Table.Cell>{doc.email}</Table.Cell>
              <Table.Cell>{doc.phoneNumber}</Table.Cell>
              <Table.Cell>
                {/* --- FIX: Added onClick handler --- */}
                <Button variant="secondary" size="sm" onClick={() => handleViewDoctor(doc)}>
                    <Eye className="w-4 h-4" /> View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center text-gray-500 py-8">No doctors found.</Table.Cell></Table.Row>
        )}
      </Table>

      <AddDoctorModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onDoctorAdded={fetchDoctors} />

      {/* --- Render the View Modal --- */}
      <ViewUserDetailsModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedDoctor}
        userType="doctor"
      />
    </>
  );
};

export default DoctorsManagementPage;