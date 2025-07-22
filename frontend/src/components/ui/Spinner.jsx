import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

// Enhanced Spinner Component
const Spinner = ({ size = 'md', variant = 'primary' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const variants = {
    primary: 'border-blue-600 dark:border-blue-400',
    secondary: 'border-gray-600 dark:border-gray-400',
    success: 'border-emerald-600 dark:border-emerald-400',
    warning: 'border-yellow-600 dark:border-yellow-400',
    danger: 'border-rose-600 dark:border-rose-400',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-2 border-t-transparent border-r-transparent ${variants[variant]} opacity-75`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};


export default Spinner;