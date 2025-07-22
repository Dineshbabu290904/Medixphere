import React, { useState, useEffect } from 'react';
import { useForm, FormProvider, useFieldArray } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { apiService } from '@/services/api';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DispenseForm = ({ dispense, onSubmit, loading }) => {
  const methods = useForm({
    defaultValues: dispense || { medicines: [{ medicine: '', quantity: 1 }] }
  });
  const { control } = methods;
  const { fields, append, remove } = useFieldArray({ control, name: "medicines" });
  
  const [patients, setPatients] = useState([]);
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsData, medicinesData] = await Promise.all([
          apiService.request('/patient/details/getAllDetails'),
          apiService.request('/pharmacy/medicines')
        ]);
        setPatients(medicinesData.users || []);
        setMedicines(medicinesData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPatients([]);
        setMedicines([]);
        toast.error('Failed to load data. Please try again later.');
      }
    };
    fetchData();
  }, []);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
        <Select name="patient" label="Patient" options={patients.map(p => ({ value: p._id, label: `${p.firstName} ${p.lastName}` }))} rules={{ required: true }} />
        <h3 className="text-lg font-semibold pt-2">Medicines</h3>
        <div className="space-y-2">
            {fields.map((item, index) => (
              <div key={item.id} className="flex items-end gap-2">
                <Select
                  name={`medicines.${index}.medicine`}
                  label={index === 0 ? "Medicine" : ""}
                  options={medicines.map(m => ({ value: m._id, label: m.name }))}
                  rules={{ required: true }}
                />
                <Input
                  name={`medicines.${index}.quantity`}
                  label={index === 0 ? "Quantity" : ""}
                  type="number"
                  min={1}
                  rules={{ required: true, valueAsNumber: true }}
                />
                <Button type="button" variant="danger" onClick={() => remove(index)}><Trash2 size={16} /></Button>
              </div>
            ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={() => append({ medicine: '', quantity: 1 })}>
            <Plus size={16} className="mr-1" /> Add Medicine
        </Button>
        <Input name="notes" label="Notes" />
        <div className="flex justify-end gap-2 pt-4 border-t dark:border-slate-700">
            <Button className='w-full' type="submit" loading={loading}>{dispense ? 'Update' : 'Create'} Dispense</Button>
        </div>
      </form>
    </FormProvider>
  );
};

export default DispenseForm;