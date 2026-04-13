'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { buildApiUrl } from '@/lib/api-url';

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('access_token');
      await fetch(buildApiUrl('/user/settings'), {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_notifications: emailNotifications,
          order_updates: orderUpdates,
          marketing_emails: marketingEmails,
        }),
      });
      alert('Settings saved successfully');
    } catch (err) {
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
      <div style={{ display: 'flex' }}>
        <Sidebar active="settings" />
        
        <main style={{ marginLeft: '280px', padding: SPACING.xl, width: '100%' }}>
          <Link href="/dashboard" style={{ color: BRAND_COLORS.primary, textDecoration: 'none', marginBottom: SPACING.md, display: 'inline-block' }}>
            ← Back to Dashboard
          </Link>
          
          <h2 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.textDark, margin: `${SPACING.lg} 0 ${SPACING.sm} 0` }}>
            Settings
          </h2>
          <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray, margin: 0 }}>
            Manage your account settings and preferences
          </p>

          <div style={{ maxWidth: '600px', marginTop: SPACING.xl }}>
            {/* Notifications */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              marginBottom: SPACING.lg,
            }}>
              <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.lg} 0` }}>
                Notifications
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                <SettingToggle
                  label="Email Notifications"
                  description="Receive email notifications for important account activities"
                  checked={emailNotifications}
                  onChange={setEmailNotifications}
                />
                <SettingToggle
                  label="Order Updates"
                  description="Get notified about changes to your orders"
                  checked={orderUpdates}
                  onChange={setOrderUpdates}
                />
                <SettingToggle
                  label="Marketing Emails"
                  description="Receive promotional offers and new feature announcements"
                  checked={marketingEmails}
                  onChange={setMarketingEmails}
                />
              </div>
            </div>

            {/* Privacy & Security */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              marginBottom: SPACING.lg,
            }}>
              <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.lg} 0` }}>
                Privacy & Security
              </h3>

              <button
                style={{
                  width: '100%',
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  marginBottom: SPACING.md,
                  borderRadius: BORDER_RADIUS.md,
                  backgroundColor: 'transparent',
                  color: BRAND_COLORS.primary,
                  fontWeight: 600,
                  fontSize: FONT_SIZES.base,
                  border: `1px solid ${BRAND_COLORS.primary}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Change Password
              </button>

              <button
                style={{
                  width: '100%',
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  borderRadius: BORDER_RADIUS.md,
                  backgroundColor: 'transparent',
                  color: BRAND_COLORS.primary,
                  fontWeight: 600,
                  fontSize: FONT_SIZES.base,
                  border: `1px solid ${BRAND_COLORS.primary}`,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Two-Factor Authentication
              </button>
            </div>

            {/* Danger Zone */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              marginBottom: SPACING.lg,
            }}>
              <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.lg} 0` }}>
                Account Management
              </h3>

              <button
                style={{
                  width: '100%',
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  borderRadius: BORDER_RADIUS.md,
                  backgroundColor: 'transparent',
                  color: '#D32F2F',
                  fontWeight: 600,
                  fontSize: FONT_SIZES.base,
                  border: '1px solid #D32F2F',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                Delete Account
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              style={{
                width: '100%',
                padding: `${SPACING.md} ${SPACING.lg}`,
                borderRadius: BORDER_RADIUS.lg,
                backgroundColor: BRAND_COLORS.primary,
                color: 'white',
                fontWeight: 700,
                fontSize: FONT_SIZES.base,
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

const SettingToggle: React.FC<{ label: string; description: string; checked: boolean; onChange: (val: boolean) => void }> = ({
  label,
  description,
  checked,
  onChange,
}) => (
  <div style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: SPACING.md,
    borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
  }}>
    <div>
      <p style={{ fontSize: FONT_SIZES.base, fontWeight: 600, color: BRAND_COLORS.textDark, margin: 0 }}>
        {label}
      </p>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.xs} 0 0 0` }}>
        {description}
      </p>
    </div>
    <div style={{ position: 'relative', width: '48px', height: '28px' }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          margin: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundColor: checked ? BRAND_COLORS.primary : BRAND_COLORS.lightGray,
          borderRadius: '14px',
          transition: 'background-color 0.2s',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: '24px',
          height: '24px',
          backgroundColor: 'white',
          borderRadius: '50%',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'left 0.2s',
          pointerEvents: 'none',
        }}
      />
    </div>
  </div>
);

const Sidebar: React.FC<{ active: string }> = ({ active }) => (
  <aside style={{
    width: '280px',
    backgroundColor: BRAND_COLORS.primary,
    color: 'white',
    padding: SPACING.xl,
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
  }}>
    <h1 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, margin: 0 }}>Fizbo</h1>
    <p style={{ fontSize: FONT_SIZES.sm, opacity: 0.9, margin: `${SPACING.xs} 0 ${SPACING.xl} 0` }}>
      Seller Platform
    </p>

    <nav style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
      {[
        { href: '/dashboard', label: 'Dashboard', icon: 'D' },
        { href: '/doccheck', label: 'DocCheck', icon: 'C' },
        { href: '/documents', label: 'Documents', icon: 'F' },
        { href: '/orders', label: 'Orders', icon: 'O' },
        { href: '/cma', label: 'CMA Report', icon: 'R' },
      ].map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.md,
            padding: SPACING.md,
            borderRadius: BORDER_RADIUS.md,
            textDecoration: 'none',
            color: 'white',
            backgroundColor: active === label.toLowerCase() ? 'rgba(255,255,255,0.15)' : 'transparent',
            fontWeight: active === label.toLowerCase() ? 600 : 500,
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {icon}
          </span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  </aside>
);
