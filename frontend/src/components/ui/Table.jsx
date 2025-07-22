import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import Spinner from './Spinner';

// Helper to access nested properties from a string accessor like 'patient.name'
const getNestedValue = (obj, path) => path.split('.').reduce((o, i) => (o ? o[i] : undefined), obj);

const Table = ({ headers, columns, children, data, loading, searchable = false, filterable = false, title }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // --- FIX START ---
  // Determine table headers from either 'headers' or 'columns' prop for flexibility
  const tableHeaders = headers || columns?.map(col => col.Header) || [];

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={tableHeaders.length} className="text-center py-12">
            <Spinner size="lg" />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading data...</p>
          </td>
        </tr>
      );
    }

    // Prioritize rendering manually passed children for backward compatibility
    if (children) {
      return children;
    }

    // Automatically render rows if 'data' and 'columns' are provided
    if (data && columns) {
      if (data.length === 0) {
        return (
          <Table.Row>
            <Table.Cell colSpan={tableHeaders.length} className="text-center text-gray-500 py-8">
              No data available.
            </Table.Cell>
          </Table.Row>
        );
      }
      return data.map((rowItem, rowIndex) => (
        <Table.Row key={rowIndex}>
          {columns.map((col, colIndex) => (
            <Table.Cell key={colIndex}>
              {col.Cell 
                ? col.Cell({ row: { original: rowItem } }) 
                : getNestedValue(rowItem, col.accessor) ?? 'N/A'}
            </Table.Cell>
          ))}
        </Table.Row>
      ));
    }

    // Fallback if no data or children
    return (
       <Table.Row>
        <Table.Cell colSpan={tableHeaders.length} className="text-center text-gray-500 py-8">
          No data to display.
        </Table.Cell>
      </Table.Row>
    );
  };
  // --- FIX END ---

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {(title || searchable || filterable) && (
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {title && (
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
            )}
            <div className="flex items-center gap-3">
              {searchable && (
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-100"
                  />
                </div>
              )}
              {filterable && (
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 dark:bg-gray-800">
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {renderTableBody()}
          </tbody>
        </table>
      </div>
    </div>
  );
};

Table.Row = ({ children, className = '' }) => (
  <tr className={`hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors ${className}`}>
    {children}
  </tr>
);

Table.Cell = ({ children, className = '', ...props }) => (
  <td className={`px-6 py-4 text-gray-900 dark:text-gray-100 ${className}`} {...props}>
    {children}
  </td>
);

export default Table;