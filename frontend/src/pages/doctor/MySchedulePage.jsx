import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import Card from '@/components/ui/Card';
import DayScheduleRow from '@/components/doctor/schedule/DayScheduleRow';
import StatusBadge from '@/components/ui/StatusBadge';
import { 
  Save, Settings, Calendar as CalendarIcon, Clock, Users, Download, Upload,
  RefreshCw, Search, Edit, Copy, Phone, Mail, CheckCircle, XCircle, List, Grid, Bell, Play
} from 'lucide-react';

const localizer = momentLocalizer(moment);
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const APPOINTMENT_STATUS_CONFIG = {
  Scheduled: { color: '#3B82F6', textColor: '#FFFFFF', label: 'Scheduled' },
  Confirmed: { color: '#0EA5E9', textColor: '#FFFFFF', label: 'Confirmed' },
  'In Progress': { color: '#F59E0B', textColor: '#FFFFFF', label: 'In Progress' },
  Completed: { color: '#10B981', textColor: '#FFFFFF', label: 'Completed' },
  Cancelled: { color: '#EF4444', textColor: '#FFFFFF', label: 'Cancelled' },
  'No Show': { color: '#8B5CF6', textColor: '#FFFFFF', label: 'No Show' },
};

const VIEW_OPTIONS = [
  { value: 'week', label: 'Week', icon: Grid },
  { value: 'day', label: 'Day', icon: CalendarIcon },
  { value: 'agenda', label: 'Agenda', icon: List }
];

