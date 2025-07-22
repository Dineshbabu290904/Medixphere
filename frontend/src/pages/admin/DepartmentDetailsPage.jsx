import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import { Users, Stethoscope } from 'lucide-react';

const DepartmentDetailsPage = () => {
  const { departmentName } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [docRes, patRes] = await Promise.all([
          apiService.request(`/doctor/details/by-department/${departmentName}`),
          apiService.request(`/patient/details/by-department/${departmentName}`)
        ]);
        setDoctors(docRes.doctors || []);
        setPatients(patRes.patients || []);
      } catch (error) {
        toast.error("Failed to load department details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [departmentName]);

  if (loading) return <div className="flex justify-center p-16"><Spinner size="lg" /></div>;

  return (
    <>
      <PageHeader
        title={decodeURIComponent(departmentName)}
        subtitle="Detailed view of doctors and patients for this department."
        breadcrumbs={['Admin', 'Departments', decodeURIComponent(departmentName)]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
            <Card.Header>
                <div className="flex items-center gap-3">
                    <Stethoscope className="w-6 h-6 text-blue-600"/>
                    <h2 className="text-xl font-bold text-gray-800">Doctors ({doctors.length})</h2>
                </div>
            </Card.Header>
            <Card.Body padding="none">
                 <div className="max-h-96 overflow-y-auto">
                    {doctors.length > 0 ? doctors.map(doc => (
                        <div key={doc._id} className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50">
                             <img src={`${import.meta.env.VITE_MEDIA_LINK}/${doc.profile}`} alt={doc.firstName} className="w-12 h-12 rounded-full object-cover"/>
                             <div>
                                <p className="font-semibold text-gray-900">Dr. {doc.firstName} {doc.lastName}</p>
                                <p className="text-sm text-gray-600">{doc.post}</p>
                             </div>
                        </div>
                    )) : <p className="p-4 text-gray-500">No doctors found in this department.</p>}
                 </div>
            </Card.Body>
        </Card>

        <Card>
            <Card.Header>
                <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-emerald-600"/>
                    <h2 className="text-xl font-bold text-gray-800">Associated Patients ({patients.length})</h2>
                </div>
            </Card.Header>
            <Card.Body padding="none">
                 <div className="max-h-96 overflow-y-auto">
                     {patients.length > 0 ? patients.map(pat => (
                        <div key={pat._id} className="flex items-center gap-4 p-4 border-b last:border-b-0 hover:bg-gray-50">
                             <img src={`${import.meta.env.VITE_MEDIA_LINK}/${pat.profile}`} alt={pat.firstName} className="w-12 h-12 rounded-full object-cover"/>
                             <div>
                                <p className="font-semibold text-gray-900">{pat.firstName} {pat.lastName}</p>
                                <p className="text-sm text-gray-600 font-mono">{pat.patientId}</p>
                             </div>
                        </div>
                    )) : <p className="p-4 text-gray-500">No patients associated with this department yet.</p>}
                 </div>
            </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default DepartmentDetailsPage;