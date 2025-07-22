import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import Select from '../../../components/ui/Select';

const AddEditNoticeModal = ({ isOpen, onClose, onSuccess, notice }) => {
  const methods = useForm();
  const { setValue, reset, handleSubmit } = methods;
  const isEditing = !!notice;

  useEffect(() => {
    if (isOpen) {
      if (isEditing) {
        setValue('title', notice.title);
        setValue('description', notice.description);
        setValue('link', notice.link || '');
        setValue('type', notice.type || 'general');
      } else {
        reset({ title: '', description: '', link: '', type: 'general' });
      }
    }
  }, [isOpen, isEditing, notice, setValue, reset]);

  const onSubmit = async (data) => {
    const apiCall = isEditing
      ? apiService.updateNotice(notice._id, data)
      : apiService.addNotice(data);
    
    const toastId = toast.loading(isEditing ? 'Updating notice...' : 'Adding notice...');
    try {
      await apiCall;
      toast.success(`Notice ${isEditing ? 'updated' : 'added'} successfully!`, { id: toastId });
      onSuccess(); // Refresh the list
      onClose();   // Close the modal
    } catch (error) {
       toast.error(error.message || `Failed to ${isEditing ? 'update' : 'add'} notice.`, { id: toastId });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Notice' : 'Add New Notice'}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input name="title" label="Title" rules={{ required: 'Title is required' }} />
          <Textarea name="description" label="Description" rules={{ required: 'Description is required' }} />
          <Input name="link" label="Link (Optional)" type="url" />
          <Select 
            name="type" 
            label="Audience Type"
            options={[
                { value: 'general', label: 'General' },
                { value: 'patient', label: 'Patient' },
                { value: 'doctor', label: 'Doctor' },
                { value: 'emergency', label: 'Emergency' },
            ]}
          />
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit">{isEditing ? 'Update Notice' : 'Add Notice'}</Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddEditNoticeModal;