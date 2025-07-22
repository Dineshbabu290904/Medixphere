import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

const LabReportForm = ({ labReport, onSubmit, onCancel, loading }) => {
  const methods = useForm({
    defaultValues: labReport ? {
      patient: labReport.patient?._id,
      labTest: labReport.labTest?._id,
      results: labReport.results,
      notes: labReport.notes
    } : {}
  });

  const [patients, setPatients] = useState([]);
  const [labTests, setLabTests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [patientsData, testsData] = await Promise.all([
                apiService.request('/patient/details/getAllDetails'),
                apiService.getLabTests()
            ]);
            setPatients(patientsData.users?.map(p => ({ value: p._id, label: `${p.firstName} ${p.lastName} (${p.patientId})` })) || []);
            setLabTests(testsData?.map(t => ({ value: t._id, label: t.name })) || []);
        } catch(error) {
            toast.error("Could not load patients and tests.");
        }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (labReport) {
      methods.reset({
        patient: labReport.patient?._id,
        labTest: labReport.labTest?._id,
        results: labReport.results,
        notes: labReport.notes,
      });
    }
  }, [labReport, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Select name="patient" label="Patient" options={patients} rules={{ required: "Patient is required" }} placeholder="Select a patient..." />
        <Select name="labTest" label="Lab Test" options={labTests} rules={{ required: "Lab test is required" }} placeholder="Select a test..." />
        <Textarea name="results" label="Results" rules={{ required: "Results are required" }} placeholder="Enter the lab test results here." rows={5} />
        <Textarea name="notes" label="Notes (Optional)" placeholder="Any additional notes or comments." rows={3} />
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit" loading={loading}>{labReport ? 'Update' : 'Create'} Report</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default LabReportForm;