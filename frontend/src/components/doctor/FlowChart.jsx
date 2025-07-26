import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Save, RefreshCw, AlertTriangle, TrendingUp, Clock, User, Trash2 } from 'lucide-react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import Card from '../ui/Card'; // Import Card for the empty state
import { Plus } from 'lucide-react'; // Import Plus for the empty state button


const FlowChart = ({ patient = { patientId: 'P001', firstName: 'John', lastName: 'Doe', dateOfBirth: '1980-01-01', gender: 'Male' } }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [pendingChanges, setPendingChanges] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  const fetchChart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getCriticalCareChart(patient.patientId);
      const initialData = response.chart || { 
        patientId: patient.patientId, 
        days: [],
        weight: '', bed_no: '', primary_consultant: '', days_in_icu: 0, 
        intropes: '', diagnosis: '', operation_performed: '', post_op_day: 0
      };
      setChartData(initialData);
      setPendingChanges({});
    } catch (error) {
      toast.error("Failed to load chart data");
      setChartData(null);
    } finally {
      setLoading(false);
    }
  }, [patient.patientId]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  const handleHeaderUpdate = async (updates) => {
    setSaving(true);
    try {
      const response = await apiService.updateCriticalCareHeader(patient.patientId, updates);
      setChartData(response.chart);
      toast.success("Header updated successfully");
      setLastSaved(new Date());
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleDayDataUpdate = async (dayData) => {
    setSaving(true);
    try {
      const response = await apiService.updateCriticalCareDayData(patient.patientId, dayData);
      setChartData(response.chart);
      toast.success("Day data updated successfully");
      setLastSaved(new Date());
    } catch (error) {
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteTimeSlot = async (time) => {
    if (!window.confirm(`Are you sure you want to delete all data for ${time} on this date? This action cannot be undone.`)) {
      return;
    }

    setSaving(true);
    try {
      const day = chartData.days.find(d => d.date && new Date(d.date).toISOString().split('T')[0] === date);
      if (!day) {
        throw new Error("Could not find the current day's data.");
      }

      const slot = day.timeSlots.find(ts => ts.time === time);
      if (!slot) {
        toast.error(`No saved data to delete for ${time}.`);
        setSaving(false);
        return;
      }

      const response = await apiService.deleteCriticalCareTimeSlot(patient.patientId, day._id, slot._id);
      setChartData(response.chart);
      toast.success(`Time slot ${time} deleted successfully.`);
      setLastSaved(new Date());
    } catch (error) {
      toast.error(`Delete failed: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (date, time, field, value) => {
    const key = `${date}-${time}`;
    setPendingChanges(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        date,
        time,
        [field]: value
      }
    }));
  };

  const submitPendingChanges = async () => {
    if (Object.keys(pendingChanges).length === 0) {
      toast.error("No changes to save");
      return;
    }

    setSaving(true);
    try {
      for (const change of Object.values(pendingChanges)) {
        await apiService.upsertCriticalCareTimeSlot(patient.patientId, change);
      }
      await fetchChart(); // Refresh data to get the latest chart state
      toast.success(`Successfully saved ${Object.keys(pendingChanges).length} changes`);
      setPendingChanges({});
      setLastSaved(new Date());
    } catch (error) {
      toast.error(`Failed to save changes: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-3">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
          <span className="text-lg text-gray-600">Loading chart data...</span>
        </div>
      </div>
    );
  }

  if (!chartData) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-600">Could not load Flow Chart</h3>
        <p className="text-gray-600 mt-2">There was an error fetching the data for this patient.</p>
        <button 
          onClick={fetchChart}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const dayData = chartData?.days?.find(d => d.date && new Date(d.date).toISOString().split('T')[0] === date);
  const timeSlots = dayData?.timeSlots || [];
  const hasPendingChanges = Object.keys(pendingChanges).length > 0;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold flex items-center">
            <TrendingUp className="w-8 h-8 mr-3" />
            Critical Care Flow Chart
          </h1>
          <div className="flex items-center space-x-4">
            {lastSaved && (
              <span className="text-blue-100 text-sm flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Last saved: {lastSaved.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchChart}
              disabled={loading}
              className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        
        <ChartHeader 
          patient={patient} 
          chartData={chartData} 
          onUpdate={handleHeaderUpdate}
          saving={saving}
        />
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <label className="font-medium text-gray-700">Date:</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {hasPendingChanges && (
            <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-md">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">
                {Object.keys(pendingChanges).length} unsaved changes
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setPendingChanges({})}
            disabled={!hasPendingChanges || saving}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Discard Changes
          </button>
          
          <button
            onClick={submitPendingChanges}
            disabled={!hasPendingChanges || saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>
      </div>

      {/* Chart Grids */}
      <div className="space-y-6">
        <VitalsGrid 
          dayData={dayData} 
          timeSlots={timeSlots} 
          date={date}
          onInputChange={handleInputChange}
          onDeleteTimeSlot={handleDeleteTimeSlot}
          pendingChanges={pendingChanges}
        />
        
        <GcsGrid 
          dayData={dayData} 
          timeSlots={timeSlots} 
          date={date}
          onInputChange={handleInputChange}
          onDeleteTimeSlot={handleDeleteTimeSlot}
          pendingChanges={pendingChanges}
        />
        
        <IntakeOutputGrid 
          dayData={dayData} 
          timeSlots={timeSlots} 
          date={date}
          onInputChange={handleInputChange}
          onDeleteTimeSlot={handleDeleteTimeSlot}
          pendingChanges={pendingChanges}
        />
        
        <NursingCareGrid 
          dayData={dayData} 
          timeSlots={timeSlots} 
          date={date}
          onInputChange={handleInputChange}
          onDeleteTimeSlot={handleDeleteTimeSlot}
          pendingChanges={pendingChanges}
        />
        
        <VentilatorGrid 
          dayData={dayData} 
          timeSlots={timeSlots} 
          date={date}
          onInputChange={handleInputChange}
          onDeleteTimeSlot={handleDeleteTimeSlot}
          pendingChanges={pendingChanges}
        />
      </div>

      {/* Dynamic Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DynamicTable 
          title="I.V. Fluids" 
          headers={["Fluid & Drug", "Vol. Started", "Rate", "Start", "Stop", "Total Vol.", "Nurse"]}
          data={dayData?.iv_fluids || []}
          fields={["name", "volume_started", "rate", "time_start", "time_stop", "total_volume", "nurse_signature"]}
          onUpdate={(newData) => handleDayDataUpdate({ date, iv_fluids: newData })}
        />
        
        <DynamicTable 
          title="Drugs Administered"
          headers={["Drug", "Dose", "Time", "Route", "Freq", "Sign", "Ordered By"]}
          data={dayData?.drugs_administered || []}
          fields={["drug", "dose", "time", "route", "frequency", "nurse_sign", "ordered_by"]}
          onUpdate={(newData) => handleDayDataUpdate({ date, drugs_administered: newData })}
        />
      </div>
    </div>
  );
};

// Enhanced Chart Header Component
const ChartHeader = ({ patient, chartData, onUpdate, saving }) => {
  const [localData, setLocalData] = useState({});
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (field, value) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSubmit = () => {
    if (hasChanges) {
      onUpdate(localData);
      setLocalData({});
      setHasChanges(false);
    }
  };

  const getCurrentValue = (field) => {
    return localData[field] !== undefined ? localData[field] : (chartData?.[field] || '');
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-1">
          <span className="text-sm text-blue-100">Patient:</span>
          <div className="font-bold text-lg">{patient.firstName} {patient.lastName}</div>
        </div>
        
        <div className="space-y-1">
          <span className="text-sm text-blue-100">Patient ID:</span>
          <div className="font-semibold">{patient.patientId}</div>
        </div>

        <EditableField 
          label="Weight" 
          value={getCurrentValue('weight')} 
          onChange={(val) => handleChange('weight', val)}
          placeholder="e.g., 70kg"
        />
        
        <div className="space-y-1">
          <span className="text-sm text-blue-100">Age/Sex:</span>
          <div className="font-semibold">
            {patient.dateOfBirth ? `${new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()}Y / ${patient.gender.charAt(0)}` : 'N/A'}
          </div>
        </div>

        <EditableField 
          label="Bed No" 
          value={getCurrentValue('bed_no')} 
          onChange={(val) => handleChange('bed_no', val)}
          placeholder="e.g., ICU-101"
        />
        
        <EditableField 
          label="Diagnosis" 
          value={getCurrentValue('diagnosis')} 
          onChange={(val) => handleChange('diagnosis', val)}
          placeholder="Primary diagnosis"
        />
        
        <EditableField 
          label="Consultant" 
          value={getCurrentValue('primary_consultant')} 
          onChange={(val) => handleChange('primary_consultant', val)}
          placeholder="Dr. Name"
        />
        
        <EditableField 
          label="Days in ICU" 
          value={getCurrentValue('days_in_icu')} 
          onChange={(val) => handleChange('days_in_icu', parseInt(val) || 0)}
          type="number"
          placeholder="0"
        />

        <EditableField 
          label="Intropes" 
          value={getCurrentValue('intropes')} 
          onChange={(val) => handleChange('intropes', val)}
          placeholder="e.g., Noradrenaline dose"
        />
        
        <EditableField 
          label="Operation" 
          value={getCurrentValue('operation_performed')} 
          onChange={(val) => handleChange('operation_performed', val)}
          placeholder="Procedure performed"
        />
        
        <EditableField 
          label="Post Op Day" 
          value={getCurrentValue('post_op_day')} 
          onChange={(val) => handleChange('post_op_day', parseInt(val) || 0)}
          type="number"
          placeholder="0"
        />
      </div>

      {hasChanges && (
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/20">
          <button
            onClick={() => {
              setLocalData({});
              setHasChanges(false);
            }}
            className="px-4 py-2 text-white/80 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-white text-blue-600 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{saving ? 'Saving...' : 'Update Header'}</span>
          </button>
        </div>
      )}
    </div>
  );
};

// Reusable Editable Field Component
const EditableField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div className="space-y-1">
    <span className="text-sm text-blue-100">{label}:</span>
    <input 
      type={type} 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-white/50 focus:bg-white/20 focus:border-white/40 focus:outline-none transition-colors"
    />
  </div>
);

// Generic Grid Header Component for reusability
const GridHeaderCell = ({ hour, timeSlots, onDeleteTimeSlot }) => {
  const isDayShift = parseInt(hour.split(':')[0]) >= 7 && parseInt(hour.split(':')[0]) < 19;
  const slotExists = timeSlots.some(ts => ts.time === hour);

  return (
    <th className={`p-2 text-center font-medium text-xs min-w-[80px] relative group ${
      isDayShift ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
    }`}>
      {hour}
      {slotExists && (
        <button
          onClick={() => onDeleteTimeSlot(hour)}
          className="absolute -top-1 -right-1 p-0.5 bg-red-100 text-red-600 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-200 transition-all z-10"
          title={`Delete all data for ${hour}`}
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </th>
  );
};

// Enhanced Vitals Grid Component
const VitalsGrid = ({ dayData, timeSlots, date, onInputChange, onDeleteTimeSlot, pendingChanges }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const vitalFields = [
    { key: 'pulse', label: 'Pulse (BPM)', type: 'number', min: 30, max: 200 },
    { key: 'bp_systolic', label: 'BP Sys (mmHg)', type: 'number', min: 70, max: 250 },
    { key: 'bp_diastolic', label: 'BP Dias (mmHg)', type: 'number', min: 40, max: 150 },
    { key: 'temp', label: 'Temp (°F)', type: 'number', min: 95, max: 110, step: 0.1 },
    { key: 'spo2', label: 'SpO2 (%)', type: 'number', min: 70, max: 100 },
    { key: 'cvp', label: 'CVP (mmHg)', type: 'number', min: -5, max: 25 },
    { key: 'rhythm', label: 'Rhythm', type: 'text' },
  ];

  const getValue = (time, field) => {
    const changeKey = `${date}-${time}`;
    if (pendingChanges[changeKey]?.vitals?.[field] !== undefined) {
      return pendingChanges[changeKey].vitals[field];
    }
    return timeSlots.find(ts => ts.time === time)?.vitals?.[field] || '';
  };

  const handleChange = (time, field, value) => {
    const processedValue = vitalFields.find(f => f.key === field)?.type === 'number' ? 
      (value === '' ? '' : parseFloat(value)) : value;
    onInputChange(date, time, 'vitals', { [field]: processedValue });
  };

  const getSpO2Status = (value) => {
    if (!value || value === '') return '';
    if (value < 90) return 'bg-red-100 border-red-300 text-red-800';
    if (value < 94) return 'bg-yellow-100 border-yellow-300 text-yellow-800';
    return 'bg-green-100 border-green-300 text-green-800';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Vital Signs (Hourly)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 p-3 text-left font-semibold text-gray-700 border-r">
                Parameter
              </th>
              {hours.map(hour => <GridHeaderCell key={hour} hour={hour} timeSlots={timeSlots} onDeleteTimeSlot={onDeleteTimeSlot} />)}
            </tr>
          </thead>
          <tbody>
            {vitalFields.map(({ key, label, type, min, max, step }) => (
              <tr key={key} className="hover:bg-gray-50 border-b">
                <td className="sticky left-0 bg-white p-3 font-medium text-gray-700 border-r">
                  {label}
                </td>
                {hours.map(hour => {
                  const value = getValue(hour, key);
                  const hasChange = pendingChanges[`${date}-${hour}`]?.vitals?.[key] !== undefined;
                  const cellClass = key === 'spo2' ? getSpO2Status(value) : '';
                  
                  return (
                    <td key={`${key}-${hour}`} className={`p-1 ${cellClass}`}>
                      <input
                        type={type}
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={(e) => handleChange(hour, key, e.target.value)}
                        className={`w-full p-2 text-center border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                          hasChange ? 'bg-yellow-50 border-yellow-300' : 'border-gray-200'
                        } ${cellClass ? 'font-semibold' : ''}`}
                        placeholder="--"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Enhanced GCS Grid Component
const GcsGrid = ({ dayData, timeSlots, date, onInputChange, onDeleteTimeSlot, pendingChanges }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const gcsFields = [
    { key: 'eye', label: 'Eye Opening', max: 4, descriptions: ['None', 'To pain', 'To voice', 'Spontaneous'] },
    { key: 'verbal', label: 'Verbal Response', max: 5, descriptions: ['None', 'Sounds', 'Words', 'Confused', 'Oriented'] },
    { key: 'motor', label: 'Motor Response', max: 6, descriptions: ['None', 'Extension', 'Flexion', 'Withdrawal', 'Localizes', 'Obeys'] },
  ];

  const getValue = (time, field) => {
    const changeKey = `${date}-${time}`;
    if (pendingChanges[changeKey]?.gcs?.[field] !== undefined) {
      return pendingChanges[changeKey].gcs[field];
    }
    return timeSlots.find(ts => ts.time === time)?.gcs?.[field] || '';
  };

  const handleChange = (time, field, value) => {
    const numValue = value === '' ? '' : parseInt(value);
    onInputChange(date, time, 'gcs', { [field]: numValue });
  };

  const calculateTotalGCS = (time) => {
    const eye = getValue(time, 'eye') || 0;
    const verbal = getValue(time, 'verbal') || 0;
    const motor = getValue(time, 'motor') || 0;
    const total = eye + verbal + motor;
    return total > 0 ? total : '';
  };

  const getGCSStatus = (total) => {
    if (!total) return '';
    if (total <= 8) return 'bg-red-100 text-red-800 font-bold';
    if (total <= 12) return 'bg-yellow-100 text-yellow-800 font-semibold';
    return 'bg-green-100 text-green-800 font-semibold';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <User className="w-5 h-5 mr-2" />
          Glasgow Coma Scale (GCS)
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 p-3 text-left font-semibold text-gray-700 border-r">
                Component
              </th>
              {hours.map(hour => <GridHeaderCell key={hour} hour={hour} timeSlots={timeSlots} onDeleteTimeSlot={onDeleteTimeSlot} />)}
            </tr>
          </thead>
          <tbody>
            {gcsFields.map(({ key, label, max }) => (
              <tr key={key} className="hover:bg-gray-50 border-b">
                <td className="sticky left-0 bg-white p-3 font-medium text-gray-700 border-r">
                  <div>{label}</div>
                  <div className="text-xs text-gray-500">(Max {max})</div>
                </td>
                {hours.map(hour => {
                  const value = getValue(hour, key);
                  const hasChange = pendingChanges[`${date}-${hour}`]?.gcs?.[key] !== undefined;
                  
                  return (
                    <td key={`${key}-${hour}`} className="p-1">
                      <input
                        type="number"
                        min="0"
                        max={max}
                        value={value}
                        onChange={(e) => handleChange(hour, key, e.target.value)}
                        className={`w-full p-2 text-center border rounded focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none ${
                          hasChange ? 'bg-yellow-50 border-yellow-300' : 'border-gray-200'
                        }`}
                        placeholder="--"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-gradient-to-r from-gray-50 to-gray-100 border-t-2 border-gray-300">
              <td className="sticky left-0 bg-gray-100 p-3 font-bold text-gray-800 border-r">
                Total GCS
              </td>
              {hours.map(hour => {
                const total = calculateTotalGCS(hour);
                return (
                  <td key={`total-${hour}`} className={`p-3 text-center text-lg font-bold ${getGCSStatus(total)}`}>
                    {total || '--'}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ... (Rest of the file remains the same, but the grid components will be updated)
// NOTE: For brevity, I will only show the remaining grid component definitions with the header change.

// Enhanced Intake Output Grid Component
const IntakeOutputGrid = ({ dayData, timeSlots, date, onInputChange, onDeleteTimeSlot, pendingChanges }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const ioFields = [
    { key: 'hourly_iv', label: 'IV Infusion (mL)', type: 'input' },
    { key: 'oral_feed', label: 'Oral Feed (mL)', type: 'input' },
    { key: 'urine', label: 'Urine (mL)', type: 'output' },
    { key: 'drainage', label: 'Drainage (mL)', type: 'output' },
  ];

  const getValue = (time, field) => {
    const changeKey = `${date}-${time}`;
    if (pendingChanges[changeKey]?.intake_output?.[field] !== undefined) {
      return pendingChanges[changeKey].intake_output[field];
    }
    return timeSlots.find(ts => ts.time === time)?.intake_output?.[field] || '';
  };

  const handleChange = (time, field, value) => {
    const numValue = value === '' ? '' : parseFloat(value);
    onInputChange(date, time, 'intake_output', { [field]: numValue });
  };

  const calculateTotals = (type) => {
    return hours.map(hour => {
      const values = ioFields
        .filter(field => field.type === type)
        .map(field => getValue(hour, field.key))
        .filter(val => val !== '' && !isNaN(val));
      
      return values.length > 0 ? values.reduce((sum, val) => sum + val, 0) : '';
    });
  };

  const inputTotals = calculateTotals('input');
  const outputTotals = calculateTotals('output');

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Intake & Output (Hourly)
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 p-3 text-left font-semibold text-gray-700 border-r">
                Parameter
              </th>
              {hours.map(hour => <GridHeaderCell key={hour} hour={hour} timeSlots={timeSlots} onDeleteTimeSlot={onDeleteTimeSlot} />)}
            </tr>
          </thead>
          <tbody>
            {ioFields.map(({ key, label, type }) => (
              <tr key={key} className="hover:bg-gray-50 border-b">
                <td className={`sticky left-0 bg-white p-3 font-medium border-r ${type === 'input' ? 'text-green-700' : 'text-blue-700'}`}>
                  {label}
                </td>
                {hours.map(hour => {
                  const value = getValue(hour, key);
                  const hasChange = pendingChanges[`${date}-${hour}`]?.intake_output?.[key] !== undefined;
                  return (
                    <td key={`${key}-${hour}`} className="p-1">
                      <input
                        type="number" min="0" value={value}
                        onChange={(e) => handleChange(hour, key, e.target.value)}
                        className={`w-full p-2 text-center border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none ${hasChange ? 'bg-yellow-50 border-yellow-300' : 'border-gray-200'}`}
                        placeholder="--"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
            <tr className="bg-green-50 border-t-2 border-green-200">
              <td className="sticky left-0 bg-green-100 p-3 font-bold text-green-800 border-r">Total Input</td>
              {inputTotals.map((total, index) => (<td key={`input-total-${index}`} className="p-3 text-center font-bold text-green-700">{total || '--'}</td>))}
            </tr>
            <tr className="bg-blue-50 border-t border-blue-200">
              <td className="sticky left-0 bg-blue-100 p-3 font-bold text-blue-800 border-r">Total Output</td>
              {outputTotals.map((total, index) => (<td key={`output-total-${index}`} className="p-3 text-center font-bold text-blue-700">{total || '--'}</td>))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Enhanced Nursing Care Grid Component
const NursingCareGrid = ({ dayData, timeSlots, date, onInputChange, onDeleteTimeSlot, pendingChanges }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const careItems = [
    { key: 'position_change', label: 'Position Change' }, { key: 'mouth_care', label: 'Mouth Care' },
    { key: 'dressing_change', label: 'Dressing Change' }, { key: 'eye_care', label: 'Eye Care' },
    { key: 'bed_sore_care', label: 'Bed Sore Care' }, { key: 'bath', label: 'Bath' },
    { key: 'foley_care', label: 'Foley Care' },
  ];

  const getValue = (time, field) => {
    const changeKey = `${date}-${time}`;
    if (pendingChanges[changeKey]?.nursing_care?.[field] !== undefined) {
      return pendingChanges[changeKey].nursing_care[field];
    }
    return timeSlots.find(ts => ts.time === time)?.nursing_care?.[field] || false;
  };

  const handleChange = (time, field, checked) => {
    onInputChange(date, time, 'nursing_care', { [field]: checked });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center"><User className="w-5 h-5 mr-2" />Nursing Care Checklist</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 p-3 text-left font-semibold text-gray-700 border-r">Care Item</th>
              {hours.map(hour => <GridHeaderCell key={hour} hour={hour} timeSlots={timeSlots} onDeleteTimeSlot={onDeleteTimeSlot} />)}
            </tr>
          </thead>
          <tbody>
            {careItems.map(({ key, label }) => (
              <tr key={key} className="hover:bg-gray-50 border-b">
                <td className="sticky left-0 bg-white p-3 font-medium text-gray-700 border-r">{label}</td>
                {hours.map(hour => {
                  const isChecked = getValue(hour, key);
                  const hasChange = pendingChanges[`${date}-${hour}`]?.nursing_care?.[key] !== undefined;
                  return (
                    <td key={`${key}-${hour}`} className="p-3 text-center">
                      <input
                        type="checkbox" checked={isChecked}
                        onChange={(e) => handleChange(hour, key, e.target.checked)}
                        className={`w-5 h-5 text-indigo-600 border-2 rounded focus:ring-indigo-500 ${hasChange ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300'}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Enhanced Ventilator Grid Component
const VentilatorGrid = ({ dayData, timeSlots, date, onInputChange, onDeleteTimeSlot, pendingChanges }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const ventilatorFields = [
    { key: 'mode', label: 'Mode', type: 'text' }, { key: 'fio2', label: 'FiO2 (%)', type: 'number', min: 21, max: 100 },
    { key: 'set_tidal_vol', label: 'Set TV (mL)', type: 'number', min: 200, max: 1000 }, { key: 'expired_tv', label: 'Exp TV (mL)', type: 'number', min: 200, max: 1000 },
    { key: 'set_rate', label: 'Set RR', type: 'number', min: 8, max: 40 }, { key: 'resp_rate', label: 'Total RR', type: 'number', min: 8, max: 50 },
    { key: 'peep', label: 'PEEP (cmH2O)', type: 'number', min: 0, max: 25 }, { key: 'pressure_support', label: 'PS (cmH2O)', type: 'number', min: 0, max: 30 },
    { key: 'peak_airway_pressure', label: 'Peak Pr (cmH2O)', type: 'number', min: 10, max: 60 }, { key: 'ie_ratio', label: 'I:E Ratio', type: 'text' },
  ];

  const getValue = (time, field) => {
    const changeKey = `${date}-${time}`;
    if (pendingChanges[changeKey]?.ventilator?.[field] !== undefined) {
      return pendingChanges[changeKey].ventilator[field];
    }
    return timeSlots.find(ts => ts.time === time)?.ventilator?.[field] || '';
  };

  const handleChange = (time, field, value) => {
    const fieldConfig = ventilatorFields.find(f => f.key === field);
    const processedValue = fieldConfig?.type === 'number' ? (value === '' ? '' : parseFloat(value)) : value;
    onInputChange(date, time, 'ventilator', { [field]: processedValue });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center"><TrendingUp className="w-5 h-5 mr-2" />Ventilator Settings</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 p-3 text-left font-semibold text-gray-700 border-r">Parameter</th>
              {hours.map(hour => <GridHeaderCell key={hour} hour={hour} timeSlots={timeSlots} onDeleteTimeSlot={onDeleteTimeSlot} />)}
            </tr>
          </thead>
          <tbody>
            {ventilatorFields.map(({ key, label, type, min, max }) => (
              <tr key={key} className="hover:bg-gray-50 border-b">
                <td className="sticky left-0 bg-white p-3 font-medium text-gray-700 border-r">{label}</td>
                {hours.map(hour => {
                  const value = getValue(hour, key);
                  const hasChange = pendingChanges[`${date}-${hour}`]?.ventilator?.[key] !== undefined;
                  return (
                    <td key={`${key}-${hour}`} className="p-1">
                      <input
                        type={type} min={min} max={max} value={value}
                        onChange={(e) => handleChange(hour, key, e.target.value)}
                        className={`w-full p-2 text-center border rounded focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none ${hasChange ? 'bg-yellow-50 border-yellow-300' : 'border-gray-200'}`}
                        placeholder="--"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// NOTE: DynamicTable and TableRow components remain unchanged as their logic was already correct.
// ... (DynamicTable and TableRow components would go here, identical to the original file)
const DynamicTable = ({ title, headers, data, fields, onUpdate }) => {
  const [items, setItems] = useState(data || []);
  const [newItem, setNewItem] = useState(fields.reduce((acc, f) => ({ ...acc, [f]: '' }), {}));
  const [editing, setEditing] = useState(-1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setItems(data || []);
  }, [data]);

  const handleAddItem = async () => {
    if (Object.values(newItem).some(val => !val.trim())) {
      toast.error("Please fill all fields for the new item.");
      return;
    }
    
    setSaving(true);
    const updatedItems = [...items, { ...newItem, _id: Date.now().toString() }];
    setItems(updatedItems);
    await onUpdate(updatedItems);
    setNewItem(fields.reduce((acc, f) => ({ ...acc, [f]: '' }), {}));
    setSaving(false);
    toast.success("Item added successfully");
  };

  const handleEditItem = (index) => {
    setEditing(index);
  };

  const handleSaveEdit = async (index, updatedItem) => {
    setSaving(true);
    const updatedItems = [...items];
    updatedItems[index] = updatedItem;
    setItems(updatedItems);
    await onUpdate(updatedItems);
    setEditing(-1);
    setSaving(false);
    toast.success("Item updated successfully");
  };

  const handleDeleteItem = async (index) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    
    setSaving(true);
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    await onUpdate(updatedItems);
    setSaving(false);
    toast.success("Item deleted successfully");
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center justify-between">
          <span className="flex items-center">
            <Save className="w-5 h-5 mr-2" />
            {title}
          </span>
          <span className="text-sm bg-white/20 px-2 py-1 rounded">
            {items.length} items
          </span>
        </h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {headers.map(header => (
                <th key={header} className="p-3 text-left font-semibold text-gray-700 border-b">
                  {header}
                </th>
              ))}
              <th className="p-3 text-center font-semibold text-gray-700 border-b w-32">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, rowIndex) => (
              <TableRow
                key={item._id || rowIndex}
                item={item}
                fields={fields}
                headers={headers}
                isEditing={editing === rowIndex}
                onEdit={() => handleEditItem(rowIndex)}
                onSave={(updatedItem) => handleSaveEdit(rowIndex, updatedItem)}
                onDelete={() => handleDeleteItem(rowIndex)}
                onCancel={() => setEditing(-1)}
                saving={saving}
              />
            ))}
            <tr className="border-t-2 border-blue-200 bg-blue-50">
              {fields.map((field, fieldIndex) => (
                <td key={`new-${field}`} className="p-2">
                  <input
                    type="text"
                    value={newItem[field]}
                    onChange={e => setNewItem({ ...newItem, [field]: e.target.value })}
                    className="w-full p-2 border border-blue-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    placeholder={headers[fieldIndex] || field.replace(/_/g, ' ')}
                  />
                </td>
              ))}
              <td className="p-2 text-center">
                <button
                  onClick={handleAddItem}
                  disabled={saving}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-1"
                >
                  {saving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Add</span>
                    </>
                  )}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TableRow = ({ item, fields, headers, isEditing, onEdit, onSave, onDelete, onCancel, saving }) => {
  const [editData, setEditData] = useState(item);

  useEffect(() => {
    setEditData(item);
  }, [item, isEditing]);

  const handleSave = () => {
    if (Object.values(editData).some(val => !val.toString().trim())) {
      toast.error("Please fill all fields.");
      return;
    }
    onSave(editData);
  };

  if (isEditing) {
    return (
      <tr className="bg-yellow-50 border border-yellow-200">
        {fields.map((field, fieldIndex) => (
          <td key={`edit-${field}`} className="p-2">
            <input
              type="text"
              value={editData[field] || ''}
              onChange={e => setEditData({ ...editData, [field]: e.target.value })}
              className="w-full p-2 border border-yellow-300 rounded focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
              placeholder={headers[fieldIndex] || field.replace(/_/g, ' ')}
            />
          </td>
        ))}
        <td className="p-2 text-center">
          <div className="flex items-center justify-center space-x-2">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 text-xs"
            >
              {saving ? <RefreshCw className="w-3 h-3 animate-spin" /> : 'Save'}
            </button>
            <button
              onClick={onCancel}
              disabled={saving}
              className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 text-xs"
            >
              Cancel
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <tr className="hover:bg-gray-50 border-b">
      {fields.map(field => (
        <td key={field} className="p-3 text-gray-700">
          {item[field] || '--'}
        </td>
      ))}
      <td className="p-3 text-center">
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={onEdit}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs transition-colors"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-xs transition-colors"
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};


export default FlowChart;