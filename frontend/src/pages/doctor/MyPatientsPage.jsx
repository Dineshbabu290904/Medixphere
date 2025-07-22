import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button';
import { Eye } from 'lucide-react';

const MyPatientsPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchMyPatients = useCallback(async () => {
    if (!user?.id) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const response = await apiService.getAppointments({ doctorId: user.id });
      const uniquePatientsMap = new Map();
      response.appointments.forEach(appt => {
        if (appt.patientId && !uniquePatientsMap.has(appt.patientId._id)) {
          uniquePatientsMap.set(appt.patientId._id, appt.patientId); 
        }
      });
      setPatients(Array.from(uniquePatientsMap.values()));
    } catch (error) {
      toast.error("Could not fetch your patient list.");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMyPatients();
  }, [fetchMyPatients]);

  const tableHeaders = ["Patient ID", "Name", "Gender", "Phone", "Actions"];

  return (
    <>
      <PageHeader
        title="My Patients"
        subtitle="A list of all patients you have consulted with."
        breadcrumbs={['Doctor', 'My Patients']}
      />

      <Table headers={tableHeaders} loading={loading}>
        {loading ? (
           <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center p-8"><Spinner/></Table.Cell></Table.Row>
        ) : patients.length > 0 ? (
          patients.map((patient) => (
            <Table.Row key={patient._id}>
              <Table.Cell className="font-mono text-xs">{patient.patientId}</Table.Cell>
              <Table.Cell className="font-medium flex items-center gap-3">
                 <img src={`${import.meta.env.VITE_MEDIA_LINK}/${patient.profile}`} alt="" className="w-9 h-9 rounded-full object-cover"/>
                 {patient.firstName} {patient.lastName}
              </Table.Cell>
              <Table.Cell>{patient.gender}</Table.Cell>
              <Table.Cell>{patient.phoneNumber}</Table.Cell>
              <Table.Cell>
                <Link to={`/doctor/patient-details/${patient.patientId}`}>
                    <Button variant="secondary" size="sm">
                        <Eye className="w-4 h-4 mr-2"/> View EMR
                    </Button>
                </Link>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row><Table.Cell colSpan={tableHeaders.length} className="text-center text-gray-500 py-8">You have no associated patients yet.</Table.Cell></Table.Row>
        )}
      </Table>
    </>
  );
};

export default MyPatientsPage;