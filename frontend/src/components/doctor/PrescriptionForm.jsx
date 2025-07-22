import React, { useState } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { Plus, Trash2 } from 'lucide-react';

const PrescriptionForm = ({ patientId, onPrescriptionAdded }) => {
  const methods = useForm({
    defaultValues: {
      medications: [{ name: '', dosage: '', frequency: '', duration: '' }],
      notes: ''
    }
  });

  const { control, handleSubmit } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: 'medications' });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiService.request(`/doctor/patients/${patientId}/prescriptions`, {
        method: 'POST',
        body: data,
      });
      toast.success('Prescription created successfully!');
      onPrescriptionAdded();
    } catch (error) {
      // Global error handler in apiService will show a toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">Medications</h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border dark:border-slate-700">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
                  <div className="lg:col-span-2">
                    <Input name={`medications.${index}.name`} label={index === 0 ? "Medicine Name" : ""} placeholder="e.g., Atorvastatin" rules={{ required: "Name is required" }}/>
                  </div>
                  <div>
                    <Input name={`medications.${index}.dosage`} label={index === 0 ? "Dosage" : ""} placeholder="e.g., 20mg" rules={{ required: "Dosage is required" }}/>
                  </div>
                  <div>
                    <Input name={`medications.${index}.frequency`} label={index === 0 ? "Frequency" : ""} placeholder="e.g., 0-0-1" rules={{ required: "Frequency is required" }}/>
                  </div>
                  <div className="flex items-end h-full">
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)} className="text-rose-500 hover:bg-rose-100 dark:hover:bg-rose-900/50" aria-label="Remove medication">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                 <div className="mt-4">
                    <Input name={`medications.${index}.duration`} label={index === 0 ? "Duration & Instructions" : ""} placeholder="e.g., For 30 days, after food" rules={{ required: "Duration is required" }}/>
                  </div>
              </div>
            ))}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', dosage: '', frequency: '', duration: '' })} className="mt-4 flex items-center gap-2">
            <Plus size={16} /> Add Another Medicine
          </Button>
        </div>
        <div className="border-t dark:border-slate-700 pt-6">
          <Textarea name="notes" label="General Notes" placeholder="e.g., Review after 15 days. Monitor for muscle pain."/>
        </div>
        <div className="flex justify-end pt-4">
          <Button type="submit" loading={loading} size="lg">Save Prescription</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default PrescriptionForm;