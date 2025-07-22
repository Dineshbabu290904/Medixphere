import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

// UI Components
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import LabReportForm from './LabReportForm';
import { Edit, Plus } from 'lucide-react';

const LabReportTable = () => {
  const [labReports, setLabReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLabReport, setSelectedLabReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLabReports = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.getLabReports();
      setLabReports(data || []);
    } catch (error) {
      setLabReports([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabReports();
  }, [fetchLabReports]);

  const handleCreate = () => {
    setSelectedLabReport(null);
    setIsModalOpen(true);
  };

  const handleEdit = (labReport) => {
    setSelectedLabReport(labReport);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedLabReport) {
        await apiService.updateLabReport(selectedLabReport._id, data);
        toast.success('Lab report updated successfully.');
      } else {
        await apiService.createLabReport(data);
        toast.success('Lab report created successfully.');
      }
      fetchLabReports();
      setIsModalOpen(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    // THE FIX: Accessor changed from 'patientid.name' to 'patient.name'
    { Header: 'Patient', accessor: 'patient.name' },
    { Header: 'Lab Test', accessor: 'labTest.name' },
    { Header: 'Date', accessor: 'reportDate', Cell: ({ row }) => new Date(row.original.reportDate).toLocaleDateString() },
    {
      Header: 'Actions',
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => handleEdit(row.original)}><Edit size={16}/></Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Button onClick={handleCreate} className="mb-4">
        <Plus size={16} className="mr-2"/> Create Lab Report
      </Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedLabReport ? 'Edit Lab Report' : 'Create New Lab Report'}>
        <LabReportForm 
            labReport={selectedLabReport} 
            onSubmit={handleSubmit} 
            onCancel={() => setIsModalOpen(false)}
            loading={isSubmitting}
        />
      </Modal>
      <Table columns={columns} data={labReports} loading={loading}/>
    </div>
  );
};

export default LabReportTable;