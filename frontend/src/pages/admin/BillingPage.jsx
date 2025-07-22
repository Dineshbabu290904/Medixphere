
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import InvoiceTable from '@/components/admin/billing/InvoiceTable';

const BillingPage = () => {
  return (
    <div>
      <PageHeader title="Billing & Invoices" />
      <InvoiceTable />
    </div>
  );
};

export default BillingPage;
