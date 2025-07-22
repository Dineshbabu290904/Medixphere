import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import BedForm from './BedForm';
import AssignPatientForm from './AssignPatientForm';
import { Edit, Trash2, Plus, LogIn, LogOut } from 'lucide-react';

const BedTable = () => {
  const [beds, setBeds] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBeds = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.request('/ipd/beds');
      setBeds(data || []);
    } catch (error) {
      setBeds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBeds();
  }, [fetchBeds]);

  const handleCreate = () => {
    setSelectedBed(null);
    setIsModalOpen(true);
  };

  const handleEdit = (bed) => {
    setSelectedBed(bed);
    setIsModalOpen(true);
  };

  const handleAssign = (bed) => {
    setSelectedBed(bed);
    setIsAssignModalOpen(true);
  };
  
  const handleCloseModals = () => {
    setIsModalOpen(false);
    setIsAssignModalOpen(false);
    setSelectedBed(null);
  }

  const handleDischarge = async (id) => {
    if (window.confirm('Are you sure you want to discharge the patient from this bed?')) {
        try {
            await apiService.request(`/ipd/beds/${id}/discharge`, { method: 'PUT' });
            toast.success('Patient discharged successfully.');
            fetchBeds();
        } catch (error) {}
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedBed && !isAssignModalOpen) { // Handle Edit
        await apiService.request(`/ipd/beds/${selectedBed._id}`, { method: 'PUT', body: data });
      } else { // Handle Create
        await apiService.request('/ipd/beds', { method: 'POST', body: data });
      }
      toast.success(`Bed ${selectedBed ? 'updated' : 'created'} successfully.`);
      fetchBeds();
      handleCloseModals();
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignSubmit = async (data) => {
    setIsSubmitting(true);
    try {
        await apiService.request(`/ipd/beds/${selectedBed._id}/assign`, { method: 'PUT', body: data });
        toast.success('Patient assigned to bed successfully.');
        fetchBeds();
        handleCloseModals();
    } catch (error) {
    } finally {
        setIsSubmitting(false);
    }
  };

  const headers = ['Bed Number', 'Ward', 'Patient', 'Status', 'Actions'];

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={handleCreate}><Plus size={16} className="mr-1"/> Create Bed</Button>
      </div>
      <Table headers={headers} title="Manage Beds" loading={loading}>
        {beds.length > 0 ? beds.map(bed => (
          <Table.Row key={bed._id}>
            <Table.Cell className="font-medium">{bed.bedNumber}</Table.Cell>
            <Table.Cell>{bed.ward?.name || 'N/A'}</Table.Cell>
            <Table.Cell>
              {bed.patient ? `${bed.patient.firstName} ${bed.patient.lastName}` : <span className="text-gray-500 italic">Vacant</span>}
            </Table.Cell>
            <Table.Cell>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bed.isOccupied ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {bed.isOccupied ? 'Occupied' : 'Available'}
                </span>
            </Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(bed)}><Edit size={16} /></Button>
                {bed.isOccupied ? (
                  <Button size="sm" variant="warning" onClick={() => handleDischarge(bed._id)}><LogOut size={16} /> Discharge</Button>
                ) : (
                  <Button size="sm" variant="success" onClick={() => handleAssign(bed)}><LogIn size={16} /> Assign</Button>
                )}
              </div>
            </Table.Cell>
          </Table.Row>
        )) : (
          !loading && <Table.Row><Table.Cell colSpan={headers.length} className="text-center py-8">No beds found.</Table.Cell></Table.Row>
        )}
      </Table>
      
      {/* Modal for Creating/Editing a Bed */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModals} title={selectedBed ? 'Edit Bed' : 'Create New Bed'}>
        <BedForm bed={selectedBed} onSubmit={handleSubmit} onCancel={handleCloseModals} loading={isSubmitting} />
      </Modal>

      {/* Modal for Assigning a Patient */}
      {selectedBed && (
        <Modal isOpen={isAssignModalOpen} onClose={handleCloseModals} title="Assign Patient to Bed">
          <AssignPatientForm bed={selectedBed} onSubmit={handleAssignSubmit} onCancel={handleCloseModals} loading={isSubmitting} />
        </Modal>
      )}
    </>
  );
};

export default BedTable;