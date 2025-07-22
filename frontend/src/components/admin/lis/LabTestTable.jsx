import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

// UI Components
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LabTestForm from './LabTestForm';
import { Edit, Trash2, Plus } from 'lucide-react';

const LabTestTable = () => {
  const [labTests, setLabTests] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabTest, setSelectedLabTest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLabTests = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getLabTests();
      setLabTests(data || []);
    } catch (error) {
      setLabTests([]); // Clear data on error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabTests();
  }, [fetchLabTests]);

  const handleCreate = () => {
    setSelectedLabTest(null);
    setIsModalOpen(true);
  };

  const handleEdit = (labTest) => {
    setSelectedLabTest(labTest);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this lab test?')) {
      try {
        await apiService.deleteLabTest(id);
        toast.success('Lab test deleted successfully.');
        fetchLabTests();
      } catch (error) {}
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedLabTest) {
        await apiService.updateLabTest(selectedLabTest._id, data);
        toast.success('Lab test updated successfully.');
      } else {
        await apiService.createLabTest(data);
        toast.success('Lab test created successfully.');
      }
      fetchLabTests();
      setIsModalOpen(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { Header: 'Name', accessor: 'name' },
    { Header: 'Price', accessor: 'price', Cell: ({ row }) => `$${row.original.price.toFixed(2)}` },
    { Header: 'Category', accessor: 'category' },
    { Header: 'Actions', Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(row.original)}><Edit size={16} /></Button>
          <Button size="sm" variant="danger" onClick={() => handleDelete(row.original._id)}><Trash2 size={16} /></Button>
        </div>
    )},
  ];

  return (
    <div>
      <Button onClick={handleCreate} className="mb-4">
        <Plus size={16} className="mr-2" /> Create Lab Test
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedLabTest ? 'Edit Lab Test' : 'Create New Lab Test'}>
        <LabTestForm 
            labTest={selectedLabTest} 
            onSubmit={handleSubmit} 
            onCancel={() => setIsModalOpen(false)}
            loading={isSubmitting} 
        />
      </Modal>
      <Table columns={columns} data={labTests} loading={loading} />
    </div>
  );
};

export default LabTestTable;