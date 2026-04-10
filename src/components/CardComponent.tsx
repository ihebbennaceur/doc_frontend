'use client';

import React from 'react';
import { BORDER_RADIUS, SPACING } from '@/shared/theme/colors';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'sm' | 'md' | 'lg';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      padding = 'md',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      default: `
        bg-white border border-gray-200 rounded-${BORDER_RADIUS.md}
      `,
      elevated: `
        bg-white shadow-lg rounded-${BORDER_RADIUS.md}
      `,
      outlined: `
        bg-transparent border-2 border-primary rounded-${BORDER_RADIUS.md}
      `,
    };

    const paddingStyles = {
      sm: `p-${SPACING.md}`,
      md: `p-${SPACING.lg}`,
      lg: `p-${SPACING.xl}`,
    };

    return (
      <div
        ref={ref}
        className={`${variantStyles[variant]} ${paddingStyles[padding]} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
