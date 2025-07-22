import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../../../components/ui/Button';

const DayScheduleRow = ({ dayData, onChange }) => {
  const { dayOfWeek, isEnabled, startTime, endTime, slotDuration, breaks } = dayData;

  // Each handler now directly calls the 'onChange' prop from the parent
  const handleInputChange = (field, value) => {
    onChange(dayOfWeek, { ...dayData, [field]: value });
  };

  const handleBreakChange = (index, field, value) => {
    const newBreaks = [...breaks];
    newBreaks[index] = { ...newBreaks[index], [field]: value };
    onChange(dayOfWeek, { ...dayData, breaks: newBreaks });
  };

  const addBreak = () => {
    onChange(dayOfWeek, { ...dayData, breaks: [...breaks, { breakStart: '13:00', breakEnd: '14:00' }] });
  };

  const removeBreak = (index) => {
    onChange(dayOfWeek, { ...dayData, breaks: breaks.filter((_, i) => i !== index) });
  };

  return (
    <div className={`p-4 transition-colors ${isEnabled ? 'bg-white dark:bg-slate-800' : 'bg-gray-50 dark:bg-slate-800/50'}`}>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={isEnabled}
          onChange={(e) => handleInputChange('isEnabled', e.target.checked)}
          className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          id={`checkbox-${dayOfWeek}`}
        />
        <label htmlFor={`checkbox-${dayOfWeek}`} className="ml-3 min-w-[100px] text-lg font-bold text-gray-800 dark:text-gray-100">
          {dayOfWeek}
        </label>
      </div>

      {isEnabled && (
        <div className="pl-8 mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start Time</label>
            <input type="time" value={startTime} onChange={(e) => handleInputChange('startTime', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-slate-700 dark:border-slate-600"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End Time</label>
            <input type="time" value={endTime} onChange={(e) => handleInputChange('endTime', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-slate-700 dark:border-slate-600"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Slot Duration (mins)</label>
            <input type="number" value={slotDuration} onChange={(e) => handleInputChange('slotDuration', parseInt(e.target.value, 10))} step="5" min="5" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-slate-700 dark:border-slate-600"/>
          </div>
          <div className="md:col-span-2 lg:col-span-4 space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Breaks</h4>
            {breaks.map((breakItem, index) => (
              <div key={index} className="flex items-center gap-2">
                <input type="time" value={breakItem.breakStart} onChange={(e) => handleBreakChange(index, 'breakStart', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-slate-700 dark:border-slate-600"/>
                <span className="text-gray-500">-</span>
                <input type="time" value={breakItem.breakEnd} onChange={(e) => handleBreakChange(index, 'breakEnd', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm p-2 dark:bg-slate-700 dark:border-slate-600"/>
                <Button variant="danger" size="sm" onClick={() => removeBreak(index)}><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addBreak}><Plus className="w-4 h-4 mr-1" /> Add Break</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DayScheduleRow;