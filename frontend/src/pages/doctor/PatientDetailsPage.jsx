import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import moment from 'moment';

// UI Components
import Spinner from '@/components/ui/Spinner';
import PageHeader from '@/components/ui/PageHeader';
import Modal from '@/components/ui/Modal';

// EMR Components (New Structure)
import EnhancedPatientInfoHeader from '@/components/doctor/emr/PatientInfoHeader';
import EnhancedEMRTabs from '@/components/doctor/emr/EMRTabs';
import TabOverview from '@/components/doctor/emr/TabOverview';
import EnhancedTabClinicalActions from '@/components/doctor/emr/TabClinicalActions';
import TabLiveVitals from '@/components/doctor/emr/TabLiveVitals';
import TabFlowChart from '@/components/doctor/emr/TabFlowChart';
import TabDocuments from '@/components/doctor/emr/TabDocuments';
import TabPatientInfo from '@/components/doctor/emr/TabPatientInfo';
import TabTimeline from '@/components/doctor/emr/TabTimeline';

// Form Modals
import ClinicalNoteForm from '@/components/doctor/ClinicalNoteForm';
import PrescriptionForm from '@/components/doctor/PrescriptionForm';

const PatientDetailsPage = () => {
    const { patientLoginId } = useParams();
    const [patient, setPatient] = useState(null);
    const [clinicalData, setClinicalData] = useState({ appointments: [], records: [], notes: [], prescriptions: [] });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const [isPrescriptionModalOpen, setIsPrescriptionModalOpen] = useState(false);

    const fetchData = useCallback(async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const patientRes = await apiService.getDetails('patient', { patientId: patientLoginId });
            if (!patientRes.success || patientRes.user.length === 0) {
                toast.error("Patient not found.");
                setPatient(null);
                return;
            }
            
            const fetchedPatient = patientRes.user[0];
            setPatient(fetchedPatient);

            const [apptRes, recordRes, clinicalRes] = await Promise.all([
                apiService.getAppointments({ patientId: fetchedPatient._id }),
                apiService.getPatientRecords(patientLoginId),
                apiService.request(`/doctor/patients/${fetchedPatient._id}`)
            ]);
            
            setClinicalData({
                appointments: apptRes.appointments || [],
                records: recordRes.record || [],
                notes: clinicalRes.notes || [],
                prescriptions: clinicalRes.prescriptions || [],
            });

        } catch (error) {
            toast.error("Failed to load patient data.");
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [patientLoginId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSuccess = () => {
        setIsNoteModalOpen(false);
        setIsPrescriptionModalOpen(false);
        toast.success('Patient record updated successfully!');
        fetchData(false);
    };

    const notificationCounts = useMemo(() => ({
        // Example logic for notification counts on tabs
        records: clinicalData.records?.filter(r => !r.isViewed).length || 0,
        actions: clinicalData.appointments?.filter(a => moment(a.appointmentDate).isSame(moment(), 'day')).length || 0,
    }), [clinicalData]);

    if (loading) return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><Spinner size="lg" /></div>;
    if (!patient) return <PageHeader title="Patient Not Found" subtitle="The patient ID you are looking for does not exist." />;

    const renderActiveTab = () => {
        switch (activeTab) {
            case 'overview':
                return <TabOverview patient={patient} clinicalData={clinicalData} />;
            case 'actions':
                return <EnhancedTabClinicalActions 
                            appointments={clinicalData.appointments} 
                            notes={clinicalData.notes} 
                            prescriptions={clinicalData.prescriptions}
                            onAddNote={() => setIsNoteModalOpen(true)}
                            onAddPrescription={() => setIsPrescriptionModalOpen(true)}
                        />;
            case 'vitals':
                return <TabLiveVitals patient={patient} />;
            case 'flowchart':
                return <TabFlowChart patient={patient} />;
            case 'records':
                return <TabDocuments records={clinicalData.records} />;
            case 'details':
                return <TabPatientInfo patient={patient} />;
            case 'timeline':
                return <TabTimeline clinicalData={clinicalData} />;
            default:
                return null;
        }
    };
    
    return (
        <>
            <PageHeader title="Electronic Medical Record" />
            <EnhancedPatientInfoHeader patient={patient} onEdit={() => alert('Edit patient details modal would open here.')} />
            <EnhancedEMRTabs activeTab={activeTab} setActiveTab={setActiveTab} notificationCounts={notificationCounts} />
            <div className="mt-6">{renderActiveTab()}</div>

            <Modal isOpen={isNoteModalOpen} onClose={() => setIsNoteModalOpen(false)} title={`Add Clinical Note for ${patient.firstName}`}>
                <ClinicalNoteForm patientId={patient._id} onNoteAdded={handleSuccess} />
            </Modal>
            <Modal isOpen={isPrescriptionModalOpen} onClose={() => setIsPrescriptionModalOpen(false)} title={`Create Prescription for ${patient.firstName}`}>
                <PrescriptionForm patientId={patient._id} onPrescriptionAdded={handleSuccess} />
            </Modal>
        </>
    );
};

export default PatientDetailsPage;