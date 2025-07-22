import React from 'react';

const NursingCareChecklist = ({ dayData, timeSlots, onUpdate, date }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const careItems = [
    { key: 'position_change', label: 'Position Change' },
    { key: 'mouth_care', label: 'Mouth Care' },
    { key: 'dressing_change', label: 'Dressing Change' },
    { key: 'eye_care', label: 'Eye Care' },
    { key: 'bed_sore_care', label: 'Bed Sore Care' },
    { key: 'bath', label: 'Bath' },
    { key: 'foley_care', label: 'Foley Care' },
  ];

  const handleChange = (time, field, checked) => {
    onUpdate({ date, time, nursing_care: { [field]: checked } });
  };

  return (
    <div className="mt-6 overflow-x-auto shadow-md rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold p-4 bg-gray-50 text-gray-800">Nursing Care Checklist</h3>
      <table className="min-w-full text-xs text-center border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border border-gray-200 sticky left-0 bg-gray-100 z-10 font-semibold text-gray-700">Care Item</th>
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
          {careItems.map(({ key, label }) => (
            <tr key={key} className="hover:bg-blue-50">
              <td className="font-semibold p-2 border border-gray-200 sticky left-0 bg-white z-10 text-gray-700">{label}</td>
              {hours.map(hour => {
                const isChecked = timeSlots.find(ts => ts.time === hour)?.nursing_care?.[key] || false;
                return (
                  <td key={`${key}-${hour}`} className="p-2 border border-gray-100">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleChange(hour, key, e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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

export default NursingCareChecklist;