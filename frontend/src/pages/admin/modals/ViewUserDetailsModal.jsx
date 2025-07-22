import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';
import { User, Mail, Phone, Droplet, Calendar, Briefcase, Award, Hash, MapPin, Info, Users } from 'lucide-react';

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-2">
    <Icon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value || 'N/A'}</p>
    </div>
  </div>
);

const ViewUserDetailsModal = ({ isOpen, onClose, user, userType }) => {
  if (!user) return null;

  const isDoctor = userType === 'doctor';
  const isAdmin = userType === 'admin';
  const isPatient = userType === 'patient';
  
  const fullName = `${user.firstName} ${user.middleName ? user.middleName + ' ' : ''}${user.lastName}`;
  const title = isDoctor ? `Dr. ${fullName}` : fullName;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${isDoctor ? 'Doctor' : isAdmin ? 'Admin' : 'Patient'} Details`} size="lg">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img 
          src={`${import.meta.env.VITE_MEDIA_LINK}/${user.profile}`} 
          alt={fullName}
          className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-100 shadow-lg flex-shrink-0"
        />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <p className="font-mono text-gray-500">{isPatient ? user.patientId : user.employeeId}</p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
            <DetailItem icon={Mail} label="Email" value={user.email} />
            <DetailItem icon={Phone} label="Phone" value={user.phoneNumber} />
            <DetailItem icon={Info} label="Gender" value={user.gender} />

            {isDoctor && (
              <>
                <DetailItem icon={Briefcase} label="Department" value={user.department} />
                <DetailItem icon={Award} label="Experience" value={`${user.experience} years`} />
                <DetailItem icon={Hash} label="Designation" value={user.post} />
              </>
            )}

            {isPatient && (
              <>
                <DetailItem icon={Calendar} label="Date of Birth" value={new Date(user.dateOfBirth).toLocaleDateString()} />
                <DetailItem icon={Droplet} label="Blood Group" value={user.bloodGroup} />
                <div className="md:col-span-2">
                    <DetailItem icon={MapPin} label="Address" value={user.address} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {isPatient && user.family && user.family.length > 1 && (
        <div className="mt-6 pt-4 border-t">
            <h4 className="text-md font-semibold text-gray-700 mb-2 flex items-center gap-2"><Users className="w-5 h-5 text-gray-500"/> Family Members</h4>
            <div className="pl-3 space-y-2">
                {user.family.map((member, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50/80">
                        <User className="w-4 h-4 text-gray-500"/>
                        <div className="flex-1">
                          <span className="font-medium text-gray-800 text-sm">
                            {member.patientId?.firstName ? `${member.patientId.firstName} ${member.patientId.lastName}` : 'N/A'}
                          </span>
                          <span className="text-gray-600 text-xs"> ({member.relationship})</span>
                        </div>
                        {member.isPrimaryContact && <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Primary</span>}
                    </div>
                ))}
            </div>
        </div>
      )}

      <div className="flex justify-end pt-6 mt-6 border-t">
        <Button variant="secondary" onClick={onClose}>Close</Button>
      </div>
    </Modal>
  );
};

export default ViewUserDetailsModal;