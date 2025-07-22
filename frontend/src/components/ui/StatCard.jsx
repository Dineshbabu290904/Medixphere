import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Spinner from './Spinner';

const StatCard = ({ title, value, change, icon: Icon, trend, color = 'blue', loading = false }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30',
      icon: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/50',
      border: 'border-blue-200/50 dark:border-blue-700/50'
    },
    emerald: {
      bg: 'bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-900/30',
      icon: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-100 dark:bg-emerald-900/50',
      border: 'border-emerald-200/50 dark:border-emerald-700/50'
    },
    yellow: {
      bg: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950/30 dark:to-amber-900/30',
      icon: 'text-yellow-600 dark:text-amber-400',
      iconBg: 'bg-yellow-100 dark:bg-amber-900/50',
      border: 'border-yellow-200/50 dark:border-amber-700/50'
    },
    rose: {
      bg: 'bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-950/30 dark:to-red-900/30',
      icon: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-100 dark:bg-rose-900/50',
      border: 'border-rose-200/50 dark:border-rose-700/50'
    }
  };

  const { bg, icon: iconColor, iconBg, border } = colorClasses[color];

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
    if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-600 dark:text-emerald-400';
    if (trend === 'down') return 'text-rose-600 dark:text-rose-400';
    return 'text-gray-600 dark:text-gray-400';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, y: -4 }}
      className={`${bg} border ${border} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {change && (
          <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{change}</span>
          </div>
        )}
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">{title}</h3>
        <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {loading ? <Spinner size="sm" /> : value}
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;