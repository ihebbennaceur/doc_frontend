'use client';

import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-text-dark mb-2">
            {label}
            {props.required && <span className="text-error ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-2 border-2 border-gray-200 rounded-md
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-opacity-20
            transition-all duration-200
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-error' : ''}
            ${className || ''}
          `}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-error">{error}</p>}
        {helperText && !error && <p className="mt-1 text-sm text-gray-600">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
