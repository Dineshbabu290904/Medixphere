import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import InvoiceTable from '@/components/admin/billing/InvoiceTable';

const InvoicesPage = () => {
  return (
    <>
      <PageHeader 
        title="Manage Invoices"
        subtitle="Create, view, and manage all patient invoices."
        breadcrumbs={['Admin', 'Billing', 'Invoices']}
      />
      <InvoiceTable />
    </>
  );
};

export default InvoicesPage;