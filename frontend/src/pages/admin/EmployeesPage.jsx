
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import EmployeeTable from '@/components/admin/hr/EmployeeTable';

const EmployeesPage = () => {
  return (
    <div>
      <PageHeader title="Employees" />
      <EmployeeTable />
    </div>
  );
};

export default EmployeesPage;
