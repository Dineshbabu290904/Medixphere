import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import EmployeeForm from './EmployeeForm';
import { Edit, Trash2 } from 'lucide-react';

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiService.request('/hr/employees');
      setEmployees(data || []);
    } catch (error) {
      setEmployees([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleCreate = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await apiService.request(`/hr/employees/${id}`, { method: 'DELETE' });
        toast.success('Employee deleted successfully.');
        fetchEmployees();
      } catch (error) {}
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (selectedEmployee) {
        await apiService.request(`/hr/employees/${selectedEmployee._id}`, { method: 'PUT', body: data });
      } else {
        await apiService.request('/hr/employees', { method: 'POST', body: data });
      }
      toast.success(`Employee ${selectedEmployee ? 'updated' : 'created'} successfully.`);
      fetchEmployees();
      setIsModalOpen(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const headers = ['Name', 'Employee ID', 'Role', 'Department', 'Joining Date', 'Actions'];

  return (
    <div>
      <Button onClick={handleCreate} className="mb-4">Create Employee</Button>
      <Table headers={headers} title="Manage Employees" loading={loading} searchable>
        {employees.length > 0 ? employees.map(employee => (
          <Table.Row key={employee._id}>
            <Table.Cell className="font-medium">{employee.name}</Table.Cell>
            <Table.Cell>{employee.employeeId}</Table.Cell>
            <Table.Cell>{employee.role}</Table.Cell>
            <Table.Cell>{employee.department}</Table.Cell>
            <Table.Cell>{new Date(employee.joiningDate).toLocaleDateString()}</Table.Cell>
            <Table.Cell>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(employee)}><Edit size={16} /></Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(employee._id)}><Trash2 size={16} /></Button>
              </div>
            </Table.Cell>
          </Table.Row>
        )) : (
          !loading && <Table.Row><Table.Cell colSpan={headers.length} className="text-center">No employees found.</Table.Cell></Table.Row>
        )}
      </Table>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedEmployee ? 'Edit Employee' : 'Create Employee'}>
        <EmployeeForm employee={selectedEmployee} onSubmit={handleSubmit} loading={isSubmitting} />
      </Modal>
    </div>
  );
};

export default EmployeeTable;