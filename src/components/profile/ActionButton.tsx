// src/components/ActionButton.tsx

import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  className?: string;
  disabled?: boolean;
  title?: string; 
}

const ActionButton: React.FC<ActionButtonProps> = ({ 
  onClick, 
  icon, 
  label, 
  className = 'bg-gray-600 hover:bg-gray-700 text-white', // لون افتراضي
  disabled = false,
  title = ''
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title || label}
      className={`w-full flex items-center justify-center gap-3 py-3 rounded-lg font-semibold transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
    >
      {icon && <span>{icon}</span>}
      <span>{label}</span>
    </button>
  );
};

export default ActionButton;