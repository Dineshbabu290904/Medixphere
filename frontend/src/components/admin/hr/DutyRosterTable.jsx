import React from 'react';
import Card from '@/components/ui/Card';
import { CalendarClock } from 'lucide-react';

const DutyRosterTable = () => {
  return (
    <Card>
      <Card.Header>
        <div className="flex items-center gap-3">
          <CalendarClock className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Duty Roster</h2>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">
              The duty roster management feature is currently under development.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              This section will display weekly and monthly shift schedules for all staff.
            </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default DutyRosterTable;