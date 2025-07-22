import React from 'react';
import { useFormContext } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';

const Input = ({ name, label, type = 'text', rules = {}, className, value, onChange, ...props }) => {
  const context = useFormContext();
  const isFormControl = !!context;

  let error;
  if (isFormControl) {
    error = context.formState.errors[name];
  }

  const registerProps = isFormControl ? context.register(name, rules) : {};

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          {label}
        </label>
      )}
      <input
        id={name}
        type={type}
        {...registerProps}
        {...(!isFormControl && { name, value, onChange })}
        {...props}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white/50 dark:bg-slate-900/50 ${
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-slate-300 dark:border-slate-600'
        } ${className || ''}`}
      />
      {isFormControl && error && (
        <p className="mt-1 text-xs text-red-600 flex items-center gap-1">
          <AlertCircle className="w-4 h-4" /> {error.message}
        </p>
      )}
    </div>
  );
};

export default Input;