'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useAuthReady } from '@/shared/hooks/useAuthReady';
import { useFetch } from '@/shared/hooks/useFetch';
import { buildApiUrl } from '@/lib/api-url';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ProfilePage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { isReady } = useAuthReady();
  const { fetchWithAuth } = useFetch();
  const [profile, setProfile] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', phone: '' });

  const handleLogout = () => {
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Redirect to login
    router.push('/auth/login');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Wait for auth to be ready
        if (!isReady) {
          console.log('Waiting for auth to be ready');
          setLoading(false);
          return;
        }

        const res = await fetchWithAuth(buildApiUrl('/accounts/me/'), {
          method: 'GET',
        });
        
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setFormData({
            first_name: data.first_name || '',
            last_name: data.last_name || '',
            email: data.email || '',
            phone: data.phone || '',
          });
        } else {
          console.error('Failed to fetch profile:', res.status, res.statusText);
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
      } finally {
        setLoading(false);
      }
    };
    
    if (isReady) {
      fetchProfile();
    }
  }, [isReady, fetchWithAuth]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetchWithAuth(buildApiUrl('/accounts/me/'), {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setEditing(false);
        alert('Profile updated successfully');
      }
    } catch (err) {
      alert('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
        <div style={{ display: 'flex' }}>
          <Sidebar active="profile" />
          
          <main style={{ marginLeft: '280px', padding: SPACING.xl, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
            <Link href="/dashboard" style={{ color: BRAND_COLORS.primary, textDecoration: 'none', display: 'inline-block' }}>
              {t('profile.backToDash')}
            </Link>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'right' }}>
              <LanguageSwitcher />
            </div>
          </div>
          
          <h2 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.textDark, margin: `${SPACING.lg} 0 ${SPACING.sm} 0` }}>
            {t('profile.myperfil')}
          </h2>
          <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray, margin: 0 }}>
            {t('profile.gerir')}
          </p>

          {loading ? (
            <div style={{ marginTop: SPACING.xl }}>
              <p style={{ color: BRAND_COLORS.mediumGray }}>Loading profile...</p>
            </div>
          ) : (
            <div style={{ maxWidth: '600px', marginTop: SPACING.xl }}>
              <div style={{
                backgroundColor: 'white',
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.lg,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}>
                {!editing ? (
                  <>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: SPACING.lg,
                      paddingBottom: SPACING.lg,
                      borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
                    }}>
                      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0 }}>
                        Profile Information
                      </h3>
                      <button
                        onClick={() => setEditing(true)}
                        style={{
                          padding: `${SPACING.sm} ${SPACING.md}`,
                          borderRadius: BORDER_RADIUS.md,
                          backgroundColor: BRAND_COLORS.primary,
                          color: 'white',
                          fontWeight: 600,
                          fontSize: FONT_SIZES.sm,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Edit Profile
                      </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
                      <div>
                        <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, fontWeight: 600, margin: 0 }}>
                          Full Name
                        </p>
                        <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark, margin: `${SPACING.sm} 0 0 0` }}>
                          {profile?.first_name || 'N/A'} {profile?.last_name || ''}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, fontWeight: 600, margin: 0 }}>
                          Email Address
                        </p>
                        <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark, margin: `${SPACING.sm} 0 0 0` }}>
                          {profile?.email || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, fontWeight: 600, margin: 0 }}>
                          Phone Number
                        </p>
                        <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark, margin: `${SPACING.sm} 0 0 0` }}>
                          {profile?.phone || 'Not provided'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, fontWeight: 600, margin: 0 }}>
                          Account Role
                        </p>
                        <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark, margin: `${SPACING.sm} 0 0 0` }}>
                          {profile?.role || 'Seller'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, fontWeight: 600, margin: 0 }}>
                          Member Since
                        </p>
                        <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark, margin: `${SPACING.sm} 0 0 0` }}>
                          {new Date(profile?.created_at || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.lg} 0` }}>
                      Edit Profile
                    </h3>

                    <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                      <div>
                        <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.first_name}
                          onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: `${SPACING.md} ${SPACING.md}`,
                            borderRadius: BORDER_RADIUS.sm,
                            border: `1px solid ${BRAND_COLORS.lightGray}`,
                            fontSize: FONT_SIZES.base,
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.last_name}
                          onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                          style={{
                            width: '100%',
                            padding: `${SPACING.md} ${SPACING.md}`,
                            borderRadius: BORDER_RADIUS.sm,
                            border: `1px solid ${BRAND_COLORS.lightGray}`,
                            fontSize: FONT_SIZES.base,
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                          Email (Read-only)
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          disabled
                          style={{
                            width: '100%',
                            padding: `${SPACING.md} ${SPACING.md}`,
                            borderRadius: BORDER_RADIUS.sm,
                            border: `1px solid ${BRAND_COLORS.lightGray}`,
                            fontSize: FONT_SIZES.base,
                            backgroundColor: BRAND_COLORS.background,
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          style={{
                            width: '100%',
                            padding: `${SPACING.md} ${SPACING.md}`,
                            borderRadius: BORDER_RADIUS.sm,
                            border: `1px solid ${BRAND_COLORS.lightGray}`,
                            fontSize: FONT_SIZES.base,
                            boxSizing: 'border-box',
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: SPACING.md, marginTop: SPACING.lg }}>
                        <button
                          type="submit"
                          disabled={saving}
                          style={{
                            flex: 1,
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
                          {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(false)}
                          style={{
                            flex: 1,
                            padding: `${SPACING.md} ${SPACING.lg}`,
                            borderRadius: BORDER_RADIUS.lg,
                            backgroundColor: 'transparent',
                            color: BRAND_COLORS.primary,
                            fontWeight: 700,
                            fontSize: FONT_SIZES.base,
                            border: `1px solid ${BRAND_COLORS.primary}`,
                            cursor: 'pointer',
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <div style={{ marginTop: SPACING.xl, display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={handleLogout}
              style={{
                padding: `${SPACING.md} ${SPACING.lg}`,
                borderRadius: BORDER_RADIUS.md,
                backgroundColor: '#dc2626',
                color: 'white',
                fontWeight: 600,
                fontSize: FONT_SIZES.base,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
            >
              Logout
            </button>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}

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
