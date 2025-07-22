import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

const Select = ({ name, label, options = [], rules = {}, className, value, onChange, ...props }) => {
  const context = useFormContext();
  // BUG FIX: Check if we are inside a FormProvider. This is the core of the fix.
  const isFormControl = !!context; 

  let error;
  // Only try to access formState if we are in a form context
  if (isFormControl) {
    error = context.formState.errors[name];
  }

  // Conditionally get props from react-hook-form's register function
  const registerProps = isFormControl ? context.register(name, rules) : {};

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      <select
        id={name}
        // Spread the register props (if they exist)
        {...registerProps}
        // If not a form control, use standard value/onChange for controlled component behavior
        {...(!isFormControl && { name, value, onChange })}
        {...props}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 bg-white dark:bg-slate-800 appearance-none transition-colors ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 dark:border-slate-600 focus:ring-blue-500 focus:border-blue-500'
        } ${className || ''}`}
      >
        {props.placeholder && <option value="">-- {props.placeholder} --</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {/* Only show validation errors if it's a form control and an error exists */}
      {isFormControl && error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {error.message}
        </p>
      )}
    </div>
  );
};

export default Select;