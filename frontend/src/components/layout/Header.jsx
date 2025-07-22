import React, { useState } from 'react';
import { Menu, LogOut, Bell, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className="text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/50 p-2 rounded-full transition-all duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
    </button>
  );
};

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm border-b border-slate-200/50 dark:border-slate-700/50 p-4 flex justify-between items-center sticky top-0 z-40 transition-all duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(true)} 
          className="text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 md:hidden p-2 rounded-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:block">
            <h1 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                Welcome, {user.role.charAt(0).toUpperCase() + user.role.slice(1)}!
            </h1>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 p-1.5 rounded-full transition-all duration-200"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {user.role.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline font-semibold text-sm text-slate-700 dark:text-slate-200">{user.email}</span>
            <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
          </button>
          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 shadow-xl border border-slate-200/50 dark:border-slate-700/50 rounded-lg py-1 z-20">
                <Link to={`/${user.role}/profile`} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2 text-slate-700 dark:text-slate-200">
                  <User className="w-4 h-4" /> Profile
                </Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-200 flex items-center gap-2 text-rose-500">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;