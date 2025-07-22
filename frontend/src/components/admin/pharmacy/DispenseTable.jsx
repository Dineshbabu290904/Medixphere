
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import DispenseForm from './DispenseForm';
import { apiService } from '@/services/api';

const DispenseTable = () => {
  const [dispenses, setDispenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDispense, setSelectedDispense] = useState(null);

  const fetchDispenses = async () => {
    const data = await apiService.request('/pharmacy/dispenses');
    setDispenses(data);
  };

  useEffect(() => {
    fetchDispenses();
  }, []);

  const handleCreate = () => {
    setSelectedDispense(null);
    setIsModalOpen(true);
  };

  const handleEdit = (dispense) => {
    setSelectedDispense(dispense);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    if (selectedDispense) {
      await apiService.request(`/pharmacy/dispenses/${selectedDispense._id}`, { method: 'PUT', body: data });
    } else {
      await apiService.request('/pharmacy/dispenses', { method: 'POST', body: data });
    }
    fetchDispenses();
    setIsModalOpen(false);
  };

  const columns = [
    { Header: 'Patient', accessor: 'patient.name' },
    { Header: 'Date', accessor: 'dispenseDate' },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(row.original)}>Edit</Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={handleCreate} className="mb-4">Create Dispense</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDispense ? 'Edit Dispense' : 'Create Dispense'}>
        <DispenseForm dispense={selectedDispense} onSubmit={handleSubmit} />
      </Modal>
      <Table columns={columns} data={dispenses} />
    </div>
  );
};

export default DispenseTable;
