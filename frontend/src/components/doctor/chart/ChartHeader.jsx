import React from 'react';

// Reusable EditableField component
const EditableField = ({ label, value, onUpdate, type = "text", readOnly = false }) => (
    <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-500">{label}:</span>
        <input 
            type={type} 
            defaultValue={value}
            onBlur={(e) => !readOnly && onUpdate(e.target.value)}
            readOnly={readOnly}
            className={`font-semibold text-gray-800 bg-gray-100 rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 outline-none ${readOnly ? 'cursor-default' : ''}`}
        />
    </div>
);

const ChartHeader = ({ patient, chartData, onUpdate }) => {
  // Extract top-level chart fields directly from chartData, which handles null/initial state
  const { weight, bed_no, diagnosis, primary_consultant, days_in_icu, intropes, operation_performed, post_op_day } = chartData || {};

  return (
    <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
        <div><span className="font-medium text-gray-500">Patient:</span> <span className="font-bold text-lg text-gray-800">{patient.firstName} {patient.lastName}</span></div>
        <div><span className="font-medium text-gray-500">Patient ID:</span> <span className="font-semibold text-gray-700">{patient.patientId}</span></div>
        <EditableField label="Weight" value={weight || ''} onUpdate={(val) => onUpdate({ weight: val })} />
        <EditableField label="Age/Sex" value={patient.dateOfBirth ? `${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}Y / ${patient.gender.charAt(0)}` : 'N/A'} readOnly />
        <EditableField label="Bed No" value={bed_no || ''} onUpdate={(val) => onUpdate({ bed_no: val })} />
        <EditableField label="Diagnosis" value={diagnosis || ''} onUpdate={(val) => onUpdate({ diagnosis: val })} />
        <EditableField label="Consultant" value={primary_consultant || ''} onUpdate={(val) => onUpdate({ primary_consultant: val })} />
        <EditableField label="Days in ICU" value={days_in_icu || ''} onUpdate={(val) => onUpdate({ days_in_icu: parseInt(val) || 0 })} type="number" />
        <EditableField label="Intropes" value={intropes || ''} onUpdate={(val) => onUpdate({ intropes: val })} />
        <EditableField label="Operation Performed" value={operation_performed || ''} onUpdate={(val) => onUpdate({ operation_performed: val })} />
        <EditableField label="Post Op Day" value={post_op_day || ''} onUpdate={(val) => onUpdate({ post_op_day: parseInt(val) || 0 })} type="number" />
      </div>
    </div>
  );
};

export default ChartHeader;