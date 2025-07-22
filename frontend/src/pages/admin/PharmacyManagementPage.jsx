// src/pages/admin/PharmacyManagementPage.jsx
import React from 'react';
import PageHeader from '@/components/ui/PageHeader';
import ActionCard from '@/components/ui/ActionCard';
import { Pill, Truck } from 'lucide-react';

const PharmacyManagementPage = () => (
  <>
    <PageHeader title="Pharmacy Management" subtitle="Oversee medicine inventory and dispense records." breadcrumbs={['Admin', 'Pharmacy']} />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ActionCard to="/admin/pharmacy/medicines" icon={Pill} title="Manage Medicines" description="Update stock, pricing, and details for all medicines." color="rose" />
      <ActionCard to="/admin/pharmacy/dispense" icon={Truck} title="Dispense History" description="View and manage all historical medicine dispense records." color="amber" />
    </div>
  </>
);
export default PharmacyManagementPage;