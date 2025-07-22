import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import WardForm from './WardForm';
import { Edit, Trash2 } from 'lucide-react';

const WardTable = () => {
  const [wards, setWards] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedWard, setSelectedWard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchWards = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.request('/ipd/wards');
      setWards(data || []);
    } catch (error) {
      setWards([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWards();
  }, [fetchWards]);

  const handleCreate = () => {
    setSelectedWard(null);
    setIsModalOpen(true);
  };

  const handleEdit = (ward) => {
    setSelectedWard(ward);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this ward? This will also remove associated beds.')) {
      try {
        await apiService.request(`/ipd/wards/${id}`, { method: 'DELETE' });
        toast.success('Ward deleted successfully.');
        fetchWards();
      } catch (error) {}
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedWard) {
        await apiService.request(`/ipd/wards/${selectedWard._id}`, { method: 'PUT', body: data });
      } else {
        await apiService.request('/ipd/wards', { method: 'POST', body: data });
      }
      toast.success(`Ward ${selectedWard ? 'updated' : 'created'} successfully.`);
      fetchWards();
      setIsModalOpen(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const headers = ['Name', 'Description', 'Actions'];

  return (
    <div>
      <Button onClick={handleCreate} className="mb-4">Create Ward</Button>
      <Table headers={headers} title="Manage Wards" loading={loading}>
        {wards.length > 0 ? wards.map(ward => (
          <Table.Row key={ward._id}>
            <Table.Cell className="font-medium">{ward.name}</Table.Cell>
            <Table.Cell>{ward.description}</Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(ward)}><Edit size={16} /></Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(ward._id)}><Trash2 size={16} /></Button>
              </div>
            </Table.Cell>
          </Table.Row>
        )) : (
          !loading && <Table.Row><Table.Cell colSpan={headers.length} className="text-center">No wards found.</Table.Cell></Table.Row>
        )}
      </Table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedWard ? 'Edit Ward' : 'Create New Ward'}>
        <WardForm ward={selectedWard} onSubmit={handleSubmit} loading={isSubmitting} />
      </Modal>
    </div>
  );
};

export default WardTable;