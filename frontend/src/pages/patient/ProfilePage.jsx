import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Edit } from 'lucide-react';
import ChangePasswordModal from '../admin/modals/ChangePasswordModal'; // Reusing modal

const ProfilePage = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const fetchProfile = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiService.getDetails('patient', { _id: user.id });
            if (res.success && res.user.length > 0) {
                setProfile(res.user[0]);
            }
        } catch (error) { /* Handled globally */ } 
        finally { setLoading(false); }
    }, [user.id]);

    useEffect(() => { fetchProfile(); }, [fetchProfile]);
    
    if (loading) return <div className="flex justify-center py-16"><Spinner size="lg" /></div>;

    return (
        <>
            <PageHeader
                title="My Profile"
                subtitle="View and manage your personal information."
            />
            {profile ? (
                <div className="space-y-6">
                    <Card>
                        <Card.Header>
                            <div className="flex justify-between items-center">
                                <h3 className="text-xl font-bold">Personal Details</h3>
                                <Button variant="outline" size="sm"><Edit className="w-4 h-4 mr-2"/> Edit Profile</Button>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <p><strong>Name:</strong> {profile.firstName} {profile.lastName}</p>
                                <p><strong>Patient ID:</strong> {profile.patientId}</p>
                                <p><strong>Email:</strong> {profile.email}</p>
                                <p><strong>Phone:</strong> {profile.phoneNumber}</p>
                                <p><strong>Gender:</strong> {profile.gender}</p>
                                <p><strong>Blood Group:</strong> {profile.bloodGroup}</p>
                            </div>
                        </Card.Body>
                    </Card>
                     <Card>
                        <Card.Header><h3 className="text-xl font-bold">Security</h3></Card.Header>
                        <Card.Body>
                            <Button onClick={() => setIsPasswordModalOpen(true)}>Change Password</Button>
                        </Card.Body>
                    </Card>
                </div>
            ) : <p>Could not load profile.</p>}

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                role="patient"
                credentialId={profile?._id} // Pass the _id of the credential document
            />
        </>
    );
};

export default ProfilePage;