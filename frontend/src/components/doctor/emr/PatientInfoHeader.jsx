import React from 'react';
import moment from 'moment';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { 
  User, Mail, Phone, Calendar, MapPin, Edit, Download, Share2, Printer, AlertTriangle 
} from 'lucide-react';

const EnhancedPatientInfoHeader = ({ patient, onEdit }) => {
    if (!patient) return null;

    const age = moment().diff(moment(patient.dateOfBirth), 'years');
    // Mock data for demonstration, this should come from the patient model
    const isHighRisk = (patient.allergies && patient.allergies.length > 0) || (patient.chronicConditions && patient.chronicConditions.length > 0);

    return (
        <Card className="mb-6 relative overflow-hidden">
            {isHighRisk && (
                <div className="absolute top-0 left-0 right-0 bg-red-100 border-b border-red-200 px-4 py-2 z-10">
                    <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">High Risk Patient - Check Allergies & Conditions</span>
                    </div>
                </div>
            )}
            
            <div className={`p-6 ${isHighRisk ? 'pt-16' : ''}`}>
                <div className="flex flex-col lg:flex-row items-start gap-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 flex-shrink-0">
                        <div className="relative">
                            <img 
                                src={`${import.meta.env.VITE_MEDIA_LINK}/${patient.profile}`} 
                                alt={`${patient.firstName} ${patient.lastName}`} 
                                className="w-32 h-32 rounded-full object-cover ring-4 ring-blue-100 shadow-lg" 
                            />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                                {patient.firstName} {patient.middleName && `${patient.middleName} `}{patient.lastName}
                            </h1>
                            <p className="text-gray-500 font-mono text-lg mb-2">ID: {patient.patientId}</p>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                                <Badge variant="secondary">{age} years old</Badge>
                                <Badge variant="outline">{patient.gender}</Badge>
                                <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                                    {patient.bloodGroup}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"><Mail className="w-5 h-5 text-gray-500" /><div><p className="text-xs text-gray-500">Email</p><p className="text-sm font-medium truncate">{patient.email || 'N/A'}</p></div></div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"><Phone className="w-5 h-5 text-gray-500" /><div><p className="text-xs text-gray-500">Phone</p><p className="text-sm font-medium">{patient.phoneNumber}</p></div></div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"><Calendar className="w-5 h-5 text-gray-500" /><div><p className="text-xs text-gray-500">Date of Birth</p><p className="text-sm font-medium">{moment(patient.dateOfBirth).format('MMM DD, YYYY')}</p></div></div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-800 rounded-lg"><MapPin className="w-5 h-5 text-gray-500" /><div><p className="text-xs text-gray-500">Location</p><p className="text-sm font-medium truncate">{patient.address || 'N/A'}</p></div></div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button size="sm" onClick={onEdit}><Edit className="w-4 h-4 mr-1" />Edit</Button>
                            <Button size="sm" variant="outline"><Download className="w-4 h-4 mr-1" />Export EMR</Button>
                            <Button size="sm" variant="outline"><Share2 className="w-4 h-4 mr-1" />Share</Button>
                            <Button size="sm" variant="outline"><Printer className="w-4 h-4 mr-1" />Print</Button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default EnhancedPatientInfoHeader;