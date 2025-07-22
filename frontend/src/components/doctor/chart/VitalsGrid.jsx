import React from 'react';

const VitalsGrid = ({ dayData, timeSlots, onUpdate, date }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const vitalFields = [
    { key: 'pulse', label: 'Pulse (BPM)' },
    { key: 'bp_systolic', label: 'BP Sys (mmHg)' },
    { key: 'bp_diastolic', label: 'BP Dias (mmHg)' },
    { key: 'temp', label: 'Temp (°F)' },
    { key: 'spo2', label: 'SpO2 (%)' },
    { key: 'cvp', label: 'CVP (mmHg)' },
    { key: 'rhythm', label: 'Rhythm' },
  ];

  const handleBlur = (time, field, value) => {
    const currentSlot = timeSlots.find(ts => ts.time === time);
    const currentValue = currentSlot?.vitals?.[field];

    let processedValue = value;
    if (field !== 'rhythm') {
        processedValue = parseFloat(value);
        if (isNaN(processedValue)) processedValue = '';
    }

    if (String(processedValue) === String(currentValue)) return;

    onUpdate({ date, time, vitals: { [field]: processedValue } });
  };

  const getSpO2Color = (value) => {
    if (!value) return '';
    if (value < 90) return 'bg-red-100 text-red-800';
    if (value < 94) return 'bg-yellow-100 text-yellow-800';
    return '';
  };

  return (
    <div className="overflow-x-auto shadow-md rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold p-4 bg-gray-50 text-gray-800">Vital Signs</h3>
      <table className="min-w-full text-xs text-center border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border border-gray-200 sticky left-0 bg-gray-100 z-10 font-semibold text-gray-700">Vitals</th>
            {hours.map(hour => {
                const isDayShift = parseInt(hour.split(':')[0]) >= 7 && parseInt(hour.split(':')[0]) < 19;
                return (
                    <th key={hour} className={`p-2 border border-gray-200 font-normal w-16 ${isDayShift ? 'bg-blue-100/50' : 'bg-blue-900/10 text-gray-600'}`}>
                        {hour}
                    </th>
                );
            })}
          </tr>
        </thead>
        <tbody>
          {vitalFields.map(({ key, label }) => (
            <tr key={key} className="hover:bg-blue-50">
              <td className="font-semibold p-2 border border-gray-200 sticky left-0 bg-white z-10 text-gray-700">{label}</td>
              {hours.map(hour => {
                const value = timeSlots.find(ts => ts.time === hour)?.vitals?.[key] ?? '';
                const cellClasses = key === 'spo2' ? getSpO2Color(value) : '';
                return (
                  <td key={`${key}-${hour}`} className={`p-0 border border-gray-100 ${cellClasses}`}>
                    <input
                      type={key === 'rhythm' ? 'text' : 'number'}
                      defaultValue={value}
                      onBlur={(e) => handleBlur(hour, key, e.target.value)}
                      className="w-full h-full p-2 text-center outline-none bg-transparent focus:bg-blue-100"
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VitalsGrid;