import React from 'react';
import moment from 'moment';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Plus, Pill, FileText, MoreHorizontal, Download, Stethoscope } from 'lucide-react';
import Badge from '@/components/ui/Badge';

const EnhancedTabClinicalActions = ({ notes, prescriptions, onAddNote, onAddPrescription }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
                <Card.Header><div className="flex justify-between items-center"><div className="flex items-center gap-2"><h3 className="text-lg font-semibold">Clinical Notes</h3><Badge variant="secondary">{notes.length}</Badge></div><Button size="sm" variant="ghost" onClick={onAddNote}><Plus className="w-4 h-4" /> New</Button></div></Card.Header>
                <Card.Body className="max-h-[60vh] overflow-y-auto space-y-4">
                    {notes.length > 0 ? notes.map(note => (
                        <div key={note._id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700">
                            <div className="flex justify-between items-start mb-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center"><Stethoscope className="w-4 h-4 text-blue-600" /></div><div><p className="font-medium text-sm">Dr. {note.doctorId?.firstName}</p><p className="text-xs text-gray-500">{moment(note.createdAt).format('lll')}</p></div></div><Button size="sm" variant="ghost"><MoreHorizontal className="w-4 h-4" /></Button></div>
                            <div className="space-y-2"><p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Assessment</p><p className="text-sm text-gray-700 dark:text-gray-300">{note.assessment}</p><p className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Plan</p><p className="text-sm text-gray-700 dark:text-gray-300">{note.plan}</p></div>
                        </div>
                    )) : <div className="text-center py-8"><FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 mb-3">No clinical notes recorded</p><Button size="sm" onClick={onAddNote}><Plus className="w-4 h-4 mr-2" />Add First Note</Button></div>}
                </Card.Body>
            </Card>

            <Card>
                <Card.Header><div className="flex justify-between items-center"><div className="flex items-center gap-2"><h3 className="text-lg font-semibold">Prescriptions</h3><Badge variant="secondary">{prescriptions.length}</Badge></div><Button size="sm" variant="ghost" onClick={onAddPrescription}><Plus className="w-4 h-4" /> New</Button></div></Card.Header>
                <Card.Body className="max-h-[60vh] overflow-y-auto space-y-4">
                    {prescriptions.length > 0 ? prescriptions.map(pres => (
                        <div key={pres._id} className="p-4 bg-gray-50 dark:bg-slate-800/50 rounded-lg border dark:border-slate-700">
                            <div className="flex justify-between items-start mb-3"><div className="flex items-center gap-2"><div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center"><Pill className="w-4 h-4 text-green-600" /></div><div><p className="font-medium text-sm">Dr. {pres.doctor?.firstName}</p><p className="text-xs text-gray-500">{moment(pres.date).format('LL')}</p></div></div><Button size="sm" variant="ghost"><Download className="w-4 h-4" /></Button></div>
                            <div className="space-y-2">{pres.medications?.map((med, i) => (<div key={i} className="flex items-center justify-between p-2 bg-white dark:bg-slate-700 rounded"><div><p className="font-medium text-sm">{med.name}</p><p className="text-xs text-gray-500">{med.dosage} - {med.frequency}</p></div><Badge variant="outline" size="sm">{med.duration || 'N/A'}</Badge></div>))}</div>
                        </div>
                    )) : <div className="text-center py-8"><Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" /><p className="text-gray-500 mb-3">No prescriptions found</p><Button size="sm" onClick={onAddPrescription}><Plus className="w-4 h-4 mr-2" />Create Prescription</Button></div>}
                </Card.Body>
            </Card>
        </div>
    );
};

export default EnhancedTabClinicalActions;