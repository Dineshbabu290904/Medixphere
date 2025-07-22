
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import RadiologyTestTable from '@/components/admin/ris/RadiologyTestTable';

const RadiologyTestsPage = () => {
  return (
    <div>
      <PageHeader title="Radiology Tests" />
      <RadiologyTestTable />
    </div>
  );
};

export default RadiologyTestsPage;
