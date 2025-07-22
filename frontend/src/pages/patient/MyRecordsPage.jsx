import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';

// UI Components
import PageHeader from '@/components/ui/PageHeader';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';
import Button from '@/components/ui/Button';

// Icons
import { Pill, FileText, Download, Calendar, ClipboardList, Stethoscope } from 'lucide-react'; // Using a placeholder for Stethoscope

const MyRecordsPage = () => {
    const [records, setRecords] = useState({ prescriptions: [], reports: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('prescriptions');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [prescriptionsRes, reportsRes] = await Promise.all([
                apiService.request('/patient/prescriptions'),
                apiService.request('/patient/reports')
            ]);
            setRecords({ 
                prescriptions: prescriptionsRes || [], 
                reports: reportsRes || [] 
            });
        } catch (error) {
            toast.error("Failed to load medical records.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const TABS = [
        { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
        { id: 'reports', label: 'Lab Reports', icon: FileText },
    ];

    const reportHeaders = ["Test Name", "Report Date", "Status", "Actions"];

    if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

    return (
        <>
            <PageHeader title="My Medical Records" subtitle="Access your prescriptions and lab reports securely." />
            
            <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
                <nav className="-mb-px flex space-x-6">
                    {TABS.map(tab => (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)} 
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                                activeTab === tab.id 
                                    ? 'border-blue-500 text-blue-600' 
                                    : 'border-transparent text-gray-500 hover:text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            <tab.icon className="w-5 h-5" />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {activeTab === 'prescriptions' && (
                <div className="space-y-6">
                    {records.prescriptions.length > 0 ? records.prescriptions.map(pres => (
                        <Card key={pres._id}>
                            <Card.Header>
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">Prescription Details</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4"/> {moment(pres.date).format('LL')}</span>
                                            <span className="flex items-center gap-1.5"><Stethoscope className="w-4 h-4"/> Dr. {pres.doctor.firstName} {pres.doctor.lastName}</span>
                                        </div>
                                    </div>
                                    <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-2"/> Download PDF</Button>
                                </div>
                            </Card.Header>
                            <Card.Body>
                                <ul className="space-y-3">
                                    {pres.medications.map((med, index) => (
                                        <li key={index} className="p-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg">
                                            <p className="font-semibold text-gray-900 dark:text-gray-100">{med.name}</p>
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-gray-400 mt-1">
                                                <span><strong>Dosage:</strong> {med.dosage}</span>
                                                <span><strong>Frequency:</strong> {med.frequency}</span>
                                                <span><strong>Duration:</strong> {med.duration}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                {pres.notes && (
                                    <div className="mt-4 pt-4 border-t dark:border-slate-700">
                                        <h4 className="font-semibold mb-1">Doctor's Notes:</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-300">{pres.notes}</p>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    )) : (
                        <Card className="text-center py-12">
                            <ClipboardList className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">No Prescriptions Found</h3>
                            <p className="text-gray-500 mt-1">Your prescribed medications will appear here.</p>
                        </Card>
                    )}
                </div>
            )}

            {activeTab === 'reports' && (
                <Card>
                    <Card.Header>
                        <h3 className="text-xl font-bold">My Lab Reports</h3>
                    </Card.Header>
                    <Card.Body padding="none">
                        <Table headers={reportHeaders}>
                            {records.reports.length > 0 ? records.reports.map(report => (
                                <Table.Row key={report._id}>
                                    <Table.Cell className="font-medium">{report.labTest.name}</Table.Cell>
                                    <Table.Cell>{moment(report.reportDate).format('LL')}</Table.Cell>
                                    <Table.Cell><span className="text-green-600 font-semibold">Available</span></Table.Cell>
                                    <Table.Cell>
                                        <Button 
                                            as="a" // Render button as an anchor tag
                                            href={`${import.meta.env.VITE_MEDIA_LINK}/${report.link}`} // Assuming 'link' holds filename
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            size="sm" 
                                            variant="secondary"
                                        >
                                            <Download className="w-4 h-4 mr-2"/> View Report
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            )) : <Table.Row><Table.Cell colSpan={reportHeaders.length} className="text-center py-8">No lab reports found.</Table.Cell></Table.Row>}
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </>
    );
};

export default MyRecordsPage;