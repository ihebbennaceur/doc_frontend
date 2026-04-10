import React, { useId } from 'react';
import { COLORS } from '@/constants/colors';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  id,
  ...props
}) => {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium mb-2" style={{ color: COLORS.neutral[700] }}>
          {label}
          {props.required && <span className="ml-1" style={{ color: COLORS.error[500] }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none transition-colors ${
          error
            ? `border-[${COLORS.error[500]}] focus:ring-2 focus:ring-[${COLORS.error[300]}]`
            : `border-[${COLORS.neutral[300]}] focus:ring-2 focus:ring-[${COLORS.primary[300]}]`
        }`}
        style={{
          borderColor: error ? COLORS.error[500] : COLORS.neutral[300],
        }}
        {...props}
      />
      {error && (
        <p className="text-sm mt-1" style={{ color: COLORS.error[500] }}>
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="text-sm mt-1" style={{ color: COLORS.neutral[500] }}>
          {helpText}
        </p>
      )}
    </div>
  );
};
