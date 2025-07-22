import React, { useState, useEffect } from 'react';
import { Shield, Plus, Trash2, Edit } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import AddEditRoleModal from './modals/AddEditRoleModal'; // We will create this modal next

const RolesManagementPage = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const response = await apiService.getRoles();
      setRoles(response.roles || []);
    } catch (error) {
      toast.error("Could not fetch roles.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenModal = (role = null) => {
    setEditingRole(role);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRole(null);
    setIsModalOpen(false);
  };

  const handleDeleteRole = async (roleId, roleName) => {
     if (['ADMIN', 'DOCTOR', 'PATIENT'].includes(roleName)) {
        return toast.error("Cannot delete core system roles.");
    }
    if (window.confirm(`Are you sure you want to delete the "${roleName}" role?`)) {
      const toastId = toast.loading('Deleting role...');
      try {
        await apiService.request(`/admin/roles/delete/${roleId}`, { method: 'DELETE' });
        toast.success('Role deleted successfully.', { id: toastId });
        fetchRoles(); // Refresh the list
      } catch (error) {
        toast.error(error.message || 'Failed to delete role.', { id: toastId });
      }
    }
  };

  const tableHeaders = ["Role Name", "Description", "Permissions", "Actions"];

  return (
    <>
      <PageHeader
        title="Roles & Permissions"
        subtitle="Manage user roles and their access levels across the system."
        actions={<Button onClick={() => handleOpenModal()}><Plus className="w-4 h-4" /> Add New Role</Button>}
      />

      <Table headers={tableHeaders} loading={loading}>
        {loading ? (
           <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center p-8"><Spinner/></Table.Cell></Table.Row>
        ) : roles.length > 0 ? (
          roles.map((role) => (
            <Table.Row key={role._id}>
              <Table.Cell className="font-bold text-gray-700">
                <span className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-500" />
                    {role.name}
                </span>
              </Table.Cell>
              <Table.Cell>{role.description || '-'}</Table.Cell>
              <Table.Cell>
                <span className="text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                    {role.permissions.length} permissions
                </span>
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => handleOpenModal(role)}><Edit className="w-4 h-4"/></Button>
                  <Button variant="danger" onClick={() => handleDeleteRole(role._id, role.name)}><Trash2 className="w-4 h-4"/></Button>
                </div>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center text-gray-500 py-8">No roles found.</Table.Cell></Table.Row>
        )}
      </Table>
      
      <AddEditRoleModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={fetchRoles}
        role={editingRole}
      />
    </>
  );
};

export default RolesManagementPage;