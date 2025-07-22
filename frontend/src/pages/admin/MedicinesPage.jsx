
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import MedicineTable from '@/components/admin/pharmacy/MedicineTable';

const MedicinesPage = () => {
  return (
    <div>
      <PageHeader title="Medicines" />
      <MedicineTable />
    </div>
  );
};

export default MedicinesPage;
