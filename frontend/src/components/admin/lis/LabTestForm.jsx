import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';

const LabTestForm = ({ labTest, onSubmit, onCancel, loading }) => {
  const methods = useForm({
    defaultValues: labTest || {},
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Input 
            name="name" 
            label="Test Name" 
            rules={{ required: "Test name is required" }} 
            placeholder="e.g., Complete Blood Count (CBC)"
        />
        <Textarea 
            name="description" 
            label="Description (Optional)" 
            placeholder="A brief description of the lab test."
        />
        <div className="grid grid-cols-2 gap-4">
            <Input 
                name="price" 
                label="Price" 
                type="number" 
                step="0.01"
                rules={{ required: "Price is required", valueAsNumber: true, min: { value: 0, message: "Price must be non-negative"} }} 
                placeholder="e.g., 150.50"
            />
            <Input 
                name="category" 
                label="Category" 
                rules={{ required: "Category is required" }} 
                placeholder="e.g., Hematology"
            />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
            <Button type="submit" loading={loading}>{labTest ? 'Update' : 'Create'} Test</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default LabTestForm;