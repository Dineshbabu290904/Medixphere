
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import LabReportTable from '@/components/admin/lis/LabReportTable';

const LabReportsPage = () => {
  return (
    <div>
      <PageHeader title="Lab Reports" />
      <LabReportTable />
    </div>
  );
};

export default LabReportsPage;
