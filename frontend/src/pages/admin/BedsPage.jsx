
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import BedTable from '@/components/admin/ipd/BedTable';

const BedsPage = () => {
  return (
    <div>
      <PageHeader title="Beds" />
      <BedTable />
    </div>
  );
};

export default BedsPage;
