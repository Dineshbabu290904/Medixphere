import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const EmployeeForm = ({ employee, onSubmit, loading }) => {
  const methods = useForm({
    defaultValues: employee ? { ...employee, joiningDate: new Date(employee.joiningDate).toISOString().split('T')[0] } : {},
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Name" name="name" rules={{ required: true }} />
            <Input label="Employee ID" name="employeeId" rules={{ required: true }} />
            <Input label="Role" name="role" rules={{ required: true }} />
            <Input label="Department" name="department" rules={{ required: true }} />
            <Input label="Joining Date" name="joiningDate" type="date" rules={{ required: true }} />
            <Input label="Contact Number" name="contactNumber" rules={{ required: true }} />
            <Input label="Email" name="email" type="email" rules={{ required: true }} className="md:col-span-2" />
        </div>
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
            <Button className='w-full' type="submit" loading={loading}>{employee ? 'Update' : 'Create'} Employee</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default EmployeeForm;