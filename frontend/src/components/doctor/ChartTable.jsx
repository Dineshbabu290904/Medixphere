import React, { useState } from 'react';
import useApi from '../../hooks/useApi';
import Button from '../ui/Button';

const EditableCell = ({ value, onSave, field, slotId, dayId, patientId }) => {
  const [editing, setEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value);
  const { put } = useApi();

  const handleSave = async () => {
    try {
      await put(`/flow-chart/update/${patientId}/${dayId}/${slotId}`, { [field]: currentValue });
      onSave(field, currentValue);
      setEditing(false);
    } catch (error) {
      console.error("Failed to save cell:", error);
      // Handle error display
    }
  };

  return editing ? (
    <input
      type="text"
      value={currentValue}
      onChange={(e) => setCurrentValue(e.target.value)}
      onBlur={handleSave}
      autoFocus
      className="w-full p-1 border rounded bg-slate-200 dark:bg-slate-700"
    />
  ) : (
    <div onClick={() => setEditing(true)} className="w-full h-full p-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800">
      {value}
    </div>
  );
};


const ChartTable = ({ chartData, onUpdate }) => {
  const [chart, setChart] = useState(chartData);
  const { post } = useApi();

  const handleCellSave = (dayIndex, slotIndex, field, newValue) => {
    const newChart = { ...chart };
    newChart.days[dayIndex].timeSlots[slotIndex][field] = newValue;
    setChart(newChart);
  };

  const handleAddSlot = async (dayIndex) => {
    const time = prompt("Enter time for new slot (e.g., 14:00):");
    if (!time) return;

    const day = chart.days[dayIndex];
    try {
      const response = await post(`/flow-chart/add/${chart.patientId}`, {
        date: new Date(day.date).toISOString().split('T')[0],
        time: time,
        // Add other default fields if necessary
      });
      onUpdate(response.chart);
    } catch (error) {
      console.error("Failed to add time slot:", error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm text-slate-500 dark:text-slate-400">
        {chart.days.map((day, dayIndex) => (
          <React.Fragment key={day._id}>
            <thead>
              <tr className="bg-slate-100 dark:bg-slate-800">
                <th className="p-2 border border-slate-200 dark:border-slate-600" colSpan="2">
                  Date: {new Date(day.date).toLocaleDateString()}
                </th>
              </tr>
              <tr className="bg-slate-50 dark:bg-slate-700">
                <th className="p-2 border border-slate-200 dark:border-slate-600">Time</th>
                <th className="p-2 border border-slate-200 dark:border-slate-600">Pulse</th>
                <th className="p-2 border border-slate-200 dark:border-slate-600">BP</th>
                {/* Add other headers here */}
              </tr>
            </thead>
            <tbody>
              {day.timeSlots.map((slot, slotIndex) => (
                <tr key={slot._id}>
                  <td className="p-2 border border-slate-200 dark:border-slate-600 font-bold">{slot.time}</td>
                  <td className="p-0 border border-slate-200 dark:border-slate-600">
                    <EditableCell
                      value={slot.vitals?.pulse}
                      onSave={(field, value) => handleCellSave(dayIndex, slotIndex, field, value)}
                      field="vitals.pulse"
                      slotId={slot._id}
                      dayId={day._id}
                      patientId={chart.patientId}
                    />
                  </td>
                   <td className="p-0 border border-slate-200 dark:border-slate-600">
                    <EditableCell
                      value={`${slot.vitals?.bp_systolic || ''}/${slot.vitals?.bp_diastolic || ''}`}
                      onSave={(field, value) => handleCellSave(dayIndex, slotIndex, field, value)}
                      field="vitals.bp" // This needs more complex handling for two fields
                      slotId={slot._id}
                      dayId={day._id}
                      patientId={chart.patientId}
                    />
                  </td>
                  {/* Add other cells here */}
                </tr>
              ))}
              <tr>
                <td colSpan="3" className="p-2 border border-slate-200 dark:border-slate-600">
                    <Button onClick={() => handleAddSlot(dayIndex)}>Add Time Slot</Button>
                </td>
              </tr>
            </tbody>
          </React.Fragment>
        ))}
      </table>
    </div>
  );
};

export default ChartTable;