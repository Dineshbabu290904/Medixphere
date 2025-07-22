import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';

const DashboardLayout = ({ children, sidebarNavItems }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <Sidebar navItems={sidebarNavItems} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;