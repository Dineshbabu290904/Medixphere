import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const SubMenu = ({ item, sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(
    item.submenu.some(subItem => location.pathname.startsWith(subItem.path))
  );

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };

  return (
    <li className="relative">
      <button
        onClick={toggleSubMenu}
        className={`group flex items-center p-3 rounded-xl transition-all duration-200 relative overflow-hidden w-full ${
          isSubMenuOpen ? 'text-white' : 'hover:bg-slate-800/60 text-slate-300 hover:text-white'
        }`}
      >
        <div className={`p-2 rounded-lg transition-all duration-200 ${
          isSubMenuOpen ? 'bg-slate-700 text-white shadow-lg' : 'bg-slate-800/50 group-hover:bg-slate-700/70'
        }`}>
          <item.icon className="w-5 h-5" />
        </div>
        <span className="ml-3 font-medium flex-1 text-left">{item.name}</span>
        <ChevronRight
          className={`w-4 h-4 transition-transform duration-200 ${
            isSubMenuOpen ? 'rotate-90' : ''
          }`}
        />
      </button>
      {isSubMenuOpen && (
        <ul className="pl-8 pt-2 space-y-1">
          {item.submenu.map((subItem) => (
            <li key={subItem.name}>
              <NavLink
                to={subItem.path}
                className={({ isActive }) =>
                  `flex items-center p-2 rounded-md text-sm transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`
                }
                onClick={() => sidebarOpen && setSidebarOpen(false)}
              >
                {subItem.name}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default SubMenu;
