import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AddDepartmentModal = ({ isOpen, onClose, onDepartmentAdded }) => {
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Adding department...');

    try {
      await apiService.addDepartment(data);
      toast.success('Department added successfully!', { id: toastId });
      onDepartmentAdded(); // This will trigger a refresh on the main page
      handleClose();
    } catch (error) {
      toast.error(error.message || 'Failed to add department.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    methods.reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Department">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <Input
            name="name"
            label="Department Name"
            placeholder="e.g., Cardiology, Neurology"
            rules={{ required: 'Department name is required' }}
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : 'Add Department'}
            </Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddDepartmentModal;