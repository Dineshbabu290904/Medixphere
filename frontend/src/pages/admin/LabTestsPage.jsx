
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import LabTestTable from '@/components/admin/lis/LabTestTable';

const LabTestsPage = () => {
  return (
    <div>
      <PageHeader title="Lab Tests" />
      <LabTestTable />
    </div>
  );
};

export default LabTestsPage;
