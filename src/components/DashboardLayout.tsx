import React from 'react';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
      {/* Sidebar */}
      <div style={{ display: 'flex' }}>
        <aside style={{
          width: '280px',
          backgroundColor: BRAND_COLORS.primary,
          color: BRAND_COLORS.textLight,
          padding: SPACING.xl,
          boxShadow: `0 2px 8px rgba(0,0,0,0.1)`,
        }}>
          <div style={{ marginBottom: SPACING.xl }}>
            <h1 style={{
              fontSize: FONT_SIZES['3xl'],
              fontWeight: 700,
              margin: 0,
            }}>
              Fizbo
            </h1>
            <p style={{
              fontSize: FONT_SIZES.sm,
              opacity: 0.9,
              marginTop: SPACING.xs,
              margin: `${SPACING.xs} 0 0 0`,
            }}>
              Seller Platform
            </p>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
            <NavLink href="/dashboard" label="Dashboard" icon="📊" active />
            <NavLink href="/doccheck" label="DocCheck" icon="📋" />
            <NavLink href="/documents" label="Documents" icon="📄" />
            <NavLink href="/orders" label="Orders" icon="📦" />
            <NavLink href="/cma" label="CMA Report" icon="💰" />
          </nav>

          <hr style={{ border: 'none', borderTop: `1px solid rgba(255,255,255,0.2)`, margin: `${SPACING.xl} 0` }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
            <NavLink href="/profile" label="Profile" icon="👤" />
            <NavLink href="/settings" label="Settings" icon="⚙️" />
            <NavLink href="/logout" label="Logout" icon="🚪" />
          </div>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: SPACING.xl }}>
          {title && (
            <div style={{ marginBottom: SPACING.xl }}>
              <h2 style={{
                fontSize: FONT_SIZES['3xl'],
                fontWeight: 700,
                color: BRAND_COLORS.textDark,
                margin: 0,
              }}>
                {title}
              </h2>
              {subtitle && (
                <p style={{
                  fontSize: FONT_SIZES.base,
                  color: BRAND_COLORS.mediumGray,
                  marginTop: SPACING.sm,
                  margin: `${SPACING.sm} 0 0 0`,
                }}>
                  {subtitle}
                </p>
              )}
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

interface NavLinkProps {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({ href, label, icon, active }) => (
  <a
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.md,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      textDecoration: 'none',
      color: BRAND_COLORS.textLight,
      backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      fontWeight: active ? 600 : 500,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      if (!active) (e.target as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.1)';
    }}
    onMouseLeave={(e) => {
      if (!active) (e.target as HTMLElement).style.backgroundColor = 'transparent';
    }}
  >
    <span style={{ fontSize: FONT_SIZES.xl }}>{icon}</span>
    <span>{label}</span>
  </a>
);
