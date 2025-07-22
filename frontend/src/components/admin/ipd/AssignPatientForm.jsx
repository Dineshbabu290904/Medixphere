import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { apiService } from '@/services/api';

const AssignPatientForm = ({ bed, onSubmit, onCancel, loading }) => {
  const methods = useForm();
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        // Fetches all patient details to populate the dropdown
        const data = await apiService.request('/patient/details/getAllDetails');
        setPatients(data.users || []);
      } catch (error) {
        // Error toast is global
      }
    };
    fetchPatients();
  }, []);

  return (
    <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Assigning patient to Bed <span className="font-bold">{bed.bedNumber}</span> in Ward <span className="font-bold">{bed.ward.name}</span>.
          </p>
          <Select 
            name="patientId" 
            label="Select Patient" 
            options={patients.map(p => ({ value: p._id, label: `${p.firstName} ${p.lastName} (${p.patientId})` }))}
            rules={{ required: "You must select a patient" }}
          />
          <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
              <Button className='w-full' type="submit" loading={loading}>Assign Patient</Button>
          </div>
        </form>
    </FormProvider>
  );
};

export default AssignPatientForm;