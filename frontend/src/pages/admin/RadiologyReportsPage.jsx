
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import RadiologyReportTable from '@/components/admin/ris/RadiologyReportTable';

const RadiologyReportsPage = () => {
  return (
    <div>
      <PageHeader title="Radiology Reports" />
      <RadiologyReportTable />
    </div>
  );
};

export default RadiologyReportsPage;
