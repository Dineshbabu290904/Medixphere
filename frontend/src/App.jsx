import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/admin/DashboardPage';
import DoctorDashboardPage from './pages/doctor/DashboardPage';
import PatientDashboard from './pages/patient/DashboardPage';
import Spinner from './components/ui/Spinner';
import ProtectedRoute from './components/router/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-slate-50 dark:bg-slate-900"><Spinner size="lg" /></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={user ? <Navigate to={`/${user.role}/`} /> : <LoginPage />} />
        
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['doctor']} />}>
          <Route path="/doctor/*" element={<DoctorDashboardPage />} />
        </Route>
        
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/patient/*" element={<PatientDashboard />} />
        </Route>
        
        {/* Redirect root path based on authentication status */}
        <Route path="/" element={<Navigate to={user ? `/${user.role}/dashboard` : '/login'} />} />
        
        {/* Fallback for any other unmatched routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;