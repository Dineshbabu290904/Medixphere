import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'md', className = '' }) => {
    const baseClasses = 'inline-flex items-center font-semibold rounded-full';

    const variantClasses = {
        primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
        secondary: 'bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-slate-200',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
        info: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
        outline: 'bg-transparent text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600'
    };

    const sizeClasses = {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base'
    };
    
    return (
        <span className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;