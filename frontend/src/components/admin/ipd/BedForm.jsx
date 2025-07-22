import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { apiService } from '@/services/api';

const BedForm = ({ bed, onSubmit, onCancel, loading }) => {
  const methods = useForm({
      defaultValues: bed ? { ...bed, ward: bed.ward?._id } : {}
  });
  const [wards, setWards] = useState([]);

  useEffect(() => {
    const fetchWards = async () => {
      try {
        const data = await apiService.request('/ipd/wards');
        setWards(data || []);
      } catch (error) {}
    };
    fetchWards();
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Input name="bedNumber" label="Bed Number" rules={{ required: "Bed number is required" }} />
        <Select 
            name="ward" 
            label="Ward" 
            options={wards.map(w => ({ value: w._id, label: w.name }))} 
            rules={{ required: "Ward is required" }}
        />
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
            <Button className='w-full' type="submit" loading={loading}>{bed ? 'Update' : 'Create'} Bed</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default BedForm;