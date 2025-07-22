import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const ServiceForm = ({ service, onSubmit, loading }) => {
  const methods = useForm({
    defaultValues: service || {},
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Input name="name" label="Service Name" rules={{ required: true }} />
        <Input name="description" label="Description" />
        <Input name="price" label="Price" type="number" step="0.01" rules={{ required: true, valueAsNumber: true, min: 0 }} />
        <Select
          name="category"
          label="Category"
          rules={{ required: true }}
          options={[
            { value: 'Consultation', label: 'Consultation' },
            { value: 'Lab Test', label: 'Lab Test' },
            { value: 'Procedure', label: 'Procedure' },
            { value: 'Room Charge', label: 'Room Charge' },
            { value: 'Other', label: 'Other' },
          ]}
        />
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
            <Button className='w-full' type="submit" loading={loading}>{service ? 'Update' : 'Create'} Service</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ServiceForm;