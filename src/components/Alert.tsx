import React from 'react';

interface AlertProps {
  type: 'error' | 'success' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

const alertStyles = {
  error: 'bg-red-50 border-red-200 text-red-800',
  success: 'bg-green-50 border-green-200 text-green-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
  return (
    <div className={`border rounded-lg p-4 ${alertStyles[type]}`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button onClick={onClose} className="text-lg font-bold hover:opacity-70">
            ×
          </button>
        )}
      </div>
    </div>
  );
};
