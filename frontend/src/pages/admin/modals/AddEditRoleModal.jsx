import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';

const ALL_PERMISSIONS = {
    'Appointments': ['appointment:create', 'appointment:read_all', 'appointment:read_own', 'appointment:update', 'appointment:cancel'],
    'Patients': ['patient:create', 'patient:read', 'patient:update', 'patient:delete'],
    'Doctors': ['doctor:create', 'doctor:read', 'doctor:update', 'doctor:delete'],
    'Billing': ['billing:create', 'billing:read', 'billing:update', 'billing:delete'],
    'Pharmacy': ['pharmacy:dispense', 'pharmacy:read_stock'],
    'Laboratory': ['lab:request_test', 'lab:enter_results'],
    'Admin': ['admin:manage_roles', 'admin:manage_users', 'admin:view_dashboard'],
};

const AddEditRoleModal = ({ isOpen, onClose, onSuccess, role }) => {
  const methods = useForm();
  const { setValue, reset, handleSubmit } = methods;
  const [selectedPermissions, setSelectedPermissions] = useState(new Set());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
        if (role) {
            setValue('name', role.name);
            setValue('description', role.description);
            setSelectedPermissions(new Set(role.permissions));
        } else {
            reset();
            setSelectedPermissions(new Set());
        }
    }
  }, [role, isOpen, setValue, reset]);

  const handlePermissionChange = (permission) => {
    const newPermissions = new Set(selectedPermissions);
    if (newPermissions.has(permission)) {
      newPermissions.delete(permission);
    } else {
      newPermissions.add(permission);
    }
    setSelectedPermissions(newPermissions);
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const payload = {
        ...data,
        name: data.name.toUpperCase(),
        permissions: Array.from(selectedPermissions),
    };

    const apiCall = role
        ? apiService.request(`/auth/role/update/${role._id}`, { method: 'PUT', body: JSON.stringify(payload) })
        : apiService.request('/auth/role/create', { method: 'POST', body: JSON.stringify(payload) });

    const toastId = toast.loading(role ? 'Updating role...' : 'Creating role...');
    try {
        await apiCall;
        toast.success(`Role ${role ? 'updated' : 'created'} successfully!`, { id: toastId });
        onSuccess();
        onClose();
    } catch (error) {
        toast.error(error.message || `Failed to ${role ? 'update' : 'create'} role.`, { id: toastId });
    } finally {
        setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={role ? `Edit Role: ${role.name}` : 'Add New Role'}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            name="name" 
            label="Role Name (e.g., RECEPTIONIST)" 
            rules={{ required: 'Role name is required' }}
            disabled={!!role}
          />
          <Textarea 
            name="description" 
            label="Description" 
            rules={{ required: 'Description is required' }} 
          />
          
          <div>
              <h4 className="font-semibold mb-2 text-gray-700">Permissions</h4>
              <div className="space-y-3 max-h-60 overflow-y-auto p-3 bg-gray-50 rounded-md border">
                  {Object.entries(ALL_PERMISSIONS).map(([category, permissions]) => (
                      <div key={category}>
                          <h5 className="font-medium text-sm text-gray-800 mb-1 border-b pb-1">{category}</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                              {permissions.map(p => (
                                  <label key={p} className="flex items-center gap-2 text-sm cursor-pointer p-1 rounded hover:bg-gray-200">
                                      <input 
                                          type="checkbox"
                                          checked={selectedPermissions.has(p)}
                                          onChange={() => handlePermissionChange(p)}
                                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                      />
                                      <span className="capitalize">{p.split(':')[1].replace(/_/g, ' ')}</span>
                                  </label>
                              ))}
                          </div>
                      </div>
                  ))}
              </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Role'}</Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddEditRoleModal;