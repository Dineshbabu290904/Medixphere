import React from 'react';
import moment from 'moment';
import Card from '@/components/ui/Card';
import Table from '@/components/ui/Table';

const TabDocuments = ({ records }) => {
    const recordHeaders = ["Document Title", "Uploaded By", "Date", "Action"];
    
    return (
        <Card>
            <Card.Header>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Uploaded Documents</h3>
            </Card.Header>
            <Card.Body padding="none">
                <Table headers={recordHeaders}>
                    {records.length > 0 ? records.map(rec => (
                        <Table.Row key={rec._id}>
                            <Table.Cell>{rec.title}</Table.Cell>
                            <Table.Cell>{rec.doctorName}</Table.Cell>
                            <Table.Cell>{moment(rec.createdAt).format('LL')}</Table.Cell>
                            <Table.Cell>
                                <a href={`${import.meta.env.VITE_MEDIA_LINK}/${rec.link}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    View Document
                                </a>
                            </Table.Cell>
                        </Table.Row>
                    )) : (
                        <Table.Row>
                            <Table.Cell colSpan={recordHeaders.length} className="text-center py-8 text-gray-500">
                                No documents uploaded for this patient.
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table>
            </Card.Body>
        </Card>
    );
};

export default TabDocuments;