import React from 'react';
import { COLORS } from '@/constants/colors';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div
      className={`p-6 rounded-lg shadow-sm ${className}`}
      style={{
        backgroundColor: COLORS.neutral[50],
        border: `1px solid ${COLORS.neutral[200]}`,
      }}
    >
      {children}
    </div>
  );
};
