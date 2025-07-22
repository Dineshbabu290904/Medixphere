import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Enhanced PageHeader Component with functional breadcrumbs
const PageHeader = ({ 
  title, 
  subtitle, 
  actions, 
  breadcrumbs,
  showHomeIcon = true,
  className = '',
  animated = true 
}) => {
  const navigate = useNavigate();

  // Handle breadcrumb click for non-link breadcrumbs
  const handleBreadcrumbClick = (crumb) => {
    if (crumb.onClick) {
      crumb.onClick();
    } else if (crumb.path) {
      navigate(crumb.path);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const MotionComponent = animated ? motion.div : 'div';

  return (
    <MotionComponent
      variants={animated ? containerVariants : undefined}
      initial={animated ? "hidden" : undefined}
      animate={animated ? "visible" : undefined}
      className={`relative ${className}`}
    >
      {breadcrumbs && breadcrumbs.length > 0 && (
        <motion.nav 
          variants={animated ? itemVariants : undefined}
          className="flex mb-4" 
          aria-label="Breadcrumb"
        >
          <ol className="flex items-center space-x-1 text-sm">
            {showHomeIcon && (
              <li className="flex items-center">
                <Link 
                  to="/" 
                  className="inline-flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                </Link>
                <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
              </li>
            )}
            
            {breadcrumbs.map((crumb, index) => {
              const isLast = index === breadcrumbs.length - 1;
              const isClickable = !isLast && (crumb.path || crumb.onClick || typeof crumb === 'object');
              
              return (
                <li key={index} className="flex items-center">
                  {index > 0 && !showHomeIcon && (
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                  )}
                  {index > 0 && showHomeIcon && (
                    <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
                  )}
                  
                  {/* Handle different breadcrumb formats */}
                  {typeof crumb === 'string' ? (
                    <span className={isLast 
                      ? 'font-medium text-gray-800 dark:text-gray-200' 
                      : 'text-gray-500 dark:text-gray-400'
                    }>
                      {crumb}
                    </span>
                  ) : crumb.path && !isLast ? (
                    <Link
                      to={crumb.path}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 hover:underline"
                    >
                      {crumb.label || crumb.title}
                    </Link>
                  ) : isClickable && !isLast ? (
                    <button
                      onClick={() => handleBreadcrumbClick(crumb)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded"
                    >
                      {crumb.label || crumb.title || crumb}
                    </button>
                  ) : (
                    <span 
                      className={`${isLast 
                        ? 'font-medium text-gray-800 dark:text-gray-200' 
                        : 'text-gray-500 dark:text-gray-400'
                      } ${crumb.className || ''}`}
                    >
                      {crumb.label || crumb.title || crumb}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </motion.nav>
      )}
      
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
        <div className="flex-1">
          <motion.h1 
            variants={animated ? itemVariants : undefined}
            className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent leading-tight"
          >
            {title}
          </motion.h1>
          {subtitle && (
            <motion.p 
              variants={animated ? itemVariants : undefined}
              className="mt-3 text-lg text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
        
        {actions && (
          <motion.div 
            variants={animated ? itemVariants : undefined}
            className="mt-6 lg:mt-0 flex-shrink-0"
          >
            <div className="flex flex-wrap items-center gap-3">
              {Array.isArray(actions) ? actions.map((action, index) => (
                <div key={index}>{action}</div>
              )) : actions}
            </div>
          </motion.div>
        )}
      </div>
    </MotionComponent>
  );
};

// Helper component for creating breadcrumb items
PageHeader.BreadcrumbItem = ({ 
  label, 
  path, 
  onClick, 
  className = '',
  isActive = false 
}) => ({
  label,
  path,
  onClick,
  className,
  isActive
});

// Example usage function (for documentation)
PageHeader.Examples = {
  // Simple string breadcrumbs
  simple: ['Dashboard', 'Users', 'Profile'],
  
  // Object-based breadcrumbs with paths
  withPaths: [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Users', path: '/users' },
    { label: 'Profile', path: null } // Current page, no link
  ],
  
  // Mixed breadcrumbs with custom handlers
  mixed: [
    { label: 'Dashboard', path: '/dashboard' },
    { 
      label: 'Users', 
      onClick: () => console.log('Custom navigation'),
      className: 'font-medium'
    },
    'Profile Details'
  ]
};

export default PageHeader;