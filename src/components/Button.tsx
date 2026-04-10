import React from 'react';
import { COLORS } from '@/constants/colors';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  children,
  disabled,
  ...props
}) => {
  const getVariantStyles = () => {
    const baseStyle: React.CSSProperties = {
      fontWeight: 600,
      borderRadius: '0.5rem',
      transition: 'all 0.2s ease-in-out',
      border: 'none',
      cursor: 'pointer',
      opacity: disabled || isLoading ? 0.5 : 1,
      pointerEvents: disabled || isLoading ? 'none' : 'auto',
    };

    const variants = {
      primary: {
        ...baseStyle,
        backgroundColor: COLORS.primary[500],
        color: 'white',
      },
      secondary: {
        ...baseStyle,
        backgroundColor: COLORS.neutral[200],
        color: COLORS.neutral[900],
      },
      accent: {
        ...baseStyle,
        backgroundColor: COLORS.accent[500],
        color: 'white',
      },
      danger: {
        ...baseStyle,
        backgroundColor: COLORS.error[500],
        color: 'white',
      },
      success: {
        ...baseStyle,
        backgroundColor: COLORS.success[500],
        color: 'white',
      },
    };

    return variants[variant];
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: { padding: '0.375rem 0.75rem', fontSize: '0.875rem' },
      md: { padding: '0.5rem 1rem', fontSize: '1rem' },
      lg: { padding: '0.75rem 1.5rem', fontSize: '1.125rem' },
    };
    return sizes[size];
  };

  const style: React.CSSProperties = {
    ...getVariantStyles(),
    ...getSizeStyles(),
    width: fullWidth ? '100%' : 'auto',
  };

  return (
    <button
      style={style}
      disabled={disabled || isLoading}
      {...props}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.opacity = '0.9';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.opacity = disabled || isLoading ? '0.5' : '1';
      }}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  );
};
