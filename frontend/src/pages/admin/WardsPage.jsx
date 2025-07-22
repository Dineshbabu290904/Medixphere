
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import WardTable from '@/components/admin/ipd/WardTable';

const WardsPage = () => {
  return (
    <div>
      <PageHeader title="Wards" />
      <WardTable />
    </div>
  );
};

export default WardsPage;
