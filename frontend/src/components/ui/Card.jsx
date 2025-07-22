import React from 'react';

const Card = ({ children, className = '', padding = 'default' }) => {
  const paddingClasses = {
    default: 'p-6',
    none: 'p-0',
  };

  return (
    <div className={`bg-white/80 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className }) => (
  <div className={`p-6 border-b border-slate-200/80 dark:border-slate-700/80 ${className}`}>
    {children}
  </div>
);

const CardBody = ({ children, className, padding = 'default' }) => {
  const paddingClasses = {
    default: 'p-6',
    none: 'p-0',
  };
  return (
    <div className={`${paddingClasses[padding]} ${className}`}>{children}</div>
  );
};

const CardFooter = ({ children, className }) => (
  <div className={`p-6 border-t border-slate-200/80 dark:border-slate-700/80 ${className}`}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;