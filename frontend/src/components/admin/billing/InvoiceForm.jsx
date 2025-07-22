import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { apiService } from '@/services/api';
import { Plus, Trash2 } from 'lucide-react';

const InvoiceForm = ({ invoice, onSubmit, loading }) => {
  const methods = useForm({
    defaultValues: invoice ? 
        { ...invoice, dueDate: invoice.dueDate ? new Date(invoice.dueDate).toISOString().split('T')[0] : '' } :
        { items: [{ service: '', quantity: 1 }] }
  });
  const { control } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
        try {
            const [patientsData, servicesData] = await Promise.all([
                apiService.request('/patient/details/getAllDetails'),
                apiService.request('/billing/services'),
            ]);
            setPatients(patientsData.users || []);
            setServices(servicesData || []);
        } catch (error) {}
    };
    fetchData();
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Select name="patient" label="Patient" options={patients.map(p => ({ value: p._id, label: `${p.firstName} ${p.lastName}` }))} rules={{ required: true }} />
        <Input name="dueDate" label="Due Date" type="date" />
        <Select name="status" label="Status" options={['Draft', 'Issued', 'Paid', 'Partially Paid', 'Cancelled'].map(s => ({ value: s, label: s }))} />
        <h3 className="text-lg font-semibold pt-2">Items</h3>
        <div className="space-y-2">
            {fields.map((item, index) => (
                <div key={item.id} className="flex items-end gap-2">
                    <Select
                        name={`items.${index}.service`}
                        label={index === 0 ? "Service" : ""}
                        options={services.map(s => ({ value: s._id, label: s.name }))}
                        rules={{ required: true }}
                    />
                    <Input
                        name={`items.${index}.quantity`}
                        label={index === 0 ? "Qty" : ""}
                        type="number"
                        min={1}
                        rules={{ required: true, valueAsNumber: true }}
                    />
                    <Button type="button" variant="danger" onClick={() => remove(index)}><Trash2 size={16} /></Button>
                </div>
            ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => append({ service: '', quantity: 1 })}>
            <Plus size={16} className="mr-1"/> Add Item
        </Button>
        <Input name="notes" label="Notes" />
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
            <Button className='w-full' type="submit" loading={loading}>{invoice ? 'Update' : 'Create'} Invoice</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default InvoiceForm;