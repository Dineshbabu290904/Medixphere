import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';

const SHIFT_OPTIONS = [
  { value: 'Morning', label: 'Morning (8 AM - 4 PM)' },
  { value: 'Evening', label: 'Evening (4 PM - 12 AM)' },
  { value: 'Night', label: 'Night (12 AM - 8 AM)' },
];

const DutyRosterForm = ({ rosterEntry, employees, onCancel, onSubmit, loading, defaultDate, defaultEmployee }) => {
  const methods = useForm({
    defaultValues: {
        ...rosterEntry,
        date: rosterEntry?.date ? new Date(rosterEntry.date).toISOString().split('T')[0] : defaultDate,
        employee: rosterEntry?.employee._id || defaultEmployee,
    },
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Select
          name="employee"
          label="Employee"
          options={employees.map(e => ({ value: e._id, label: `${e.name} (${e.department})` }))}
          rules={{ required: "Employee is required" }}
        />
        <Input name="date" label="Date" type="date" rules={{ required: "Date is required" }} />
        <Select name="shift" label="Shift" options={SHIFT_OPTIONS} rules={{ required: "Shift is required" }} />
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
          <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>Cancel</Button>
          <Button type="submit" loading={loading}>{rosterEntry ? 'Update' : 'Add'} Shift</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DutyRosterForm;