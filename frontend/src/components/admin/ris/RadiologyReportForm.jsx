import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

const RadiologyReportForm = ({ radiologyReport, onSubmit, loading }) => {
  const methods = useForm(
    {
      defaultValues: radiologyReport ? {
        patient: radiologyReport.patient._id,
        radiologyTest: radiologyReport.radiologyTest._id,
        results: radiologyReport.results,
        notes: radiologyReport.notes
      } : {}
    }
  );
  const [patients, setPatients] = useState([]);
  const [radiologyTests, setRadiologyTests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, testsData] = await Promise.all([
          apiService.request('/patient/details/getAllDetails'),
          apiService.request('/ris/radiology-tests')
        ]);
        setPatients(patientsData.users || []);
        setRadiologyTests(testsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPatients([]);
        setRadiologyTests([]);
        // Optionally handle error with a toast or alert
        toast.error('Failed to load data. Please try again later.');
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (radiologyReport) {
      methods.reset({
        patient: radiologyReport.patient._id,
        radiologyTest: radiologyReport.radiologyTest._id,
        results: radiologyReport.results,
        notes: radiologyReport.notes
      });
    }
  }, [radiologyReport, methods]);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Select name="patient" label="Patient" options={patients.map(p => ({ value: p._id, label: `${p.firstName} ${p.lastName}` }))} rules={{ required: true }} />
        <Select name="radiologyTest" label="Radiology Test" options={radiologyTests.map(t => ({ value: t._id, label: t.name }))} rules={{ required: true }} />
        <Input name="results" label="Results" rules={{ required: true }} />
        <Input name="notes" label="Notes" />
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
            <Button className='w-full' type="submit" loading={loading}>{radiologyReport ? 'Update' : 'Create'} Report</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default RadiologyReportForm;