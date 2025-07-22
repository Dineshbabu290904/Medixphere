import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { apiService } from '@/services/api';
import PageHeader from '@/components/ui/PageHeader';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StatusBadge from '@/components/ui/StatusBadge';
import { Download, CreditCard } from 'lucide-react';

const MyBillingPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchInvoices = useCallback(async () => {
        setLoading(true);
        try {
            const data = await apiService.request('/patient/invoices');
            setInvoices(data || []);
        } catch (error) { /* Handled globally */ } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchInvoices(); }, [fetchInvoices]);

    const tableHeaders = ["Invoice ID", "Date", "Total Amount", "Amount Paid", "Balance", "Status", "Actions"];

    if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

    return (
        <>
            <PageHeader title="Billing & Invoices" subtitle="View your payment history and manage outstanding balances." />
            <Card>
                <Card.Header>
                    <h3 className="text-xl font-bold">My Invoices</h3>
                </Card.Header>
                <Card.Body padding="none">
                    <Table headers={tableHeaders}>
                        {invoices.length > 0 ? invoices.map(inv => (
                            <Table.Row key={inv._id}>
                                <Table.Cell className="font-mono">{inv.invoiceNumber}</Table.Cell>
                                <Table.Cell>{moment(inv.invoiceDate).format('LL')}</Table.Cell>
                                <Table.Cell>${inv.totalAmount.toFixed(2)}</Table.Cell>
                                <Table.Cell>${inv.amountPaid.toFixed(2)}</Table.Cell>
                                <Table.Cell className="font-semibold">${inv.balance.toFixed(2)}</Table.Cell>
                                <Table.Cell><StatusBadge status={inv.status} /></Table.Cell>
                                <Table.Cell>
                                    <div className="flex gap-2">
                                        {inv.balance > 0 && <Button size="sm"><CreditCard className="w-4 h-4 mr-2"/>Pay Now</Button>}
                                        <Button size="sm" variant="outline"><Download className="w-4 h-4"/> </Button>
                                    </div>
                                </Table.Cell>
                            </Table.Row>
                        )) : <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center py-8">No invoices found.</Table.Cell></Table.Row>}
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
};

export default MyBillingPage;