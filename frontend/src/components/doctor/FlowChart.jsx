import React, { useState, useEffect, useCallback } from 'react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../ui/Spinner';
import VoiceControl from './VoiceControl';
import ChartHeader from './chart/ChartHeader';
import VitalsGrid from './chart/VitalsGrid';
import GcsGrid from './chart/GcsGrid';
import DynamicTable from './chart/DynamicTable';
import IntakeOutputGrid from './chart/IntakeOutputGrid';
import NursingCareChecklist from './chart/NursingCareChecklist';
import VentilatorSettings from './chart/VentilatorSettings';
import { parseVoiceCommand } from '../../utils/voiceCommandParser';
import Card from '../ui/Card'; // Import Card for the empty state
import { Plus } from 'lucide-react'; // Import Plus for the empty state button

const FlowChart = ({ patient }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchChart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiService.getCriticalCareChart(patient.patientId);
      // If no chart exists (response.chart is null), create a default structure to allow adding data.
      const initialData = response.chart || { 
          patientId: patient.patientId, 
          days: [],
          // Default header fields can be empty
          weight: '', age_sex: '', bed_no: '', primary_consultant: '', days_in_icu: 0, 
          intropes: '', diagnosis: '', operation_performed: '', post_op_day: 0
      };
      setChartData(initialData);
    } catch (error) {
      toast.error("Failed to load chart data.",error);
      setChartData(null); // Set to null on error to show error state
    } finally {
      setLoading(false);
    }
  }, [patient.patientId]);

  useEffect(() => {
    fetchChart();
  }, [fetchChart]);

  // Use updateCriticalCareTimeSlot for updating a specific time slot
  const handleUpdate = useCallback(
    async (dayId, slotId, data, successMessage) => {
      try {
        const response = await apiService.updateCriticalCareTimeSlot(patient.patientId, dayId, slotId, data);
        setChartData(response.chart);
        if (successMessage) toast.success(successMessage);
      } catch (error) {
        toast.error(`Update failed: ${error.message}`);
      }
    },
    [patient.patientId]
  );
  const handleVoiceCommand = async (command) => {
    const parsed = parseVoiceCommand(command);
    if (parsed) {
      const { time, updates } = parsed;
      const payload = { date, time, ...updates }; 
      const toastId = toast.loading(`Processing: "${command}"`);
      await handleUpdate(payload, `Updated chart for ${time}`);
      toast.dismiss(toastId);
      toast.success(`Chart updated via voice!`);
    } else {
      toast.error("Could not understand the command.");
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  
  // This handles the case where the API failed or returned malformed data
  if (!chartData) {
      return (
          <Card className="text-center py-12">
              <h3 className="text-lg font-semibold text-red-600">Could not load Flow Chart</h3>
              <p className="text-gray-500 mt-2">There was an error fetching the data for this patient.</p>
          </Card>
      );
  }

  const dayData = chartData?.days?.find(d => d.date && new Date(d.date).toISOString().split('T')[0] === date);
  const timeSlots = dayData?.timeSlots || [];

  return (
    <div className="space-y-6">
      <ChartHeader patient={patient} chartData={chartData} onUpdate={handleUpdate} />

      <div className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border dark:border-slate-700">
          <label htmlFor="chart-date" className="font-semibold text-gray-700 dark:text-gray-200">Select Date:</label>
          <input 
            type="date" 
            id="chart-date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="p-2 border rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-gray-100"
          />
      </div>

      <VoiceControl onCommand={handleVoiceCommand} />

      <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 mt-8 mb-4">Hourly Flow Sheet Data</h2>
      <VitalsGrid dayData={dayData} timeSlots={timeSlots} onUpdate={handleUpdate} date={date} />
      <GcsGrid dayData={dayData} timeSlots={timeSlots} onUpdate={handleUpdate} date={date} />
      <IntakeOutputGrid dayData={dayData} timeSlots={timeSlots} onUpdate={handleUpdate} date={date} />
      <NursingCareChecklist dayData={dayData} timeSlots={timeSlots} onUpdate={handleUpdate} date={date} />
      <VentilatorSettings dayData={dayData} timeSlots={timeSlots} onUpdate={handleUpdate} date={date} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <DynamicTable 
            title="I.V. Fluids" 
            headers={["Fluid & Drug", "Vol. Started", "Rate", "Start", "Stop", "Total Vol.", "Nurse"]}
            data={dayData?.iv_fluids || []}
            fields={["name", "volume_started", "rate", "time_start", "time_stop", "total_volume", "nurse_signature"]}
            onUpdate={(newData) => handleUpdate({ date, iv_fluids: newData }, "IV Fluids updated")}
          />
          <DynamicTable 
            title="Drugs Administered"
            headers={["Drug", "Dose", "Time", "Route", "Freq", "Sign", "Ordered By"]}
            data={dayData?.drugs_administered || []}
            fields={["drug", "dose", "time", "route", "frequency", "nurse_sign", "ordered_by"]}
            onUpdate={(newData) => handleUpdate({ date, drugs_administered: newData }, "Drugs updated")}
          />
      </div>
    </div>
  );
};

export default FlowChart;