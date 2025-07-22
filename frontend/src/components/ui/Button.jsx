import React from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', size = 'md', className = '', loading = false, disabled = false, ...props }) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]';

  const variantClasses = {
    primary: 'bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 focus:ring-blue-500 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-600/30',
    secondary: 'bg-gradient-to-br from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 text-slate-800 dark:text-slate-200 hover:from-slate-300 hover:via-slate-400 hover:to-slate-300 dark:hover:from-slate-600 dark:hover:via-slate-500 dark:hover:to-slate-600 focus:ring-slate-400 shadow-lg shadow-slate-300/25 dark:shadow-slate-700/25',
    outline: 'bg-transparent border-2 border-gradient-to-br from-slate-300 via-slate-400 to-slate-300 dark:from-slate-600 dark:via-slate-500 dark:to-slate-600 text-slate-700 dark:text-slate-200 hover:bg-gradient-to-br hover:from-slate-50 hover:via-slate-100 hover:to-slate-50 dark:hover:from-slate-800 dark:hover:via-slate-750 dark:hover:to-slate-800 focus:ring-blue-500 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400',
    danger: 'bg-gradient-to-br from-rose-500 via-red-600 to-red-700 text-white hover:from-rose-600 hover:via-red-700 hover:to-red-800 focus:ring-rose-500 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-600/30',
    ghost: 'bg-transparent text-slate-700 dark:text-slate-200 hover:bg-gradient-to-br hover:from-slate-100 hover:via-slate-150 hover:to-slate-100 dark:hover:from-slate-800 dark:hover:via-slate-750 dark:hover:to-slate-800 focus:ring-blue-500 hover:text-blue-600 dark:hover:text-blue-400',
    success: 'bg-gradient-to-br from-emerald-500 via-green-600 to-teal-600 text-white hover:from-emerald-600 hover:via-green-700 hover:to-teal-700 focus:ring-emerald-500 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-600/30',
    warning: 'bg-gradient-to-br from-amber-500 via-orange-600 to-yellow-600 text-white hover:from-amber-600 hover:via-orange-700 hover:to-yellow-700 focus:ring-amber-500 shadow-lg shadow-amber-500/25 hover:shadow-xl hover:shadow-amber-600/30',
    purple: 'bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-600 text-white hover:from-purple-600 hover:via-violet-700 hover:to-indigo-700 focus:ring-purple-500 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-600/30',
    pink: 'bg-gradient-to-br from-pink-500 via-rose-600 to-fuchsia-600 text-white hover:from-pink-600 hover:via-rose-700 hover:to-fuchsia-700 focus:ring-pink-500 shadow-lg shadow-pink-500/25 hover:shadow-xl hover:shadow-pink-600/30',
    cyan: 'bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-600 text-white hover:from-cyan-600 hover:via-sky-700 hover:to-blue-700 focus:ring-cyan-500 shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-600/30'
  };

  const sizeClasses = {
    xs: 'px-2.5 py-1.5 text-xs',
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };
  const isDisabled = loading || disabled;

  // Motion animation variants
  const buttonVariants = {
    initial: { scale: 1 },
    tap: { scale: isDisabled ? 1 : 0.97 },
    hover: { scale: isDisabled ? 1 : 1.02 }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className} ${
        isDisabled ? 'opacity-60 cursor-not-allowed transform-none hover:scale-100' : ''
      }`}
      {...props}
    >
      {loading && (
        <div className="relative mr-2">
          <Loader className="animate-spin w-4 h-4" />
          <div className="absolute inset-0 w-4 h-4 bg-white/20 rounded-full animate-ping" />
        </div>
      )}
      {children}
    </button>
  );
};

export default Button;