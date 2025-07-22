import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import ServiceForm from '@/components/admin/billing/ServiceForm';
import { Edit, Trash2, Plus } from 'lucide-react';

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.request('/billing/services');
      const serviceData = data || [];
      setServices(serviceData);
      setFilteredServices(serviceData);
    } catch (error) {
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);
  
  const handleSearch = (query) => {
    const lowercasedQuery = query.toLowerCase();
    const filtered = services.filter(service => 
      service.name.toLowerCase().includes(lowercasedQuery) ||
      service.category.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredServices(filtered);
  };

  const handleCreate = () => {
    setSelectedService(null);
    setIsModalOpen(true);
  };

  const handleEdit = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await apiService.request(`/billing/services/${id}`, { method: 'DELETE' });
        toast.success('Service deleted successfully.');
        fetchServices();
      } catch (error) {}
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedService) {
        await apiService.request(`/billing/services/${selectedService._id}`, { method: 'PUT', body: data });
      } else {
        await apiService.request('/billing/services', { method: 'POST', body: data });
      }
      toast.success(`Service ${selectedService ? 'updated' : 'created'} successfully.`);
      fetchServices();
      setIsModalOpen(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const headers = ['Name', 'Category', 'Price', 'Description', 'Actions'];

  return (
    <>
      <PageHeader
        title="Service Management"
        subtitle="Manage all billable hospital services and procedures."
        breadcrumbs={['Admin', 'Billing', 'Services']}
      />
      
      <Table 
        headers={headers} 
        title="All Services" 
        loading={loading}
        searchable
        onSearchChange={handleSearch}
        actionButton={
            <Button onClick={handleCreate}>
                <Plus size={16} className="mr-1"/> Create Service
            </Button>
        }
      >
        {filteredServices.map(service => (
          <Table.Row key={service._id}>
            <Table.Cell className="font-medium text-slate-800 dark:text-slate-100">{service.name}</Table.Cell>
            <Table.Cell>
                <span className="px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-100 dark:bg-sky-900/50 dark:text-sky-300 rounded-full">
                    {service.category}
                </span>
            </Table.Cell>
            <Table.Cell className="font-mono">${service.price.toFixed(2)}</Table.Cell>
            <Table.Cell className="max-w-sm truncate">{service.description}</Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(service)}><Edit size={16} /></Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(service._id)}><Trash2 size={16} /></Button>
              </div>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedService ? 'Edit Service' : 'Create New Service'}>
        <ServiceForm 
            service={selectedService} 
            onSubmit={handleSubmit} 
            onCancel={() => setIsModalOpen(false)} 
            loading={isSubmitting} 
        />
      </Modal>
    </>
  );
};

export default ServicesPage;