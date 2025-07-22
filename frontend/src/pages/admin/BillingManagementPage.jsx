import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import ActionCard from '@/components/ui/ActionCard';
import { List, FileText } from 'lucide-react';

const BillingManagementPage = () => {
  return (
    <>
      <PageHeader
        title="Billing Management"
        subtitle="Manage all financial aspects of the hospital."
        breadcrumbs={['Admin', 'Billing']}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ActionCard
          to="/admin/billing/services"
          icon={List}
          title="Manage Services"
          description="Add, edit, or remove billable hospital services and procedures for patients."
          color="blue"
        />
        <ActionCard
          to="/admin/billing/invoices"
          icon={FileText}
          title="Manage Invoices"
          description="Create, view, and update patient invoices for all services rendered."
          color="emerald"
        />
      </div>
    </>
  );
};

export default BillingManagementPage;