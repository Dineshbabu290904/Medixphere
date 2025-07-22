import React from 'react';
import { AlertTriangle, CheckCircle, Info, XCircle } from 'lucide-react';

const alertConfig = {
    info: {
        icon: Info,
        classes: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-700/50 dark:text-blue-200"
    },
    success: {
        icon: CheckCircle,
        classes: "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-700/50 dark:text-green-200"
    },
    warning: {
        icon: AlertTriangle,
        classes: "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-700/50 dark:text-yellow-200"
    },
    danger: {
        icon: XCircle,
        classes: "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-700/50 dark:text-red-200"
    },
};

const Alert = ({ children, variant = 'info', className = '' }) => {
    const config = alertConfig[variant] || alertConfig.info;
    const Icon = config.icon;

    return (
        <div
            className={`flex items-start gap-4 p-4 rounded-lg border ${config.classes} ${className}`}
            role="alert"
        >
            <div className="flex-shrink-0 mt-0.5">
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                {children}
            </div>
        </div>
    );
};

export default Alert;