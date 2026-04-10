import React from 'react';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';

export interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  color = BRAND_COLORS.primary,
  trend,
}) => {
  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        border: `1px solid ${BRAND_COLORS.lightGray}`,
        transition: 'all 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget).style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget).style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{
            fontSize: FONT_SIZES.sm,
            color: BRAND_COLORS.mediumGray,
            fontWeight: 500,
            margin: 0,
          }}>
            {label}
          </p>
          <h3 style={{
            fontSize: FONT_SIZES['3xl'],
            fontWeight: 700,
            color: color,
            margin: `${SPACING.md} 0 0 0`,
          }}>
            {value}
          </h3>
          {trend && (
            <p style={{
              fontSize: FONT_SIZES.sm,
              color: trend.isPositive ? BRAND_COLORS.success : BRAND_COLORS.error,
              margin: `${SPACING.sm} 0 0 0`,
              fontWeight: 500,
            }}>
              {trend.isPositive ? '↑' : '↓'} {trend.value}%
            </p>
          )}
        </div>
        <div
          style={{
            fontSize: FONT_SIZES['2xl'],
            opacity: 0.7,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  );
};
