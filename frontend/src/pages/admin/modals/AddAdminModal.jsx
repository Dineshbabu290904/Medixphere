import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { UserPlus } from 'lucide-react'; // Added icon

const AddAdminModal = ({ isOpen, onClose, onAdminAdded }) => {
  const methods = useForm();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (data) => {
    if (!file) {
      return toast.error("Profile image is required.");
    }
    setLoading(true);
    const toastId = toast.loading('Creating admin profile...');

    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    formData.append('profile', file);
    formData.append('type', 'profile'); // For multer filename generation

    try {
      // Step 1: Add admin details (employeeId is auto-generated in controller or passed manually if needed)
      // NOTE: Current backend `admin/details.controller.js` expects employeeId from req.body.
      // If you want auto-generation, you need to implement `generateAdminId` and logic similar to Doctor/Patient
      // For now, assuming employeeId is manually entered or fixed.
      const detailsResponse = await apiService.addDetails('admin', formData);

      if (detailsResponse.success) {
        toast.loading('Registering credentials...', { id: toastId });
        // Assume loginid for admin credential is the employeeId
        await apiService.register('admin', {
          loginid: data.employeeId, // Use the employeeId provided in the form
          password: data.employeeId, // Default password
        });

        toast.success('Admin added successfully!', { id: toastId });
        onAdminAdded(); // Callback to refresh admin list
        handleClose();
      } else {
        toast.error(detailsResponse.message, { id: toastId });
      }
    } catch (error) {
      toast.error(error.message || 'An error occurred.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    methods.reset();
    setFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Staff (Admin)">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="firstName" label="First Name" rules={{ required: 'First Name is required' }} />
            <Input name="lastName" label="Last Name" rules={{ required: 'Last Name is required' }} />
            <Input name="employeeId" label="Employee ID" rules={{ required: 'Employee ID is required' }} />
            <Input name="email" label="Email" type="email" rules={{ required: 'Email is required' }} />
            <Input name="phoneNumber" label="Phone Number" type="tel" rules={{ required: 'Phone Number is required' }} />
            <Select 
              name="gender" 
              label="Gender" 
              options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}]} 
              rules={{ required: 'Gender is required' }} 
            />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <label htmlFor="admin-profile-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-sm font-medium">
                Upload Image
            </label>
            <input id="admin-profile-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Profile Preview" className="w-12 h-12 rounded-full object-cover" />}
            {!preview && <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <UserPlus className="w-6 h-6"/>
            </div>}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} loading={loading}>{loading ? 'Saving...' : 'Add Staff'}</Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddAdminModal;