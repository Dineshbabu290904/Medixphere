
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import RadiologyReportForm from './RadiologyReportForm';
import { apiService } from '@/services/api';

const RadiologyReportTable = () => {
  const [radiologyReports, setRadiologyReports] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRadiologyReport, setSelectedRadiologyReport] = useState(null);

  const fetchRadiologyReports = async () => {
    const data = await apiService.request('/ris/radiology-reports');
    setRadiologyReports(data);
  };

  useEffect(() => {
    fetchRadiologyReports();
  }, []);

  const handleCreate = () => {
    setSelectedRadiologyReport(null);
    setIsModalOpen(true);
  };

  const handleEdit = (radiologyReport) => {
    setSelectedRadiologyReport(radiologyReport);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    if (selectedRadiologyReport) {
      await apiService.request(`/ris/radiology-reports/${selectedRadiologyReport._id}`, { method: 'PUT', body: data });
    } else {
      await apiService.request('/ris/radiology-reports', { method: 'POST', body: data });
    }
    fetchRadiologyReports();
    setIsModalOpen(false);
  };

  const columns = [
    { Header: 'Patient', accessor: 'patient.name' },
    { Header: 'Radiology Test', accessor: 'radiologyTest.name' },
    { Header: 'Date', accessor: 'reportDate' },
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
      <Button onClick={handleCreate} className="mb-4">Create Radiology Report</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRadiologyReport ? 'Edit Radiology Report' : 'Create Radiology Report'}>
        <RadiologyReportForm radiologyReport={selectedRadiologyReport} onSubmit={handleSubmit} />
      </Modal>
      <Table columns={columns} data={radiologyReports} />
    </div>
  );
};

export default RadiologyReportTable;
