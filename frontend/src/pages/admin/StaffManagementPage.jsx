import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Search, Eye } from 'lucide-react';
import { apiService } from '../../services/api';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import ViewUserDetailsModal from './modals/ViewUserDetailsModal';
import AddAdminModal from './modals/AddAdminModal'; // We will create this next

const StaffManagementPage = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    try {
        // For now, "Staff" means Admins. This can be expanded later.
        const response = await apiService.getDetails('admin');
        setStaff(response.user || []);
    } catch(e) {
        // Error handling is in apiService
        console.error("Failed to fetch staff:", e);
    } finally {
        setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleViewStaff = (staffMember) => {
    setSelectedStaff(staffMember);
    setIsViewModalOpen(true);
  };

  const filteredStaff = staff.filter(s =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaders = ["Employee ID", "Name", "Role", "Email", "Phone", "Actions"];

  return (
    <>
      <PageHeader
        title="Staff Management"
        subtitle="Manage hospital administrators and other staff roles."
        actions={<Button onClick={() => setIsAddModalOpen(true)}><Plus className="w-4 h-4" /> Add Staff</Button>}
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
        ) : filteredStaff.length > 0 ? (
          filteredStaff.map((s) => (
            <Table.Row key={s._id}>
              <Table.Cell className="font-mono text-xs">{s.employeeId}</Table.Cell>
              <Table.Cell className="font-medium flex items-center gap-2">
                 <img src={`${import.meta.env.VITE_MEDIA_LINK}/${s.profile}`} alt={s.firstName} className="w-8 h-8 rounded-full object-cover" />
                {`${s.firstName} ${s.lastName}`}
              </Table.Cell>
              <Table.Cell><span className="font-semibold bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">Admin</span></Table.Cell>
              <Table.Cell>{s.email}</Table.Cell>
              <Table.Cell>{s.phoneNumber}</Table.Cell>
              <Table.Cell>
                <Button variant="secondary" size="sm" onClick={() => handleViewStaff(s)}>
                    <Eye className="w-4 h-4" /> View
                </Button>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center text-gray-500 py-8">No staff found.</Table.Cell></Table.Row>
        )}
      </Table>

      <AddAdminModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdminAdded={fetchStaff} />

      <ViewUserDetailsModal 
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        user={selectedStaff}
        userType="admin" // Pass the correct user type
      />
    </>
  );
};

export default StaffManagementPage;