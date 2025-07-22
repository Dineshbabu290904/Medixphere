
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import DispenseTable from '@/components/admin/pharmacy/DispenseTable';

const DispensePage = () => {
  return (
    <div>
      <PageHeader title="Dispense" />
      <DispenseTable />
    </div>
  );
};

export default DispensePage;
