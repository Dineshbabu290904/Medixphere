import React from 'react';
import Badge from '@/components/ui/Badge';
import { User, Calendar, Activity, HeartPulse, FileText, Clock } from 'lucide-react';

const TABS_CONFIG = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'blue' },
    { id: 'actions', label: 'Clinical Actions', icon: Calendar, color: 'green' },
    { id: 'vitals', label: 'Live Vitals', icon: HeartPulse, color: 'red' },
    { id: 'timeline', label: 'Timeline', icon: Clock, color: 'indigo' },
    { id: 'flowchart', label: 'ICU Flow Chart', icon: HeartPulse, color: 'purple' },
    { id: 'records', label: 'Documents', icon: FileText, color: 'orange' },
    { id: 'details', label: 'Patient Info', icon: User, color: 'gray' },
];

const EnhancedEMRTabs = ({ activeTab, setActiveTab, notificationCounts }) => {
    return (
        <div className="border-b border-gray-200 dark:border-slate-700 mb-6">
            <nav className="-mb-px flex space-x-1 overflow-x-auto">
                {TABS_CONFIG.map(tab => {
                    const count = notificationCounts[tab.id] || 0;
                    const colorClasses = {
                        active: `border-${tab.color}-500 text-${tab.color}-600 bg-${tab.color}-50 dark:bg-${tab.color}-900/20`,
                        inactive: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                    };
                    return (
                        <button 
                            key={tab.id} 
                            onClick={() => setActiveTab(tab.id)} 
                            className={`relative whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center gap-2 rounded-t-lg transition-all ${
                                activeTab === tab.id ? colorClasses.active : colorClasses.inactive
                            }`}
                        >
                            <tab.icon className="w-5 h-5"/>
                            <span>{tab.label}</span>
                            {count > 0 && (
                                <Badge variant="danger" size="sm" className="ml-1 min-w-[20px] h-5">
                                    {count > 99 ? '99+' : count}
                                </Badge>
                            )}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default EnhancedEMRTabs;