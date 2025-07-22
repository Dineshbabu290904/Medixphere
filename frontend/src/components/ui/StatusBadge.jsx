import React from 'react';

const STATUS_CONFIG = {
  Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
  Confirmed: 'bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
  'No Show': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
  Rescheduled: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-300',
  Default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
};

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.Default;
  return (
    <span className={`px-3 py-1 text-xs font-bold rounded-full inline-block ${config}`}>
      {status}
    </span>
  );
};

export default StatusBadge;