const MySchedulePage = () => {
    const { user } = useAuth();
    const [schedule, setSchedule] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentView, setCurrentView] = useState('week');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [statistics, setStatistics] = useState({});
    const [notifications, setNotifications] = useState([]);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshIntervalId, setRefreshIntervalId] = useState(null);
    const [timezone, setTimezone] = useState(moment.tz.guess());

    const fetchData = useCallback(async (showLoading = true) => {
        if (!user?.id) return;
        if (showLoading) setLoading(true);
        try {
            const [scheduleRes, appointmentsRes] = await Promise.all([
                apiService.getSchedules({ doctorId: user.id }),
                apiService.getAppointments({ doctorId: user.id })
            ]);

            const apiSchedule = scheduleRes.schedule[0]?.workingDays || [];
            const scheduleMap = new Map(apiSchedule.map(day => [day.dayOfWeek, day]));
            const fullWeekSchedule = DAYS_OF_WEEK.map(dayName => ({
                ...(scheduleMap.get(dayName) || { dayOfWeek: dayName, startTime: '09:00', endTime: '17:00', slotDuration: 30, breaks: [] }),
                isEnabled: scheduleMap.has(dayName)
            }));
            setSchedule(fullWeekSchedule);

            const appointmentsData = appointmentsRes.appointments || [];
            setAppointments(appointmentsData);
            calculateStatistics(appointmentsData);
            checkUpcomingAppointments(appointmentsData);
        } catch (error) {
            toast.error(`Failed to load data: ${error.message}`);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [user?.id]);
    
    const calculateStatistics = useCallback((list) => {
        const today = moment().startOf('day');
        setStatistics({
            todayTotal: list.filter(a => moment(a.appointmentDate).isSame(today, 'day')).length,
            todayCompleted: list.filter(a => moment(a.appointmentDate).isSame(today, 'day') && a.status === 'Completed').length,
            weekTotal: list.filter(a => moment(a.appointmentDate).isSame(moment(), 'week')).length,
            monthTotal: list.filter(a => moment(a.appointmentDate).isSame(moment(), 'month')).length,
            upcomingCount: list.filter(a => moment(a.appointmentDate).isAfter(moment()) && a.status === 'Scheduled').length,
        });
    }, []);

    const checkUpcomingAppointments = useCallback((list) => {
        const upcoming = list.filter(a => {
            const diff = moment(a.appointmentDate).diff(moment(), 'minutes');
            return diff > 0 && diff <= 60 && a.status === 'Scheduled';
        }).map(a => ({
            id: a._id,
            message: `Appointment with ${a.patientId?.firstName} ${moment(a.appointmentDate).fromNow()}`,
            timestamp: new Date(),
        }));

        if (upcoming.length > 0) {
            setNotifications(prev => {
                const existingIds = new Set(prev.map(n => n.id));
                const newNotifications = upcoming.filter(u => !existingIds.has(u.id));
                newNotifications.forEach(n => toast.info(n.message, { icon: '🔔' }));
                return [...prev, ...newNotifications];
            });
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    useEffect(() => {
        if (autoRefresh) {
            const id = setInterval(() => fetchData(false), 300000); // 5 mins
            setRefreshIntervalId(id);
            return () => clearInterval(id);
        } else if (refreshIntervalId) {
            clearInterval(refreshIntervalId);
            setRefreshIntervalId(null);
        }
    }, [autoRefresh, fetchData]);

    const handleScheduleChange = (dayName, updatedDayData) => {
      setSchedule(prev => prev.map(day => day.dayOfWeek === dayName ? { ...day, ...updatedDayData } : day));
    };

    const handleSaveSchedule = async () => {
        setIsSaving(true);
        const toastId = toast.loading('Saving schedule...');
        try {
            const workingDays = schedule.filter(d => d.isEnabled).map(({ isEnabled, ...rest }) => rest);
            await apiService.addOrUpdateSchedule({ doctorId: user.id, workingDays });
            toast.success('Schedule saved successfully!', { id: toastId });
            setIsSettingsModalOpen(false);
            await fetchData(false);
        } catch (error) {
            toast.error(`Failed to save: ${error.message}`, { id: toastId });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleUpdateStatus = async (id, status) => {
        const toastId = toast.loading(`Updating status to ${status}...`);
        try {
          await apiService.updateAppointmentStatus(id, status);
          toast.success("Status updated!", { id: toastId });
          fetchData(false);
          setIsAppointmentModalOpen(false);
        } catch (error) {
          toast.error(error.message, { id: toastId });
        }
    };
    
    const handleExport = async (format = 'json') => {
        toast.promise(
            apiService.exportSchedule({ doctorId: user.id, format, timezone }),
            {
                loading: `Exporting as ${format.toUpperCase()}...`,
                success: (blob) => {
                    const url = window.URL.createObjectURL(new Blob([blob]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `schedule-${moment().format('YYYY-MM-DD')}.${format}`);
                    document.body.appendChild(link);
                    link.click();
                    link.parentNode.removeChild(link);
                    return 'Schedule exported successfully!';
                },
                error: 'Export failed!',
            }
        );
    };

    const filteredAppointments = useMemo(() => appointments.filter(appt => 
        (searchQuery === '' || `${appt.patientId?.firstName} ${appt.patientId?.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())) &&
        (statusFilter === 'all' || appt.status === statusFilter)
    ), [appointments, searchQuery, statusFilter]);

    const calendarEvents = useMemo(() => filteredAppointments.map(appt => {
        const [hours, minutes] = appt.slot.split(':').map(Number);
        const start = moment(appt.appointmentDate).hour(hours).minute(minutes).toDate();
        const status = APPOINTMENT_STATUS_CONFIG[appt.status] || APPOINTMENT_STATUS_CONFIG.Scheduled;
        return { id: appt._id, title: `${appt.patientId?.firstName} ${appt.patientId?.lastName}`, start, end: moment(start).add(30, 'minutes').toDate(), resource: appt, style: { backgroundColor: status.color, color: status.textColor, borderRadius: '4px', border: 'none', fontSize: '12px', padding: '2px 4px' }};
    }), [filteredAppointments]);

    const { min, max } = useMemo(() => {
        const workTimes = schedule.filter(s => s.isEnabled).map(s => parseInt(s.startTime.split(':')[0]));
        if (workTimes.length === 0) return { min: moment().startOf('day').add(8, 'hours').toDate(), max: moment().startOf('day').add(18, 'hours').toDate() };
        return { min: moment().startOf('day').add(Math.min(...workTimes), 'hours').toDate(), max: moment().startOf('day').add(Math.max(...schedule.filter(s => s.isEnabled).map(s => parseInt(s.endTime.split(':')[0]))), 'hours').toDate() };
    }, [schedule]);

    return (
        <>
            <PageHeader
                title="My Schedule"
                subtitle={`View your appointments and manage your weekly availability. (${moment().tz(timezone).format('z')})`}
                actions={<Button onClick={() => setIsSettingsModalOpen(true)}><Settings className="w-4 h-4 mr-2" /> Schedule Settings</Button>}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <Card className="p-4"><div className="flex items-center"><div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg mr-3"><CalendarIcon className="w-5 h-5 text-blue-600" /></div><div><p className="text-sm text-gray-600">Today ({statistics.todayCompleted || 0}/{statistics.todayTotal || 0})</p><p className="text-2xl font-semibold">{statistics.todayTotal || 0}</p></div></div></Card>
                <Card className="p-4"><div className="flex items-center"><div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg mr-3"><Users className="w-5 h-5 text-green-600" /></div><div><p className="text-sm text-gray-600">This Week</p><p className="text-2xl font-semibold">{statistics.weekTotal || 0}</p></div></div></Card>
                <Card className="p-4"><div className="flex items-center"><div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg mr-3"><Clock className="w-5 h-5 text-purple-600" /></div><div><p className="text-sm text-gray-600">This Month</p><p className="text-2xl font-semibold">{statistics.monthTotal || 0}</p></div></div></Card>
                <Card className="p-4"><div className="flex items-center"><div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg mr-3"><Bell className="w-5 h-5 text-orange-600" /></div><div><p className="text-sm text-gray-600">Upcoming</p><p className="text-2xl font-semibold">{statistics.upcomingCount || 0}</p></div></div></Card>
            </div>

            <Card>
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-t-lg">
                    <div className="flex items-center gap-2"><div className="relative"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 border rounded-lg text-sm dark:bg-slate-700 dark:border-slate-600" /></div><select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="py-2 border rounded-lg text-sm dark:bg-slate-700 dark:border-slate-600"><option value="all">All Status</option>{Object.entries(APPOINTMENT_STATUS_CONFIG).map(([key, s]) => (<option key={key} value={key}>{s.label}</option>))}</select></div>
                    <div className="flex items-center gap-2"><div className="flex bg-white dark:bg-slate-700 rounded-lg border dark:border-slate-600">{VIEW_OPTIONS.map(o => { const Icon = o.icon; return (<button key={o.value} onClick={() => setCurrentView(o.value)} className={`px-3 py-2 text-sm rounded-md transition-colors ${currentView === o.value ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-200' : 'hover:bg-gray-100 dark:hover:bg-slate-600'}`}><Icon className="w-4 h-4 mr-1 inline-block"/>{o.label}</button>)})}</div><Button variant="secondary" size="sm" onClick={() => fetchData()} loading={loading}><RefreshCw className="w-4 h-4 mr-1"/>Refresh</Button><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} className="rounded"/>Auto</label></div>
                </div>
                {loading ? <div className="h-[70vh] flex items-center justify-center"><Spinner size="lg" /></div> : (
                    <div className="h-[75vh] p-4"><Calendar localizer={localizer} events={calendarEvents} startAccessor="start" endAccessor="end" view={currentView} onView={setCurrentView} date={selectedDate} onNavigate={setSelectedDate} views={['week', 'day', 'agenda']} min={min} max={max} step={30} timeslots={2} onSelectEvent={(e) => { setSelectedAppointment(e.resource); setIsAppointmentModalOpen(true); }} eventPropGetter={(e) => ({ style: e.style })}/></div>
                )}
            </Card>

            <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Manage Weekly Availability" size="2xl">
                <div className="divide-y divide-gray-200 dark:divide-slate-700 max-h-[70vh] overflow-y-auto p-1">{schedule.map(dayData => <DayScheduleRow key={dayData.dayOfWeek} dayData={dayData} onChange={handleScheduleChange} />)}</div>
                <div className="flex justify-end gap-2 pt-4 mt-4 border-t dark:border-slate-700"><Button variant="secondary" onClick={() => setIsSettingsModalOpen(false)}>Cancel</Button><Button onClick={handleSaveSchedule} loading={isSaving}><Save className="w-4 h-4 mr-2"/> Save Changes</Button></div>
            </Modal>

            <Modal isOpen={isAppointmentModalOpen} onClose={() => setIsAppointmentModalOpen(false)} title="Appointment Details">
                {selectedAppointment && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-start"><div><h3 className="text-lg font-semibold">{selectedAppointment.patientId?.firstName} {selectedAppointment.patientId?.lastName}</h3><p className="text-gray-600 dark:text-gray-400">{moment(selectedAppointment.appointmentDate).format('MMMM Do, YYYY')} at {selectedAppointment.slot}</p></div><StatusBadge status={selectedAppointment.status}/></div>
                        <div className="flex items-center gap-4"><Phone className="w-4 h-4 text-gray-500" /><span>{selectedAppointment.patientId?.phoneNumber}</span></div>
                        <div className="flex items-center gap-4"><Mail className="w-4 h-4 text-gray-500" /><span>{selectedAppointment.patientId?.email}</span></div>
                        <div className="flex flex-wrap gap-2 pt-4 border-t dark:border-slate-700">
                            {selectedAppointment.status === 'Scheduled' && (<Button size="sm" variant="secondary" onClick={() => handleUpdateStatus(selectedAppointment._id, 'Confirmed')}>Confirm</Button>)}
                            {['Scheduled', 'Confirmed'].includes(selectedAppointment.status) && (<Button size="sm" onClick={() => handleUpdateStatus(selectedAppointment._id, 'In Progress')}><Play className="w-4 h-4 mr-1"/> Start</Button>)}
                            {selectedAppointment.status === 'In Progress' && (<Button size="sm" variant="success" onClick={() => handleUpdateStatus(selectedAppointment._id, 'Completed')}><CheckCircle className="w-4 h-4 mr-1"/> Complete</Button>)}
                            {!['Completed', 'Cancelled', 'No Show'].includes(selectedAppointment.status) && (<Button size="sm" variant="danger" onClick={() => handleUpdateStatus(selectedAppointment._id, 'Cancelled')}><XCircle className="w-4 h-4 mr-1"/> Cancel</Button>)}
                            {['Scheduled', 'Confirmed'].includes(selectedAppointment.status) && (<Button size="sm" variant="warning" onClick={() => handleUpdateStatus(selectedAppointment._id, 'No Show')}>No Show</Button>)}
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default MySchedulePage;