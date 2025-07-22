import React from 'react';

const GcsGrid = ({ dayData, timeSlots, onUpdate, date }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const gcsFields = [
    { key: 'eye', label: 'Eye', max: 4 },
    { key: 'verbal', label: 'Verbal', max: 5 },
    { key: 'motor', label: 'Motor', max: 6 },
  ];

  const handleBlur = (time, field, value) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue)) return;

    const currentSlot = timeSlots.find(ts => ts.time === time);
    const currentValue = currentSlot?.gcs?.[field];

    if (numValue === currentValue) return;

    onUpdate({ date, time, gcs: { [field]: value } });
  };

  const calculateTotalGCS = (time) => {
    const slot = timeSlots.find(ts => ts.time === time);
    if (slot && slot.gcs) {
      const { eye, verbal, motor } = slot.gcs;
      const total = (eye || 0) + (verbal || 0) + (motor || 0);
      return total > 0 ? total : '';
    }
    return '';
  };

  return (
    <div className="mt-6 overflow-x-auto shadow-md rounded-lg border border-gray-100">
        <h3 className="text-lg font-semibold p-4 bg-gray-50 text-gray-800">Glasgow Coma Scale (GCS)</h3>
        <table className="min-w-full text-xs text-center border-collapse">
            <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border border-gray-200 sticky left-0 bg-gray-100 z-10 font-semibold text-gray-700">Component</th>
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
                {gcsFields.map(({ key, label, max }) => (
                <tr key={key} className="hover:bg-blue-50">
                    <td className="font-semibold p-2 border border-gray-200 sticky left-0 bg-white z-10 text-gray-700">{label} (Max {max})</td>
                    {hours.map(hour => {
                        const value = timeSlots.find(ts => ts.time === hour)?.gcs?.[key] ?? '';
                        return (
                        <td key={`${key}-${hour}`} className="p-0 border border-gray-100">
                            <input 
                                type="number" 
                                min="0" 
                                max={max} 
                                defaultValue={value} 
                                onBlur={(e) => handleBlur(hour, key, e.target.value)} 
                                className="w-full h-full p-2 text-center outline-none bg-transparent focus:bg-blue-100"
                            />
                        </td>
                        );
                    })}
                </tr>
                ))}
                <tr className="bg-gray-50 font-bold border-t-2 border-gray-300">
                    <td className="p-2 border border-gray-200 sticky left-0 bg-gray-50 z-10 text-gray-800">Total GCS</td>
                    {hours.map(hour => (
                        <td key={`total-gcs-${hour}`} className="p-2 border border-gray-200 text-gray-900">
                            {calculateTotalGCS(hour)}
                        </td>
                    ))}
                </tr>
            </tbody>
        </table>
    </div>
  );
};

export default GcsGrid;