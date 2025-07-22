import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { apiService } from '../../../services/api';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Textarea from '../../../components/ui/Textarea';
import { UserPlus } from 'lucide-react';

const AddPatientModal = ({ isOpen, onClose, onPatientAdded }) => {
  const methods = useForm();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- NEW: Add a state to show the relationship field if needed ---
  const [showRelationship, setShowRelationship] = useState(false);

  const handlePhoneBlur = async (e) => {
    const phoneNumber = e.target.value;
    if (phoneNumber && phoneNumber.length >= 10) { // Basic validation
        try {
            // Check if any user exists with this phone number
            const response = await apiService.getDetails('patient', { phoneNumber: parseInt(phoneNumber) });
            if (response.success && response.user.length > 0) {
                toast.success(`Phone number belongs to an existing family. Please specify relationship.`);
                setShowRelationship(true);
            } else {
                setShowRelationship(false);
            }
        } catch (error) {
           setShowRelationship(false);
        }
    } else {
        setShowRelationship(false);
    }
  };


  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const onSubmit = async (data) => {
    if (!file) return toast.error("Profile image is required.");
    setLoading(true);
    const toastId = toast.loading('Creating patient profile...');

    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    formData.append('profile', file);
    formData.append('type', 'profile'); // For multer filename generation

    try {
      // Step 1: Add patient details. The backend will now auto-generate the ID and handle family logic.
      const detailsResponse = await apiService.addDetails("patient", formData);
      if (detailsResponse.success) {
        toast.loading('Registering credentials...', { id: toastId });
        // Step 2: Register credentials using the new patientId as loginid and default password
        await apiService.register('patient', {
          loginid: detailsResponse.user.patientId, // Use the auto-generated patientId
          password: detailsResponse.user.patientId, // Default password
        });

        toast.success('Patient added successfully!', { id: toastId });
        onPatientAdded(); // Callback to refresh patient list
        handleClose();
      } else {
        toast.error(detailsResponse.message || 'Failed to add patient.', { id: toastId });
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
    setShowRelationship(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add New Patient">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input name="firstName" label="First Name" rules={{ required: 'First Name is required' }} />
            <Input name="lastName" label="Last Name" rules={{ required: 'Last Name is required' }} />
            <Input name="email" label="Email (Optional)" type="email" rules={{ pattern: { value: /^\S+@\S+$/i, message: "Invalid email address" } }} />

            {/* Phone number now has an onBlur check */}
            <div className="md:col-span-2">
                <Input name="phoneNumber" label="Phone Number" type="tel" rules={{ required: 'Phone Number is required', minLength: { value: 10, message: 'Phone number must be at least 10 digits' } }} onBlur={handlePhoneBlur} />
            </div>

            {/* --- NEW: Conditionally render the relationship field --- */}
            {showRelationship && (
                <div className="md:col-span-2">
                    <Input name="relationship" label="Relationship to Primary Contact" placeholder="e.g., Spouse, Son, Daughter" rules={{ required: "Relationship is required for existing families." }}/>
                </div>
            )}

            <Input name="dateOfBirth" label="Date of Birth" type="date" rules={{ required: 'Date of Birth is required' }} />
            <Input name="bloodGroup" label="Blood Group" rules={{ required: 'Blood Group is required' }} />
            <Select name="gender" label="Gender" options={[{value: 'Male', label: 'Male'}, {value: 'Female', label: 'Female'}, {value: 'Other', label: 'Other'}]} rules={{ required: 'Gender is required' }} />
            <div className="md:col-span-2">
              <Textarea name="address" label="Address" rules={{ required: 'Address is required' }} />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label htmlFor="patient-profile-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2">
                Upload Image
            </label>
            <input id="patient-profile-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            {preview && <img src={preview} alt="Profile Preview" className="w-12 h-12 rounded-full object-cover" />}
            {!preview && <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
                <UserPlus className="w-6 h-6"/>
            </div>}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>Cancel</Button>
            <Button type="submit" disabled={loading} loading={loading}>{loading ? 'Saving...' : 'Add Patient'}</Button>
          </div>
        </form>
      </FormProvider>
    </Modal>
  );
};

export default AddPatientModal;