
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import RadiologyTestForm from './RadiologyTestForm';
import { apiService } from '@/services/api';

const RadiologyTestTable = () => {
  const [radiologyTests, setRadiologyTests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRadiologyTest, setSelectedRadiologyTest] = useState(null);

  const fetchRadiologyTests = async () => {
    const data = await apiService.request('/ris/radiology-tests');
    setRadiologyTests(data);
  };

  useEffect(() => {
    fetchRadiologyTests();
  }, []);

  const handleCreate = () => {
    setSelectedRadiologyTest(null);
    setIsModalOpen(true);
  };

  const handleEdit = (radiologyTest) => {
    setSelectedRadiologyTest(radiologyTest);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await apiService.request.delete(`/ris/radiology-tests/${id}`);
    fetchRadiologyTests();
  };

  const handleSubmit = async (data) => {
    if (selectedRadiologyTest) {
      await apiService.request(`/ris/radiology-tests/${selectedRadiologyTest._id}`, { method: 'PUT', body: data });
    } else {
      await apiService.request('/ris/radiology-tests', { method: 'POST', body: data });
    }
    fetchRadiologyTests();
    setIsModalOpen(false);
  };

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Description', accessor: 'description' },
    { Header: 'Price', accessor: 'price' },
    { Header: 'Category', accessor: 'category' },
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
      <Button onClick={handleCreate} className="mb-4">Create Radiology Test</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRadiologyTest ? 'Edit Radiology Test' : 'Create Radiology Test'}>
        <RadiologyTestForm radiologyTest={selectedRadiologyTest} onSubmit={handleSubmit} />
      </Modal>
      <Table columns={columns} data={radiologyTests} />
    </div>
  );
};

export default RadiologyTestTable;
