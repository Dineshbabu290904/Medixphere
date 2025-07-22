import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Users, Stethoscope, ChevronRight } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import { Link } from 'react-router-dom';
import AddDepartmentModal from './modals/AddDepartmentModal';

const DepartmentCard = ({ dept }) => (
    <Card className="hover:border-blue-500 transition-colors group">
      <div className="flex flex-col h-full">
        <div className="flex-grow">
            <h3 className="text-xl font-bold text-gray-800">{dept.name}</h3>
            <div className="flex flex-col gap-2 mt-4 text-gray-600">
                <span className="flex items-center gap-2 text-sm">
                    <Stethoscope className="w-5 h-5 text-blue-500" /> Doctors: 
                    <strong className="text-gray-800">{dept.doctorCount}</strong>
                </span>
                <span className="flex items-center gap-2 text-sm">
                    <Users className="w-5 h-5 text-emerald-500" /> Patients: 
                    <strong className="text-gray-800">{dept.patientCount}</strong>
                </span>
            </div>
        </div>
        <div className="mt-6">
            <Link to={`/admin/departments/${encodeURIComponent(dept.name)}`} className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 group-hover:gap-2 transition-all">
                View Details <ChevronRight className="w-4 h-4" />
            </Link>
        </div>
      </div>
    </Card>
);

const DepartmentsPage = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    try {
      const baseDeptsResponse = await apiService.getDepartments();
      const baseDepts = baseDeptsResponse.departments || [];

      const departmentDataPromises = baseDepts.map(async (dept) => {
        try {
          // Fetch doctor count and patient count concurrently
          const [docRes, patRes] = await Promise.all([
            apiService.getCount('doctor', { department: dept.name }),
            apiService.request(`/patient/details/by-department/${encodeURIComponent(dept.name)}`)
          ]);
          return {
            ...dept,
            doctorCount: docRes.count || 0,
            patientCount: patRes.patients?.length || 0
          };
        } catch (error) {
           console.error(`Failed to fetch counts for ${dept.name}:`, error);
           return { ...dept, doctorCount: 0, patientCount: 0 };
        }
      });

      const departmentsWithCounts = await Promise.all(departmentDataPromises);
      setDepartments(departmentsWithCounts);

    } catch (error) {
      toast.error("Could not fetch the main department list.");
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return (
    <>
      <PageHeader
        title="Hospital Departments"
        subtitle="Overview of all medical and administrative departments."
        actions={<Button onClick={() => setIsModalOpen(true)}><Plus className="w-4 h-4" /> Add Department</Button>}
      />

      {loading ? (
        <div className="flex justify-center p-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {departments.length > 0 ? (
             departments.map((dept) => <DepartmentCard key={dept._id} dept={dept} />)
          ) : (
             <div className="col-span-full text-center py-12 text-gray-500">
                <p>No departments found. Click "Add Department" to get started.</p>
             </div>
          )}
        </div>
      )}

      <AddDepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDepartmentAdded={fetchDepartments}
      />
    </>
  );
};

export default DepartmentsPage;