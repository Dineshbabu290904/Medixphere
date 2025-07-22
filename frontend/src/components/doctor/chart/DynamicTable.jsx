import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';

const DynamicTable = ({ title, headers, data, fields, onUpdate }) => {
  const [newItem, setNewItem] = useState(fields.reduce((acc, f) => ({ ...acc, [f]: '' }), {}));

  const handleAddItem = () => {
    if (Object.values(newItem).some(val => !val)) {
        return alert("Please fill all fields for the new item.");
    }
    const updatedData = [...(data || []), newItem];
    onUpdate(updatedData);
    setNewItem(fields.reduce((acc, f) => ({ ...acc, [f]: '' }), {}));
  };

  const handleDeleteItem = (index) => {
    const updatedData = data.filter((_, i) => i !== index);
    onUpdate(updatedData);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-4 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-100">
              {headers.map(h => <th key={h} className="p-2 text-left font-semibold text-gray-700">{h}</th>)}
              <th className="p-2 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data && data.map((item, rowIndex) => (
              <tr key={rowIndex} className="border-t border-gray-100 hover:bg-gray-50">
                {fields.map(field => <td key={field} className="p-2 text-gray-700">{item[field]}</td>)}
                <td className="p-2 text-center">
                    <Button variant="danger" size="xs" onClick={() => handleDeleteItem(rowIndex)}><Trash2 className="w-4 h-4"/></Button>
                </td>
              </tr>
            ))}
            <tr className="border-t border-blue-200 bg-blue-50">
              {fields.map(field => (
                <td key={`new-${field}`} className="p-1">
                  <input
                    type="text"
                    value={newItem[field]}
                    onChange={e => setNewItem({ ...newItem, [field]: e.target.value })}
                    className="w-full p-1 border border-blue-200 rounded text-xs focus:ring-1 focus:ring-blue-400 outline-none"
                    placeholder={headers[fields.indexOf(field)] || field.replace(/_/g, ' ')}
                  />
                </td>
              ))}
              <td className="p-1 text-center">
                <Button variant="success" size="xs" onClick={handleAddItem}><Plus className="w-4 h-4"/></Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DynamicTable;