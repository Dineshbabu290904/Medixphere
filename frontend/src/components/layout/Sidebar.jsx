import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  X, 
  Activity, 
  LogOut, 
  ChevronRight, 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = ({ navItems, sidebarOpen = true, setSidebarOpen = () => {} }) => {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    setSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 bg-slate-900 text-white w-64 transform transition-transform duration-300 ease-in-out z-50 md:relative md:translate-x-0 shadow-2xl border-r border-slate-800 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 -left-10 w-24 h-24 bg-blue-600/5 rounded-full blur-xl" />
          <div className="absolute bottom-40 -right-10 w-24 h-24 bg-cyan-600/5 rounded-full blur-xl" />
        </div>

        {/* Header */}
        <div className="relative flex-shrink-0">
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">HMS</h1>
                <p className="text-xs text-slate-400">Health Management</p>
              </div>
            </div>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="md:hidden p-2 hover:bg-slate-800/60 rounded-lg transition-colors group"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <ul className="space-y-1">
            {navItems.map((item, index) => (
                <li key={item.name} className="relative">
                  <NavLink
                    to={item.path}
                    end={index === 0} 
                    // Destructure isActive here and pass it to children
                    className={({ isActive }) => {
                      // Store isActive for use in children
                      return [
                        'group flex items-center p-3 rounded-lg transition-all duration-200 relative overflow-hidden transform hover:bg-slate-800/50',
                        isActive
                          ? 'bg-blue-600/90 text-white shadow-md' 
                          : 'text-slate-300 hover:text-white'
                      ].join(' ');
                    }}
                    onClick={() => sidebarOpen && setSidebarOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator */}
                        <div className={`absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 transition-transform duration-300 rounded-r-full ${
                          isActive ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-50'
                        }`} />
                        
                        {/* Icon container */}
                        <div className={`relative p-2 rounded-lg transition-all duration-300 ${
                          isActive ? 'bg-white/10' : 'bg-slate-800/60'
                        }`}>
                          <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
                        </div>
                        
                        {/* Text */}
                        <span className="ml-3 font-medium flex-1">
                          {item.name}
                        </span>
                        
                        {/* Arrow indicator */}
                        <ChevronRight className={`w-5 h-5 transition-all duration-300 ${
                          isActive 
                            ? 'opacity-100 translate-x-0' 
                            : 'opacity-0 -translate-x-2 group-hover:opacity-70 group-hover:translate-x-0'
                        }`} />
                      </>
                    )}
                  </NavLink>
                </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center p-3 text-slate-300 hover:text-white hover:bg-rose-600/20 rounded-lg transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-rose-400 group-hover:text-rose-300" />
            <span className="ml-3 font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;