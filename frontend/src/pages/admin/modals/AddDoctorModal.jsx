import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { UserPlus } from 'lucide-react';

const AddDoctorModal = ({ isOpen, onClose, onDoctorAdded }) => {
  const methods = useForm();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      methods.reset(); // Reset form on open
      setFile(null);
      setPreview(null);
      apiService.getDepartments().then(data => {
        setDepartments(data.departments.map(d => ({ value: d.name, label: d.name })));
      }).catch(() => toast.error("Could not load departments."));
    }
  }, [isOpen, methods]);

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
    const toastId = toast.loading('Creating doctor profile...');

    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    formData.append('profile', file);
    formData.append('type', 'profile'); // For multer filename generation logic

    try {
      // Step 1: Add doctor details. The backend will now auto-generate the ID.
      const detailsResponse = await apiService.addDetails('doctor', formData);

      if (detailsResponse.success) {
        toast.loading('Registering credentials...', { id: toastId });

        // Get the auto-generated employeeId from the backend response.
        const newEmployeeId = detailsResponse.user.employeeId;

        // Step 2: Register credentials using the new ID as both loginid and password.
        await apiService.register('doctor', {
          loginid: newEmployeeId,
          password: newEmployeeId, // Default password is the new ID
        });

        toast.success('Doctor added successfully!', { id: toastId });
        onDoctorAdded(); // Callback to refresh doctor list
        handleClose();
      } else {
        toast.error(detailsResponse.message || 'Failed to add doctor.', { id: toastId });
      }
    } catch (error) {
      toast.error(error.message || 'An unexpected error occurred.', { id: toastId });
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Doctor">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="firstName" label="First Name" rules={{ required: 'First name is required' }} />
            <Input name="lastName" label="Last Name" rules={{ required: 'Last name is required' }} />
            <Input name="middleName" label="Middle Name (Optional)" />

            <Select name="department" label="Department" options={departments} rules={{ required: 'Department is required' }} placeholder="Select Department" />
            <Input name="email" label="Email" type="email" rules={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } }} />
            <Input name="phoneNumber" label="Phone Number" type="tel" rules={{ required: 'Phone number is required' }} />
            <Input name="post" label="Designation" placeholder="e.g., Senior Consultant" rules={{ required: 'Designation is required' }} />
            <Input name="experience" label="Experience (Years)" type="number" rules={{ required: 'Experience is required', valueAsNumber: true, min: { value: 0, message: 'Experience cannot be negative' } }} />
            <Select name="gender" label="Gender" options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}]} rules={{ required: 'Gender is required' }} placeholder="Select Gender" />
          </div>
          <div className="flex items-center gap-4 pt-2">
            <label htmlFor="doctor-profile-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                {file ? 'Change Image' : 'Select Image'}
            </label>
            <input id="doctor-profile-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Profile Preview" className="w-12 h-12 rounded-full object-cover" />}
            {!preview && <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <UserPlus className="w-6 h-6"/>
            </div>}
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} loading={loading}>{loading ? 'Saving...' : 'Add Doctor'}</Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddDoctorModal;