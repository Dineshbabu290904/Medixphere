import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { User, Image as ImageIcon } from 'lucide-react';

const EditDoctorProfileModal = ({ isOpen, onClose, doctorProfile, onProfileUpdate }) => {
  const methods = useForm();
  const { setValue, reset, handleSubmit } = methods;
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]); // For department dropdown

  useEffect(() => {
    if (isOpen) {
        // Fetch departments
        apiService.getDepartments().then(data => {
            setDepartments(data.departments.map(d => ({ value: d.name, label: d.name })));
        }).catch(() => toast.error("Could not load departments."));

        // Pre-fill the form when the modal opens or the profile data changes
        if (doctorProfile) {
            reset({
                firstName: doctorProfile.firstName,
                middleName: doctorProfile.middleName || '',
                lastName: doctorProfile.lastName,
                email: doctorProfile.email,
                phoneNumber: doctorProfile.phoneNumber,
                department: doctorProfile.department,
                gender: doctorProfile.gender,
                experience: doctorProfile.experience,
                post: doctorProfile.post,
            });
            setPreview(`${import.meta.env.VITE_MEDIA_LINK}/${doctorProfile.profile}`);
            setFile(null); // Reset file input state
        }
    }
  }, [doctorProfile, reset, isOpen]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const toastId = toast.loading('Updating profile...');

    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    if (file) { // Only append file if a new one is selected
      formData.append('profile', file);
    }
    formData.append('type', 'profile'); // For multer filename generation

    try {
      await apiService.updateDetails('doctor', doctorProfile._id, formData);
      toast.success('Profile updated successfully!', { id: toastId });
      onProfileUpdate(); // Callback to refresh data on the main page
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to update profile.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Doctor Profile">
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <div className="flex flex-col items-center gap-4 mb-4">
            <img src={preview || '/Default.png'} alt="Profile Preview" className="w-24 h-24 rounded-full object-cover ring-4 ring-blue-100" />
            <label htmlFor="edit-profile-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                <ImageIcon className="w-4 h-4"/> Change Image
            </label>
            <input id="edit-profile-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="firstName" label="First Name" rules={{ required: 'First name is required' }} />
            <Input name="middleName" label="Middle Name (Optional)" />
            <Input name="lastName" label="Last Name" rules={{ required: 'Last name is required' }} />
            <Input name="email" label="Email" type="email" rules={{ required: 'Email is required' }} />
            <Input name="phoneNumber" label="Phone Number" type="tel" rules={{ required: 'Phone is required' }} />
            <Select name="department" label="Department" options={departments} rules={{ required: 'Department is required' }} placeholder="Select Department" />
            <Input name="experience" label="Experience (Years)" type="number" rules={{ required: 'Experience is required', valueAsNumber: true, min: { value: 0, message: 'Experience cannot be negative' } }} />
            <Input name="post" label="Designation" rules={{ required: 'Designation is required' }} />
            <Select name="gender" label="Gender" options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}]} rules={{ required: 'Gender is required' }} />
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} loading={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default EditDoctorProfileModal;