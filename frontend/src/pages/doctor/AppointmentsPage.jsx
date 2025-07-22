import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import toast from 'react-hot-toast';
import PageHeader from '@/components/ui/PageHeader';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { 
  CheckCircle, 
  XCircle, 
  Eye, 
  Play, 
  MoreVertical, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  User,
  Phone,
  MessageSquare,
  RefreshCw,
  Download,
  ChevronDown,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '@/components/ui/StatusBadge';

const DoctorAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Scheduled');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointments, setSelectedAppointments] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'appointmentDate', direction: 'asc' });
  const { user } = useAuth();

  const fetchAppointments = useCallback(async (showRefreshIndicator = false) => {
    if (!user?.id) return;
    
    if (showRefreshIndicator) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await apiService.getAppointments({ doctorId: user.id });
      setAppointments(response.appointments || []);
    } catch (error) {
      toast.error("Could not fetch your appointments.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleUpdateStatus = async (id, status) => {
    const toastId = toast.loading(`Updating status to ${status}...`);
    try {
      await apiService.updateAppointmentStatus(id, status);
      toast.success("Status updated successfully!", { id: toastId });
      fetchAppointments(true);
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedAppointments.length === 0) {
      toast.error("Please select appointments first.");
      return;
    }

    const toastId = toast.loading(`${action}ing selected appointments...`);
    try {
      await Promise.all(
        selectedAppointments.map(id => 
          apiService.updateAppointmentStatus(id, action)
        )
      );
      toast.success(`${selectedAppointments.length} appointments ${action.toLowerCase()}ed!`, { id: toastId });
      setSelectedAppointments([]);
      fetchAppointments(true);
    } catch (error) {
      toast.error(error.message, { id: toastId });
    }
  };

  const filteredAndSortedAppointments = useMemo(() => {
    let filtered = appointments;

    // Filter by tab
    if (activeTab === 'Scheduled') {
      filtered = filtered.filter(a => ['Scheduled', 'Confirmed', 'In Progress'].includes(a.status));
    } else {
      filtered = filtered.filter(appt => appt.status === activeTab);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(appt => {
        const patientName = `${appt.patientId?.firstName} ${appt.patientId?.lastName}`.toLowerCase();
        const patientId = appt.patientId?.patientId?.toLowerCase() || '';
        return patientName.includes(searchTerm.toLowerCase()) || 
               patientId.includes(searchTerm.toLowerCase());
      });
    }

    // Date filter
    if (dateFilter) {
      filtered = filtered.filter(appt => {
        const apptDate = new Date(appt.appointmentDate).toISOString().split('T')[0];
        return apptDate === dateFilter;
      });
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === 'patientName') {
        aValue = `${a.patientId?.firstName} ${a.patientId?.lastName}`;
        bValue = `${b.patientId?.firstName} ${b.patientId?.lastName}`;
      } else if (sortConfig.key === 'appointmentDate') {
        aValue = new Date(a.appointmentDate);
        bValue = new Date(b.appointmentDate);
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [appointments, activeTab, searchTerm, dateFilter, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const toggleSelectAll = () => {
    if (selectedAppointments.length === filteredAndSortedAppointments.length) {
      setSelectedAppointments([]);
    } else {
      setSelectedAppointments(filteredAndSortedAppointments.map(appt => appt._id));
    }
  };

  const toggleSelectAppointment = (id) => {
    setSelectedAppointments(prev => 
      prev.includes(id) 
        ? prev.filter(apptId => apptId !== id)
        : [...prev, id]
    );
  };

  const getTabCounts = useMemo(() => {
    return {
      'Scheduled': appointments.filter(a => ['Scheduled', 'Confirmed', 'In Progress'].includes(a.status)).length,
      'Completed': appointments.filter(a => a.status === 'Completed').length,
      'Cancelled': appointments.filter(a => a.status === 'Cancelled').length,
      'No Show': appointments.filter(a => a.status === 'No Show').length
    };
  }, [appointments]);

  const getUpcomingCount = () => {
    const today = new Date();
    return appointments.filter(a => 
      ['Scheduled', 'Confirmed'].includes(a.status) && 
      new Date(a.appointmentDate) >= today
    ).length;
  };

  const TABS = ['Scheduled', 'Completed', 'Cancelled', 'No Show'];
  const tableHeaders = [
    { key: 'select', label: '', sortable: false },
    { key: 'patientName', label: 'Patient', sortable: true },
    { key: 'appointmentDate', label: 'Date & Time', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  const formatDateTime = (date, slot) => {
    const dateObj = new Date(date);
    const today = new Date();
    const isToday = dateObj.toDateString() === today.toDateString();
    const isTomorrow = dateObj.toDateString() === new Date(today.getTime() + 24 * 60 * 60 * 1000).toDateString();
    
    let dateStr = dateObj.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
    
    if (isToday) dateStr = 'Today';
    else if (isTomorrow) dateStr = 'Tomorrow';
    
    return { dateStr, timeStr: slot };
  };

  return (
    <>
      <PageHeader
        title="My Appointments"
        subtitle={`Manage all your patient consultations. ${getUpcomingCount()} upcoming appointments.`}
        action={
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => fetchAppointments(true)}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {TABS.map(tab => (
          <div 
            key={tab}
            className={`p-4 rounded-lg border cursor-pointer transition-colors ${
              activeTab === tab 
                ? 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700' 
                : 'bg-white border-gray-200 dark:bg-slate-800 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {getTabCounts[tab]}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {tab === 'Scheduled' ? 'Upcoming' : tab}
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-600"
            />
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedAppointments.length > 0 && (
          <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedAppointments.length} selected
            </span>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => handleBulkAction('Confirmed')}>
                Confirm All
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Cancelled')}>
                Cancel All
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <Table headers={tableHeaders.map(h => h.label)} loading={loading}>
        {loading ? (
          <Table.Row>
            <Table.Cell colSpan={tableHeaders.length} className="text-center p-8">
              <Spinner />
            </Table.Cell>
          </Table.Row>
        ) : filteredAndSortedAppointments.length > 0 ? (
          filteredAndSortedAppointments.map((appt) => {
            const { dateStr, timeStr } = formatDateTime(appt.appointmentDate, appt.slot);
            const isSelected = selectedAppointments.includes(appt._id);
            const isUpcoming = new Date(appt.appointmentDate) >= new Date() && ['Scheduled', 'Confirmed'].includes(appt.status);
            
            return (
              <Table.Row key={appt._id} className={isSelected ? 'bg-blue-50 dark:bg-blue-900/10' : ''}>
                <Table.Cell>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelectAppointment(appt._id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 dark:bg-slate-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {appt.patientId?.firstName} {appt.patientId?.lastName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ID: {appt.patientId?.patientId}
                      </p>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <div>
                      <div className={`flex items-center gap-1 ${isUpcoming ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
                        <Calendar className="w-4 h-4" />
                        <span className="font-medium">{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>{timeStr}</span>
                      </div>
                    </div>
                    {isUpcoming && (
                      <div className="ml-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      </div>
                    )}
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <StatusBadge status={appt.status} />
                </Table.Cell>
                <Table.Cell>
                  <div className="flex items-center gap-2">
                    <Link to={`/doctor/patient-details/${appt.patientId?.patientId}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-1" />
                        EMR
                      </Button>
                    </Link>
                    
                    {/* Quick contact actions */}
                    <Button variant="ghost" size="sm" title="Call Patient">
                      <Phone className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title="Message Patient">
                      <MessageSquare className="w-4 h-4" />
                    </Button>

                    {['Scheduled', 'Confirmed'].includes(appt.status) && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleUpdateStatus(appt._id, 'In Progress')}
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Start
                      </Button>
                    )}
                    
                    {appt.status === 'In Progress' && (
                      <Button 
                        variant="success" 
                        size="sm" 
                        onClick={() => handleUpdateStatus(appt._id, 'Completed')}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Complete
                      </Button>
                    )}
                    
                    {['Scheduled', 'Confirmed', 'In Progress'].includes(appt.status) && (
                      <div className="relative group">
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 shadow-lg border border-gray-200 dark:border-slate-700 rounded-md py-1 z-10 hidden group-hover:block">
                          {appt.status === 'Scheduled' && (
                            <button 
                              onClick={() => handleUpdateStatus(appt._id, 'Confirmed')} 
                              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              Confirm
                            </button>
                          )}
                          <button 
                            onClick={() => handleUpdateStatus(appt._id, 'Cancelled')} 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 text-red-600 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(appt._id, 'No Show')} 
                            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-slate-700 text-orange-600 flex items-center gap-2"
                          >
                            <AlertCircle className="w-4 h-4" />
                            Mark as No Show
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })
        ) : (
          <Table.Row>
            <Table.Cell colSpan={tableHeaders.length} className="text-center text-gray-500 py-12">
              <div className="flex flex-col items-center gap-2">
                <Calendar className="w-8 h-8 text-gray-400" />
                <p>No {activeTab.toLowerCase()} appointments found.</p>
                {searchTerm || dateFilter ? (
                  <Button 
                    variant="link" 
                    size="sm" 
                    onClick={() => {
                      setSearchTerm('');
                      setDateFilter('');
                    }}
                  >
                    Clear filters
                  </Button>
                ) : null}
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </Table>
    </>
  );
};

export default DoctorAppointmentsPage;