import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button'; 
import ChangePasswordModal from '../admin/modals/ChangePasswordModal'; // Reusing admin's modal
import { User, Mail, Phone, Shield, Edit, Briefcase, Award, Info } from 'lucide-react'; // Added icons
import Card from '@/components/ui/Card';
import EditDoctorProfileModal from './modals/EditDoctorProfileModal'; // New modal for doctor profile

const ProfilePage = () => {
    const { user: authUser } = useAuth();
    const [doctorProfile, setDoctorProfile] = useState(null); // Changed to doctorProfile
    const [loading, setLoading] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchDoctorProfile = async () => { // Changed function name
        if (authUser?.loginid) {
            setLoading(true);
            try {
                // Fetch using loginid (employeeId) as the identifier for doctors
                const response = await apiService.getDetails('doctor', { employeeId: authUser.loginid });
                if (response.success && response.user.length > 0) {
                    setDoctorProfile(response.user[0]); // Set doctorProfile
                } else {
                    toast.error("Could not find your profile.");
                }
            } catch (error) {
                toast.error("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchDoctorProfile();
    }, [authUser]); // Depend on authUser to refetch if it changes

    // Callback to refetch profile after updates
    const handleProfileUpdate = () => {
        fetchDoctorProfile();
    };

    return (
        <>
            <PageHeader
                title="Doctor Profile"
                subtitle="Your personal and contact information."
                actions={
                    <Button variant="secondary" onClick={() => setIsPasswordModalOpen(true)}>
                        <Edit className="w-4 h-4 mr-2" /> Change Password
                    </Button>
                }
            />

            {loading ? (
                <div className="flex justify-center mt-16">
                    <Spinner size="lg" />
                </div>
            ) : doctorProfile ? ( // Changed to doctorProfile
                <div className="space-y-6">
                    {/* Main Profile Card */}
                    <Card className="overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 border-0 shadow-xl">
                        <div className="relative">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10"></div>

                            <div className="relative p-8">
                                <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">
                                    {/* Profile Image Section */}
                                    <div className="relative group">
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
                                        <img 
                                            src={`${import.meta.env.VITE_MEDIA_LINK}/${doctorProfile.profile}`} // Changed to doctorProfile
                                            alt="Doctor Profile" 
                                            className="relative w-40 h-40 rounded-full object-cover ring-4 ring-white shadow-2xl"
                                        />
                                        <div className="absolute bottom-2 right-2 bg-green-500 w-6 h-6 rounded-full ring-4 ring-white"></div>
                                    </div>

                                    {/* Profile Info Section */}
                                    <div className="flex-1 text-center lg:text-left space-y-6">
                                        <div>
                                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                                Dr. {doctorProfile.firstName} {doctorProfile.middleName ? `${doctorProfile.middleName} ` : ''}{doctorProfile.lastName}
                                            </h1>
                                            <p className="text-lg text-gray-600 font-medium">{doctorProfile.post} in {doctorProfile.department}</p>
                                        </div>

                                        {/* Contact Info Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                                                <div className="p-2 bg-blue-100 rounded-full">
                                                    <Shield className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Employee ID</p>
                                                    <p className="font-mono font-semibold text-gray-800">{doctorProfile.employeeId}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                                                <div className="p-2 bg-green-100 rounded-full">
                                                    <Mail className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Email</p>
                                                    <a href={`mailto:${doctorProfile.email}`} className="font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                                                        {doctorProfile.email}
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                                                <div className="p-2 bg-purple-100 rounded-full">
                                                    <Phone className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Phone Number</p>
                                                    <p className="font-semibold text-gray-800">{doctorProfile.phoneNumber}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20">
                                                <div className="p-2 bg-yellow-100 rounded-full">
                                                    <Briefcase className="w-5 h-5 text-yellow-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Experience</p>
                                                    <p className="font-semibold text-gray-800">{doctorProfile.experience} Years</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg bg-white/50 backdrop-blur-sm border border-white/20 md:col-span-2">
                                                <div className="p-2 bg-orange-100 rounded-full">
                                                    <Info className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500 font-medium">Gender</p>
                                                    <p className="font-semibold text-gray-800">{doctorProfile.gender}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Actions Card */}
                    <Card className="p-6 bg-gradient-to-r from-gray-50 to-blue-50 border-0 shadow-lg">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-800">Quick Actions</h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="group">
                                <Button 
                                    variant="outline" 
                                    className="w-full flex flex-col items-center gap-3 p-6 h-auto bg-white hover:bg-blue-50 hover:border-blue-300 hover:shadow-md transition-all duration-300 group-hover:scale-105"
                                    onClick={() => setIsPasswordModalOpen(true)}
                                >
                                    <div className="p-3 bg-blue-100 rounded-full group-hover:bg-blue-200 transition-colors">
                                        <Edit className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-800">Change Password</p>
                                        <p className="text-sm text-gray-500 mt-1">Update your login credentials</p>
                                    </div>
                                </Button>
                            </div>

                            <div className="group">
                                <Button 
                                    variant="outline" 
                                    className="w-full flex flex-col items-center gap-3 p-6 h-auto bg-white hover:bg-green-50 hover:border-green-300 hover:shadow-md transition-all duration-300 group-hover:scale-105"
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    <div className="p-3 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                                        <User className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="text-center">
                                        <p className="font-semibold text-gray-800">Edit Profile</p>
                                        <p className="text-sm text-gray-500 mt-1">Update personal information</p>
                                    </div>
                                </Button>
                            </div>

                        </div>
                    </Card>
                </div>
            ) : (
                <Card className="text-center text-gray-500 py-12">
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                            <User className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-lg font-medium">Could not load profile information.</p>
                        <p className="text-sm">Please try refreshing the page or contact support.</p>
                    </div>
                </Card>
            )}

            <ChangePasswordModal 
                isOpen={isPasswordModalOpen} 
                onClose={() => setIsPasswordModalOpen(false)} 
            />
            <EditDoctorProfileModal // Use the new modal for doctor profile
                isOpen={isEditModalOpen} 
                onClose={() => setIsEditModalOpen(false)} 
                doctorProfile={doctorProfile} // Pass doctorProfile
                onProfileUpdate={handleProfileUpdate} // Pass the handler
            />
        </>
    );
};

export default ProfilePage;