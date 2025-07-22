
import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const RadiologyTestForm = ({ radiologyTest, onSubmit }) => {
  const methods = useForm({
    defaultValues: radiologyTest || {},
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Input label="Name" {...methods.register('name', { required: true })} />
        <Input label="Description" {...methods.register('description')} />
        <Input label="Price" type="number" {...methods.register('price', { required: true, valueAsNumber: true })} />
        <Input label="Category" {...methods.register('category', { required: true })} />
        <Button type="submit" className="mt-4">{radiologyTest ? 'Update' : 'Create'} Radiology Test</Button>
      </form>
    </FormProvider>
  );
};

export default RadiologyTestForm;
