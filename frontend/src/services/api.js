import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const handleResponse = (response) => response.data;

const handleError = (error) => {
  const message = error.response?.data?.message || error.message || 'An unknown error occurred.';
  
  if (error.response?.status === 401) {
    localStorage.clear();
    toast.error("Session expired. Please log in again.");
    // Small delay to allow toast to be seen before redirect
    setTimeout(() => {
        window.location.href = '/login';
    }, 1500);
  } else {
    toast.error(message);
  }
  
  throw new Error(message);
};

export const apiService = {
  // --- Core ---
  request: (endpoint, options = {}) => {
    const config = {
        method: options.method || 'GET',
        url: endpoint,
        data: options.body,
        params: options.params,
        ...options
    };
    return api(config).then(handleResponse).catch(handleError);
  },

  // --- Authentication ---
  login: (role, credentials) => api.post(`/${role}/auth/login`, credentials).then(handleResponse).catch(handleError),
  register: (role, data) => api.post(`/${role}/auth/register`, data).then(handleResponse).catch(handleError),
  changePassword: (role, id, passwords) => api.put(`/${role}/auth/update/${id}`, passwords).then(handleResponse).catch(handleError),

  // --- User & Profile Details ---
  getDetails: (role, params = {}) => api.post(`/${role}/details/getDetails`, params).then(handleResponse).catch(handleError),
  addDetails: (role, formData) => api.post(`/${role}/details/addDetails`, formData).then(handleResponse).catch(handleError),
  updateDetails: (role, id, formData) => api.put(`/${role}/details/updateDetails/${id}`, formData).then(handleResponse).catch(handleError),
  getCount: (role, params = {}) => api.get(`/${role}/details/count`, { params }).then(handleResponse).catch(handleError),

  // --- Departments ---
  getDepartments: () => api.get('/department/getDepartment').then(handleResponse).catch(handleError),
  addDepartment: (data) => api.post('/department/addDepartment', data).then(handleResponse).catch(handleError),

  // --- Roles & Permissions ---
  getRoles: () => api.get('/auth/role/getAll').then(handleResponse).catch(handleError),

  // --- Notices ---
  getNotices: (params = {}) => api.post('/notice/getNotice', params).then(handleResponse).catch(handleError),
  addNotice: (data) => api.post('/notice/addNotice', data).then(handleResponse).catch(handleError),
  updateNotice: (id, data) => api.put(`/notice/updateNotice/${id}`, data).then(handleResponse).catch(handleError),
  deleteNotice: (id) => api.delete(`/notice/deleteNotice/${id}`).then(handleResponse).catch(handleError),

  // --- Critical Care (ICU Flow Chart) ---
  getCriticalCareChart: (patientId) => api.get(`/flow-chart/get/${patientId}`).then(handleResponse).catch(handleError),
  
  // NEW: Specific function for adding a new time slot record
  addCriticalCareTimeSlot: (patientId, data) => api.post(`/flow-chart/add/${patientId}`, data).then(handleResponse).catch(handleError),

  // NEW: Specific function for updating an existing time slot record
  updateCriticalCareTimeSlot: (patientId, dayId, slotId, data) => api.put(`/flow-chart/update/${patientId}/${dayId}/${slotId}`, data).then(handleResponse).catch(handleError),
  
  // NEW: Specific function for updating header fields
  updateCriticalCareHeader: (patientId, data) => api.put(`/flow-chart/update-header/${patientId}`, data).then(handleResponse).catch(handleError),

  // --- Appointments ---
  getAppointments: (params = {}) => api.get('/appointment/getAll', { params }).then(handleResponse).catch(handleError),
  getAppointmentCount: (params = {}) => api.get('/appointment/count', { params }).then(handleResponse).catch(handleError),
  updateAppointmentStatus: (id, status) => api.put(`/appointment/update/${id}`, { status }).then(handleResponse).catch(handleError),

   // --- Schedules ---
  getSchedules: (params = {}) => api.post('/schedule/getSchedule', params).then(handleResponse).catch(handleError),
  addOrUpdateSchedule: (data) => api.post('/schedule/addOrUpdateSchedule', data).then(handleResponse).catch(handleError),
  getDoctorAvailability: (doctorId, date) => api.get(`/schedule/getDoctorAvailability`, { params: { doctorId, date } }).then(handleResponse).catch(handleError),
  exportSchedule: (params) => api.get('/schedule/export', { params, responseType: 'blob' }).then(handleResponse).catch(handleError), // New export function
  
  // --- Activity Log ---
  getRecentActivities: (limit = 5) => api.get(`/activity/recent?limit=${limit}`).then(handleResponse).catch(handleError),
  
  // --- Patient Records ---
  getPatientRecords: (patientId) => api.post('/patientrecord/getPatientRecord', { patientId }).then(handleResponse).catch(handleError),

  // --- LIS (LABORATORY) ---
  getLabTests: () => api.get('/lis/lab-tests').then(handleResponse).catch(handleError),
  createLabTest: (data) => api.post('/lis/lab-tests', data).then(handleResponse).catch(handleError),
  updateLabTest: (id, data) => api.put(`/lis/lab-tests/${id}`, data).then(handleResponse).catch(handleError),
  deleteLabTest: (id) => api.delete(`/lis/lab-tests/${id}`).then(handleResponse).catch(handleError),
  getLabReports: () => api.get('/lis/lab-reports').then(handleResponse).catch(handleError),
  createLabReport: (data) => api.post('/lis/lab-reports', data).then(handleResponse).catch(handleError),
  updateLabReport: (id, data) => api.put(`/lis/lab-reports/${id}`, data).then(handleResponse).catch(handleError),

  // --- RIS (RADIOLOGY) ---
  getRadiologyTests: () => api.get('/ris/radiology-tests').then(handleResponse).catch(handleError),
  updateRadiologyTest: (id, data) => api.put(`/ris/radiology-tests/${id}`, data).then(handleResponse).catch(handleError),
  getRadiologyReports: () => api.get('/ris/radiology-reports').then(handleResponse).catch(handleError),
  updateRadiologyReport: (id, data) => api.put(`/ris/radiology-reports/${id}`, data).then(handleResponse).catch(handleError),

  // --- BILLING ---
  getServices: () => api.get('/billing/services').then(handleResponse).catch(handleError),
  updateService: (id, data) => api.put(`/billing/services/${id}`, data).then(handleResponse).catch(handleError),
  getInvoices: () => api.get('/billing/invoices').then(handleResponse).catch(handleError),
  updateInvoice: (id, data) => api.put(`/billing/invoices/${id}`, data).then(handleResponse).catch(handleError),

  // --- PHARMACY ---
  getMedicines: () => api.get('/pharmacy/medicines').then(handleResponse).catch(handleError),
  updateMedicine: (id, data) => api.put(`/pharmacy/medicines/${id}`, data).then(handleResponse).catch(handleError),
  getDispenses: () => api.get('/pharmacy/dispenses').then(handleResponse).catch(handleError),
  updateDispense: (id, data) => api.put(`/pharmacy/dispenses/${id}`, data).then(handleResponse).catch(handleError),

  // --- IPD ---
  getWards: () => api.get('/ipd/wards').then(handleResponse).catch(handleError),
  updateWard: (id, data) => api.put(`/ipd/wards/${id}`, data).then(handleResponse).catch(handleError),
  getBeds: () => api.get('/ipd/beds').then(handleResponse).catch(handleError),
  updateBed: (id, data) => api.put(`/ipd/beds/${id}`, data).then(handleResponse).catch(handleError),
};