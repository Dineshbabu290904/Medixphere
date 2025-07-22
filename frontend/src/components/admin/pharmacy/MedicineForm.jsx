
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const MedicineForm = ({ medicine, onSubmit }) => {
  const methods = useForm({
    defaultValues: medicine ? { ...medicine, expiryDate: new Date(medicine.expiryDate).toISOString().split('T')[0] } : {},
  });
  const { register, handleSubmit } = methods;

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input label="Name" {...register('name', { required: true })} />
        <Input label="Description" {...register('description')} />
        <Input label="Stock" type="number" {...register('stock', { required: true, valueAsNumber: true })} />
        <Select
          label="Unit"
          {...register('unit', { required: true })}
          options={[
            { value: 'Tablet', label: 'Tablet' },
            { value: 'Capsule', label: 'Capsule' },
            { value: 'Syrup', label: 'Syrup' },
            { value: 'Injection', label: 'Injection' },
            { value: 'Ointment', label: 'Ointment' },
            { value: 'Other', label: 'Other' },
          ]}
        />
        <Input label="Price" type="number" {...register('price', { required: true, valueAsNumber: true })} />
        <Input label="Expiry Date" type="date" {...register('expiryDate', { required: true })} />
        <Input label="Supplier" {...register('supplier')} />
        <Button type="submit" className="mt-4">{medicine ? 'Update' : 'Create'} Medicine</Button>
      </form>
    </FormProvider>
  );
};

export default MedicineForm;
