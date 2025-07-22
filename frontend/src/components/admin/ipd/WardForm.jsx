import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';

const WardForm = ({ ward, onSubmit, onCancel, loading }) => {
  const methods = useForm({
    defaultValues: ward || {},
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Input name="name" label="Ward Name" rules={{ required: true }} />
        <Textarea name="description" label="Description" />
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
            <Button className='w-full' type="submit" loading={loading}>{ward ? 'Update' : 'Create'} Ward</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default WardForm;