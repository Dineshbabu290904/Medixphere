import React from 'react';

const VentilatorSettings = ({ dayData, timeSlots, onUpdate, date }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0') + ':00');
  const ventilatorFields = [
    { key: 'mode', label: 'Mode' },
    { key: 'fio2', label: 'FiO2 (%)', type: 'number' },
    { key: 'set_tidal_vol', label: 'Set TV (mL)', type: 'number' },
    { key: 'expired_tv', label: 'Exp TV (mL)', type: 'number' },
    { key: 'set_rate', label: 'Set RR', type: 'number' },
    { key: 'resp_rate', label: 'Total RR', type: 'number' },
    { key: 'peep', label: 'PEEP (cmH2O)', type: 'number' },
    { key: 'pressure_support', label: 'PS (cmH2O)', type: 'number' },
    { key: 'peak_airway_pressure', label: 'Peak Pr (cmH2O)', type: 'number' },
    { key: 'ie_ratio', label: 'I:E Ratio' },
  ];

  const handleBlur = (time, field, value) => {
    const currentSlot = timeSlots.find(ts => ts.time === time);
    const currentValue = currentSlot?.ventilator?.[field];

    let processedValue = value;
    if (field !== 'mode' && field !== 'ie_ratio') {
        processedValue = parseFloat(value);
        if (isNaN(processedValue)) processedValue = '';
    }

    if (String(processedValue) === String(currentValue)) return;

    onUpdate({ date, time, ventilator: { [field]: processedValue } });
  };

  return (
    <div className="mt-6 overflow-x-auto shadow-md rounded-lg border border-gray-100">
      <h3 className="text-lg font-semibold p-4 bg-gray-50 text-gray-800">Ventilator Settings</h3>
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
          {ventilatorFields.map(({ key, label, type = 'text' }) => (
            <tr key={key} className="hover:bg-blue-50">
              <td className="font-semibold p-2 border border-gray-200 sticky left-0 bg-white z-10 text-gray-700">{label}</td>
              {hours.map(hour => {
                const value = timeSlots.find(ts => ts.time === hour)?.ventilator?.[key] ?? '';
                return (
                  <td key={`${key}-${hour}`} className="p-0 border border-gray-100">
                    <input
                      type={type}
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

export default VentilatorSettings;