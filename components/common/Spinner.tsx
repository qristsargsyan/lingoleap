
import React from 'react';

const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600 ${sizeClasses[size]}`}></div>
  );
};

export default Spinner;
