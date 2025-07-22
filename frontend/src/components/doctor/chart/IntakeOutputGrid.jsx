import React from 'react';

const IntakeOutputGrid = ({ dayData, timeSlots, onUpdate, date }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const ioFields = [
    { key: 'hourly_iv', label: 'IV Infusion (mL)' },
    { key: 'oral_feed', label: 'Oral Feed (mL)' },
    { key: 'urine', label: 'Urine (mL)' },
    { key: 'drainage', label: 'Drainage (mL)' },
  ];

  const handleBlur = (time, field, value) => {
    const numValue = parseFloat(value);
    const processedValue = isNaN(numValue) ? '' : numValue;

    const currentSlot = timeSlots.find(ts => ts.time === time);
    const currentValue = currentSlot?.intake_output?.[field];

    if (processedValue === currentValue) return;

    onUpdate({ date, time, intake_output: { [field]: processedValue } });
  };

  return (
    <div className="mt-6 overflow-x-auto shadow-md rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold p-4 bg-gray-50 text-gray-800">Intake & Output (Hourly)</h3>
        <table className="min-w-full text-xs text-center border-collapse">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border border-gray-200 sticky left-0 bg-gray-100 z-10 font-semibold text-gray-700">Parameter</th>
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
                {ioFields.map(({ key, label }) => (
                <tr key={key} className="hover:bg-blue-50">
                    <td className="font-semibold p-2 border border-gray-200 sticky left-0 bg-white z-10 text-gray-700">{label}</td>
                    {hours.map(hour => {
                        const value = timeSlots.find(ts => ts.time === hour)?.intake_output?.[key] ?? '';
                        return (
                        <td key={`${key}-${hour}`} className="p-0 border border-gray-100">
                            <input 
                                type="number" 
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

export default IntakeOutputGrid;