import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import Textarea from '../ui/Textarea'; // Use our new Textarea component
import Button from '../ui/Button';

const ClinicalNoteForm = ({ patientId, onNoteAdded }) => {
  const methods = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiService.request(`/doctor/patients/${patientId}/notes`, {
        method: 'POST',
        body: data,
      });
      toast.success('Clinical note added successfully!');
      onNoteAdded();
    } catch (error) {
      // Error toast is handled by apiService
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Textarea 
          name="subjective"
          label="Subjective (Patient's Statements)"
          placeholder="e.g., 'Patient complains of chest pain...'"
        />
        <Textarea 
          name="objective"
          label="Objective (Observations & Vitals)"
          placeholder="e.g., 'BP 140/90, heart rate 95 bpm...'"
        />
        <Textarea 
          name="assessment"
          label="Assessment (Diagnosis)"
          placeholder="e.g., 'Acute Myocardial Infarction...'"
          rules={{ required: "Assessment is required" }}
        />
        <Textarea 
          name="plan"
          label="Plan (Treatment & Follow-up)"
          placeholder="e.g., 'Admit to ICU, start on aspirin...'"
          rules={{ required: "Plan is required" }}
        />
        <div className="flex justify-end pt-4 border-t dark:border-slate-700">
            <Button type="submit" loading={loading}>Save Note</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ClinicalNoteForm;