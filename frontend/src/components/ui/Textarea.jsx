import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

const Textarea = ({ name, label, rules = {}, className, ...props }) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <textarea
        id={name}
        {...register(name, rules)}
        {...props}
        rows={props.rows || 4}
        className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 transition-colors resize-none ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
        } ${className || ''}`}
      ></textarea>
      {error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {error.message}
        </p>
      )}
    </div>
  );
};

export default Textarea;