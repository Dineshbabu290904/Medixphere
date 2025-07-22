import React, { useState, useEffect, useRef } from 'react';
import { apiService } from '../../services/api';
import toast from 'react-hot-toast';
import { 
  Search, 
  X, 
  User, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Filter, 
  Activity, 
  Heart,
  AlertTriangle,
  CheckCircle2,
  FileText,
  History,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import FlowChart from '@/components/doctor/FlowChart';

const CriticalCareChartPage = () => {
  const [patientIdInput, setPatientIdInput] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [allPatients, setAllPatients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    category: 'all', // all, name, id, department
    priority: 'all', // all, critical, high, normal
    status: 'all' // all, admitted, discharged
  });
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [patientStats, setPatientStats] = useState({
    total: 0,
    critical: 0,
    admitted: 0
  });

  const inputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Load patients and calculate stats
  useEffect(() => {
    fetchAllPatients();
    loadSearchHistory();
  }, []);

  const fetchAllPatients = async () => {
    setIsLoading(true);
    try {
      const res = await apiService.request('/patient/details/getAllDetails');
      if (res.success) {
        setAllPatients(res.users);
        calculatePatientStats(res.users);
      }
    } catch (e) {
      toast.error("Could not load patient list for search.");
      console.error('Error fetching patients:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPatientData = async () => {
    setIsRefreshing(true);
    await fetchAllPatients();
    setIsRefreshing(false);
    toast.success("Patient data refreshed");
  };

  const calculatePatientStats = (patients) => {
    const stats = {
      total: patients.length,
      critical: patients.filter(p => p.priority === 'critical').length,
      admitted: patients.filter(p => p.status === 'admitted').length
    };
    setPatientStats(stats);
  };

  const loadSearchHistory = () => {
    const history = localStorage.getItem('cchart_search_history');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  };

  const saveSearchHistory = (patient) => {
    const newHistoryItem = {
      id: patient._id,
      name: `${patient.firstName} ${patient.lastName}`,
      patientId: patient.patientId,
      timestamp: new Date().toISOString(),
      priority: patient.priority || 'normal'
    };
    
    const updatedHistory = [
      newHistoryItem,
      ...searchHistory.filter(item => item.id !== patient._id)
    ].slice(0, 5);
    
    setSearchHistory(updatedHistory);
    localStorage.setItem('cchart_search_history', JSON.stringify(updatedHistory));
  };

  const filterPatients = (query) => {
    if (!query.trim() || query.length < 2) return [];
    
    const searchTerm = query.toLowerCase();
    return allPatients.filter(patient => {
      // Apply status filter
      const matchesStatus = searchFilters.status === 'all' || patient.status === searchFilters.status;
      const matchesPriority = searchFilters.priority === 'all' || patient.priority === searchFilters.priority;
      
      let matchesCategory = false;
      switch (searchFilters.category) {
        case 'name':
          matchesCategory = patient.firstName.toLowerCase().includes(searchTerm) ||
                           patient.lastName.toLowerCase().includes(searchTerm);
          break;
        case 'id':
          matchesCategory = patient.patientId.toLowerCase().includes(searchTerm);
          break;
        case 'department':
          matchesCategory = patient.department?.toLowerCase().includes(searchTerm);
          break;
        default:
          matchesCategory = patient.firstName.toLowerCase().includes(searchTerm) ||
                           patient.lastName.toLowerCase().includes(searchTerm) ||
                           patient.patientId.toLowerCase().includes(searchTerm) ||
                           patient.department?.toLowerCase().includes(searchTerm);
      }
      
      return matchesStatus && matchesPriority && matchesCategory;
    }).slice(0, 8); // Show more results for critical care
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setPatientIdInput(value);
    setSelectedPatient(null);
    setFocusedIndex(-1);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      if (value.length > 1) {
        const filtered = filterPatients(value);
        setSuggestions(filtered);
      } else {
        setSuggestions([]);
      }
    }, 300);
  };

  const selectPatient = (patient) => {
    setPatientIdInput(`${patient.firstName} ${patient.lastName} (${patient.patientId})`);
    setSelectedPatient(patient);
    setSuggestions([]);
    setFocusedIndex(-1);
    saveSearchHistory(patient);
  };

  const clearSelection = () => {
    setSelectedPatient(null);
    setPatientIdInput('');
    setSuggestions([]);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (!suggestions.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev <= 0 ? suggestions.length - 1 : prev - 1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && suggestions[focusedIndex]) {
          selectPatient(suggestions[focusedIndex]);
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setFocusedIndex(-1);
        break;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'normal':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical':
        return <AlertTriangle className="h-3 w-3" />;
      case 'high':
        return <Activity className="h-3 w-3" />;
      case 'normal':
        return <CheckCircle2 className="h-3 w-3" />;
      default:
        return <Heart className="h-3 w-3" />;
    }
  };

  const formatLastAccessed = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <PageHeader
        title="Critical Care Flow Chart"
        subtitle="Search for a patient to view or update their ICU chart and monitoring data."
        breadcrumbs={['Doctor', 'Critical Care']}
      />

      {/* Patient Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">{patientStats.total}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Critical Cases</p>
              <p className="text-2xl font-bold text-red-600">{patientStats.critical}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Currently Admitted</p>
              <p className="text-2xl font-bold text-green-600">{patientStats.admitted}</p>
            </div>
            <Activity className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && !selectedPatient && (
        <Card className="mb-4 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Recent Patient Charts</span>
            </div>
            <button
              onClick={() => {
                setSearchHistory([]);
                localStorage.removeItem('cchart_search_history');
              }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {searchHistory.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  const patient = allPatients.find(p => p._id === item.id);
                  if (patient) selectPatient(patient);
                }}
                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg text-left transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className={`p-1 rounded-full border ${getPriorityColor(item.priority)}`}>
                  {getPriorityIcon(item.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.patientId} • {formatLastAccessed(item.timestamp)}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      )}

      {/* Enhanced Search Component */}
      <Card className="mb-6 overflow-visible">
        <div className="p-6">
          <div className="relative">
            <div className="flex items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  ref={inputRef}
                  type="text"
                  value={patientIdInput}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder={`Search patients by ${searchFilters.category === 'all' ? 'name, ID, or department' : searchFilters.category}...`}
                  className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                  disabled={!!selectedPatient || isLoading}
                />
                {isLoading && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              
              {/* Filter Toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                  showFilters 
                    ? 'bg-blue-50 border-blue-200 text-blue-600' 
                    : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-5 w-5" />
              </button>

              {/* Refresh Button */}
              <button
                onClick={refreshPatientData}
                disabled={isRefreshing}
                className="p-4 rounded-xl border-2 border-gray-200 text-gray-500 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
              >
                <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>

              {/* Clear/Change Button */}
              {selectedPatient && (
                <motion.button 
                  onClick={clearSelection}
                  className="bg-red-500 text-white px-6 py-4 rounded-xl hover:bg-red-600 transition-all duration-200 font-medium shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <X className="h-5 w-5" />
                </motion.button>
              )}
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Search Category</label>
                      <select
                        value={searchFilters.category}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Fields</option>
                        <option value="name">Name Only</option>
                        <option value="id">Patient ID</option>
                        <option value="department">Department</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Priority Level</label>
                      <select
                        value={searchFilters.priority}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Priorities</option>
                        <option value="critical">Critical Only</option>
                        <option value="high">High Priority</option>
                        <option value="normal">Normal Priority</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      <select
                        value={searchFilters.status}
                        onChange={(e) => setSearchFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Statuses</option>
                        <option value="admitted">Admitted</option>
                        <option value="discharged">Discharged</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Enhanced Suggestions */}
            <AnimatePresence>
              {suggestions.length > 0 && !selectedPatient && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-20 w-full bg-white border border-gray-200 rounded-xl mt-2 shadow-xl max-h-96 overflow-y-auto"
                >
                  {suggestions.map((patient, index) => (
                    <motion.div
                      key={patient._id}
                      onClick={() => selectPatient(patient)}
                      className={`px-4 py-4 cursor-pointer border-b border-gray-100 last:border-b-0 transition-all duration-150 ${
                        index === focusedIndex 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'hover:bg-gray-50'
                      }`}
                      whileHover={{ scale: 1.01 }}
                    >
                      <div className="flex items-start gap-4">
                        <img 
                          src={`${import.meta.env.VITE_MEDIA_LINK}/${patient.profile}`} 
                          alt={`${patient.firstName} ${patient.lastName}`}
                          className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                          onError={(e) => {
                            e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {patient.firstName} {patient.lastName}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(patient.priority || 'normal')}`}>
                                <div className="flex items-center gap-1">
                                  {getPriorityIcon(patient.priority || 'normal')}
                                  {patient.priority || 'normal'}
                                </div>
                              </span>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3" />
                              <span>{patient.patientId}</span>
                              {patient.department && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <span>{patient.department}</span>
                                </>
                              )}
                            </div>
                            {patient.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3" />
                                <span className="truncate">{patient.phone}</span>
                              </div>
                            )}
                            {patient.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3" />
                                <span className="truncate">{patient.email}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Card>
      
      {/* Flow Chart Section */}
      <div className="mt-6">
        {selectedPatient ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Patient Header */}
            <Card className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <div className="flex items-center gap-4">
                <img 
                  src={`${import.meta.env.VITE_MEDIA_LINK}/${selectedPatient.profile}`} 
                  alt={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                  onError={(e) => {
                    e.target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                  }}
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedPatient.firstName} {selectedPatient.lastName}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedPatient.priority || 'normal')}`}>
                      <div className="flex items-center gap-1">
                        {getPriorityIcon(selectedPatient.priority || 'normal')}
                        {selectedPatient.priority || 'normal'} priority
                      </div>
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>ID: {selectedPatient.patientId}</span>
                    </div>
                    {selectedPatient.department && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedPatient.department}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Chart accessed: {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <FlowChart key={selectedPatient._id} patient={selectedPatient} />
          </motion.div>
        ) : (
          <div className="text-center py-16 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 mt-6">
              <p className="text-lg font-medium">Please search for and select a patient to view their flow chart.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CriticalCareChartPage;