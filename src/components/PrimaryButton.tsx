import React from 'react';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';

export interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  href?: string;
}

export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    href,
    disabled,
    onClick,
    ...props
  }, ref) => {
    const getSizeStyles = () => {
      const sizes = {
        sm: { padding: `${SPACING.sm} ${SPACING.md}`, fontSize: FONT_SIZES.sm },
        md: { padding: `${SPACING.md} ${SPACING.lg}`, fontSize: FONT_SIZES.base },
        lg: { padding: `${SPACING.lg} ${SPACING.xl}`, fontSize: FONT_SIZES.lg },
      };
      return sizes[size];
    };

    const getVariantStyles = () => {
      const variants = {
        primary: {
          backgroundColor: BRAND_COLORS.primary,
          color: BRAND_COLORS.textLight,
          border: 'none',
        },
        secondary: {
          backgroundColor: BRAND_COLORS.accent,
          color: BRAND_COLORS.textLight,
          border: 'none',
        },
        outline: {
          backgroundColor: 'transparent',
          color: BRAND_COLORS.primary,
          border: `2px solid ${BRAND_COLORS.primary}`,
        },
      };
      return variants[variant];
    };

    const buttonStyle: React.CSSProperties = {
      ...getSizeStyles(),
      ...getVariantStyles(),
      borderRadius: BORDER_RADIUS.lg,
      fontWeight: 600,
      cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
      opacity: disabled || isLoading ? 0.6 : 1,
      transition: 'all 0.2s ease',
      width: fullWidth ? '100%' : 'auto',
      display: fullWidth ? 'block' : 'inline-block',
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (href && !disabled && !isLoading) {
        window.location.href = href;
      }
      onClick?.(e);
    };

    return (
      <button
        ref={ref}
        style={buttonStyle}
        disabled={disabled || isLoading}
        onClick={handleClick}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) {
            (e.currentTarget).style.transform = 'translateY(-2px)';
            (e.currentTarget).style.boxShadow = '0 4px 12px rgba(46,93,75,0.2)';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget).style.transform = 'translateY(0)';
          (e.currentTarget).style.boxShadow = 'none';
        }}
        {...props}
      >
        {isLoading ? '⏳ Loading...' : children}
      </button>
    );
  }
);

PrimaryButton.displayName = 'PrimaryButton';
