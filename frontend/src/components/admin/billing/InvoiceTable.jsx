
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import InvoiceForm from './InvoiceForm';
import { apiService } from '@/services/api';

const InvoiceTable = () => {
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const fetchInvoices = async () => {
    const data = await apiService.request('/billing/invoices');
    setInvoices(data);
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleCreate = () => {
    setSelectedInvoice(null);
    setIsModalOpen(true);
  };

  const handleEdit = (invoice) => {
    setSelectedInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await apiService.request(`/billing/invoices/${id}`, { method: 'DELETE' });
    fetchInvoices();
  };

  const handleSubmit = async (data) => {
    if (selectedInvoice) {
      await apiService.request(`/billing/invoices/${selectedInvoice._id}`, { method: 'PUT', body: data });
    } else {
      await apiService.request('/billing/invoices', { method: 'POST', body: data });
    }
    fetchInvoices();
    setIsModalOpen(false);
  };

  const columns = [
    { Header: 'Invoice Number', accessor: 'invoiceNumber' },
    { Header: 'Patient', accessor: 'patient.name' },
    { Header: 'Total Amount', accessor: 'totalAmount' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Due Date', accessor: 'dueDate' },
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
      <Button onClick={handleCreate} className="mb-4">Create Invoice</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedInvoice ? 'Edit Invoice' : 'Create Invoice'}>
        <InvoiceForm invoice={selectedInvoice} onSubmit={handleSubmit} />
      </Modal>
      <Table columns={columns} data={invoices} />
    </div>
  );
};

export default InvoiceTable;
