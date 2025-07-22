import React from 'react';
import { useParams } from 'react-router-dom';
import useApi from '../../hooks/useApi';
import Card from '../../components/ui/Card';
import Spinner from '../../components/ui/Spinner';
import FlowChart from '../../components/doctor/FlowChart';
import PageHeader from '../ui/PageHeader';

const CriticalCareChartPage = () => {
  const { id: patientId } = useParams(); 
  const { data, loading, error } = useApi('get', `/doctor/patients/${patientId}`);

  if (loading) return <div className="flex h-screen items-center justify-center"><Spinner size="lg" /></div>;
  if (error) return <div className="text-red-500 text-center">Error loading patient data: {error.message}</div>;
  
  const patient = data?.patient;

  return (
    <>
    {patient && (
       <PageHeader 
        title="Critical Care Chart"
        subtitle={`Viewing chart for ${patient.firstName} ${patient.lastName} (${patient.patientId})`}
        breadcrumbs={['Doctor', 'Patients', patient.firstName, 'Critical Care']}
      />
    )}
    {patient ? (
      <FlowChart patient={patient} />
    ) : (
      <Card><p>Patient not found.</p></Card>
    )}
    </>
  );
};

export default CriticalCareChartPage;