
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import MedicineForm from './MedicineForm';
import { apiService } from '@/services/api';

const MedicineTable = () => {
  const [medicines, setMedicines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const fetchMedicines = async () => {
    const data = await apiService.request('/pharmacy/medicines');
    setMedicines(data);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleCreate = () => {
    setSelectedMedicine(null);
    setIsModalOpen(true);
  };

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await apiService.request(`/pharmacy/medicines/${id}`, { method: 'DELETE' });
    fetchMedicines();
  };

  const handleSubmit = async (data) => {
    if (selectedMedicine) {
      await apiService.request(`/pharmacy/medicines/${selectedMedicine._id}`, { method: 'PUT', body: data });
    } else {
      await apiService.request('/pharmacy/medicines', { method: 'POST', body: data });
    }
    fetchMedicines();
    setIsModalOpen(false);
  };

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Stock', accessor: 'stock' },
    { Header: 'Unit', accessor: 'unit' },
    { Header: 'Price', accessor: 'price' },
    { Header: 'Expiry Date', accessor: 'expiryDate' },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(row.original)}>Edit</Button>
          <Button onClick={() => handleDelete(row.original._id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={handleCreate} className="mb-4">Create Medicine</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedMedicine ? 'Edit Medicine' : 'Create Medicine'}>
        <MedicineForm medicine={selectedMedicine} onSubmit={handleSubmit} />
      </Modal>
      <Table columns={columns} data={medicines} />
    </div>
  );
};

export default MedicineTable;
