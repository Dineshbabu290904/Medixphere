import React, { useState, useEffect, createContext, useContext } from 'react';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const loginid = localStorage.getItem('loginid');
    const id = localStorage.getItem('id'); // Retrieve the _id

    if (token && role && loginid && id) { // Check for id as well
      setUser({ token, role, loginid, id });
    }
    setLoading(false);
  }, []);

  const login = async (role, credentials) => {
    const response = await apiService.login(role, credentials);
    if (response.success) {
      const userData = { ...response, role };
      localStorage.setItem('token', userData.token);
      localStorage.setItem('role', userData.role);
      localStorage.setItem('loginid', userData.loginid);
      localStorage.setItem('id', userData.id); // Store the _id
      setUser(userData);
      return userData;
    } else {
      throw new Error(response.message || 'Login failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('loginid');
    localStorage.removeItem('id'); // Remove the _id
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};