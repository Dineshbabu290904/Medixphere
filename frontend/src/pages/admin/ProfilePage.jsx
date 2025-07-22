import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button'; 
import ChangePasswordModal from './modals/ChangePasswordModal';
import { User, Mail, Phone, Shield, Edit, Info } from 'lucide-react';
import Card from '@/components/ui/Card';
import EditAdminProfileModal from './modals/EditAdminProfileModal'; 

const ProfilePage = () => {
    const { user: authUser } = useAuth();
    const [adminProfile, setAdminProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchAdminProfile = useCallback(async () => {
        if (!authUser?.loginid) return;

        setLoading(true);
        try {
            const response = await apiService.getDetails('admin', { employeeId: authUser.loginid });
            if (response.success && response.user.length > 0) {
                setAdminProfile(response.user[0]);
            } else {
                toast.error("Could not find your profile.");
                setAdminProfile(null);
            }
        } catch (error) {
            console.error("Failed to load profile:", error);
            toast.error("Failed to load profile.");
        } finally {
            setLoading(false);
        }
    }, [authUser]);

    useEffect(() => {
        fetchAdminProfile();
    }, [fetchAdminProfile]);

    const handleProfileUpdate = () => {
        fetchAdminProfile();
    };

    return (
        <>
            <PageHeader
                title="Admin Profile"
                subtitle="Your personal and contact information."
            />

            {loading ? (
                <div className="flex justify-center mt-16">
                    <Spinner size="lg" />
                </div>
            ) : adminProfile ? (
                <div className="space-y-6">
                    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
                        <div className="relative p-8">
                            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                <div className="relative group">
                                    <img 
                                        src={`${import.meta.env.VITE_MEDIA_LINK}/${adminProfile.profile}`}
                                        alt="Admin Profile" 
                                        className="relative w-40 h-40 rounded-full object-cover ring-4 ring-white shadow-2xl"
                                    />
                                </div>
                                <div className="flex-1 text-center lg:text-left space-y-6">
                                    <div>
                                        <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                            {adminProfile.firstName} {adminProfile.middleName ? `${adminProfile.middleName} ` : ''}{adminProfile.lastName}
                                        </h1>
                                        <p className="text-lg text-gray-600 font-medium">System Administrator</p>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                                            <Shield className="w-5 h-5 text-blue-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Employee ID</p>
                                                <p className="font-mono font-semibold text-gray-800">{adminProfile.employeeId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                                            <Mail className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <a href={`mailto:${adminProfile.email}`} className="font-semibold text-gray-800">{adminProfile.email}</a>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                                            <Phone className="w-5 h-5 text-purple-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="font-semibold text-gray-800">{adminProfile.phoneNumber}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/50">
                                            <Info className="w-5 h-5 text-yellow-600" />
                                            <div>
                                                <p className="text-sm text-gray-500">Gender</p>
                                                <p className="font-semibold text-gray-800">{adminProfile.gender}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4">
                                  <Button variant="secondary" size="sm" onClick={() => setIsEditModalOpen(true)}>
                                    <Edit className="w-4 h-4 mr-2"/> Edit Profile
                                  </Button>
                                </div>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <Card.Header><h3 className="text-xl font-bold text-gray-800">Security Settings</h3></Card.Header>
                        <Card.Body>
                            <Button variant="outline" onClick={() => setIsPasswordModalOpen(true)}>
                                Change Password
                            </Button>
                            <p className="text-sm text-gray-500 mt-2">It's a good practice to periodically update your password.</p>
                        </Card.Body>
                    </Card>
                </div>
            ) : (
                <Card className="text-center text-gray-500 py-12">
                    <p>Could not load profile information.</p>
                </Card>
            )}

            {adminProfile && (
              <>
                <ChangePasswordModal 
                    isOpen={isPasswordModalOpen} 
                    onClose={() => setIsPasswordModalOpen(false)}
                    credentialId={adminProfile?._id}
                    role='admin'
                />
                <EditAdminProfileModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    adminProfile={adminProfile} 
                    onProfileUpdate={handleProfileUpdate}
                />
              </>
            )}
        </>
    );
};

export default ProfilePage;