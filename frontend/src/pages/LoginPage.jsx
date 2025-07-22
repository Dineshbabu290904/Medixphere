import React, { useState } from 'react';
import { Activity, User, Key, Shield, Stethoscope, UserCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [role, setRole] = useState('admin');
  const [credentials, setCredentials] = useState({ loginid: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Signing in...');

    try {
      const loggedInUser = await login(role, credentials);
      toast.success('Login successful!', { id: toastId });
      navigate(`/${loggedInUser.role}`);
    } catch (err) {
      toast.error(err.message || 'Login failed. Please check credentials.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const roleConfig = {
    admin: {
      icon: Shield,
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      buttonColor: 'bg-purple-600 hover:bg-purple-700 focus:ring-purple-500',
      description: 'System Administration'
    },
    doctor: {
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500',
      description: 'Medical Professional'
    },
    patient: {
      icon: UserCheck,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      description: 'Patient Portal'
    }
  };

  const currentRole = roleConfig[role];
  const RoleIcon = currentRole.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Main card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-8 transition-all duration-300 hover:shadow-3xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className={`mx-auto w-20 h-20 ${currentRole.bgColor} rounded-2xl flex items-center justify-center mb-6 shadow-lg transform transition-all duration-300 hover:scale-105`}>
              <Activity className="w-10 h-10 text-gray-700" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              MediCare Portal
            </h1>
            <p className="text-gray-600 text-sm">Secure healthcare management system</p>
          </div>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Select Role</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(roleConfig).map(([key, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRole(key)}
                    className={`p-3 rounded-xl transition-all duration-200 flex flex-col items-center space-y-1 ${
                      role === key
                        ? `${config.bgColor} ring-2 ring-offset-2 ring-${key === 'admin' ? 'purple' : key === 'doctor' ? 'emerald' : 'blue'}-500 shadow-lg`
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${role === key ? config.iconColor : 'text-gray-500'}`} />
                    <span className={`text-xs font-medium ${role === key ? config.iconColor : 'text-gray-600'}`}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">{currentRole.description}</p>
          </div>

          <div className="space-y-6">
            {/* Login ID Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Login ID</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-gray-600" />
                <input
                  type="text"
                  value={credentials.loginid}
                  onChange={(e) => setCredentials({ ...credentials, loginid: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  placeholder="Enter your login ID"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">Password</label>
              <div className="relative group">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-gray-600" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              onClick={handleSubmit}
              className={`w-full ${currentRole.buttonColor} text-white py-3.5 px-6 rounded-xl font-semibold transition-all duration-200 transform ${
                loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 ${currentRole.buttonColor.includes('purple') ? 'focus:ring-purple-500' : currentRole.buttonColor.includes('emerald') ? 'focus:ring-emerald-500' : 'focus:ring-blue-500'}`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <RoleIcon className="w-5 h-5" />
                  <span>Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                </div>
              )}
            </button>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-600 text-center mb-2 font-medium">Demo Credentials</p>
            <div className="text-xs text-gray-500 text-center space-y-1">
              <p><strong>Login ID:</strong> demo</p>
              <p><strong>Password:</strong> password</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            Secure • Encrypted • HIPAA Compliant
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;