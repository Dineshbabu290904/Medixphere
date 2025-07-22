import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChangePasswordModal = ({ isOpen, onClose, credentialId, role }) => {
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      return toast.error("New passwords do not match.");
    }
    setLoading(true);
    const toastId = toast.loading('Updating password...');

    try {
      // The API service now has a dedicated method for this
      await apiService.changePassword(role, credentialId, {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully!', { id: toastId });
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to update password.', { id: toastId });
    } finally {
      setLoading(false);
      methods.reset();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Change Password" variant="info">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <Input name="currentPassword" label="Current Password" type="password" rules={{ required: 'Current password is required' }} />
          <Input name="newPassword" label="New Password" type="password" rules={{ required: 'New password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } }} />
          <Input name="confirmPassword" label="Confirm New Password" type="password" rules={{ required: 'Please confirm your new password' }} />
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} loading={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default ChangePasswordModal;