
import React, { useState, useEffect } from 'react';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ServiceForm from './ServiceForm';
import { apiService } from '@/services/api';

const ServiceTable = () => {
  const [services, setServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const fetchServices = async () => {
    const data = await apiService.request('billing/services');
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleCreate = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    await apiService.request(`billing/services/${id}`, { method: 'DELETE' });
    fetchServices();
  };

  const handleSubmit = async (data) => {
    if (selectedService) {
      await apiService.request(`/billing/services/${selectedService._id}`, { method: 'PUT', body: data });
    } else {
      await apiService.request('/billing/services', { method: 'POST', body: data });
    }
    fetchServices();
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
      <Button onClick={handleCreate} className="mb-4">Create Service</Button>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedService ? 'Edit Service' : 'Create Service'}>
        <ServiceForm service={selectedService} onSubmit={handleSubmit} />
      </Modal>
      <Table columns={columns} data={services} />
    </div>
  );
};

export default ServiceTable;
