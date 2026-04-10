'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useAuth } from '@/shared/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError(t('auth.passwordMatch'));
      return;
    }

    if (formData.password.length < 8) {
      setError(t('auth.passwordMin'));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('http://localhost:8000/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          confirm_password: formData.confirmPassword,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        // Store tokens and user in localStorage via AuthContext
        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        const errorData = await res.json();
        const errors = errorData.errors || errorData;
        const errorMessage = typeof errors === 'string' 
          ? errors 
          : Object.values(errors).flat().join(', ');
        setError(errorMessage || t('auth.error'));
      }
    } catch (err) {
      setError(t('auth.error'));
      console.error('Register error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: SPACING.lg }}>
      <div style={{ position: 'absolute', top: SPACING.lg, right: SPACING.lg }}>
        <LanguageSwitcher />
      </div>
      
      <div style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'white',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.xl,
        border: `1px solid ${BRAND_COLORS.lightGray}`,
        boxShadow: '0 4px 6px rgba(0,0,0,0.07)',
      }}>
        <h1 style={{
          fontSize: FONT_SIZES['3xl'],
          fontWeight: 700,
          color: BRAND_COLORS.primary,
          marginBottom: SPACING.md,
        }}>
          {t('auth.criar')}
        </h1>
        <p style={{
          fontSize: FONT_SIZES.base,
          color: BRAND_COLORS.mediumGray,
          marginBottom: SPACING.lg,
        }}>
          {t('auth.juntese')}
        </p>

        {error && (
          <div style={{
            backgroundColor: '#FEE2E2',
            border: `1px solid #FCA5A5`,
            borderRadius: BORDER_RADIUS.sm,
            padding: SPACING.md,
            marginBottom: SPACING.lg,
            color: '#991B1B',
            fontSize: FONT_SIZES.sm,
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: FONT_SIZES.sm,
              fontWeight: 600,
              color: BRAND_COLORS.textDark,
              marginBottom: SPACING.xs,
            }}>
              {t('auth.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="seu.email@exemplo.com"
              style={{
                width: '100%',
                padding: `${SPACING.md} ${SPACING.md}`,
                borderRadius: BORDER_RADIUS.sm,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
                fontSize: FONT_SIZES.base,
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: FONT_SIZES.sm,
              fontWeight: 600,
              color: BRAND_COLORS.textDark,
              marginBottom: SPACING.xs,
            }}>
              {t('auth.password')}
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: `${SPACING.md} ${SPACING.md}`,
                borderRadius: BORDER_RADIUS.sm,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
                fontSize: FONT_SIZES.base,
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: FONT_SIZES.sm,
              fontWeight: 600,
              color: BRAND_COLORS.textDark,
              marginBottom: SPACING.xs,
            }}>
              {t('auth.confirmPassword')}
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: `${SPACING.md} ${SPACING.md}`,
                borderRadius: BORDER_RADIUS.sm,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
                fontSize: FONT_SIZES.base,
                boxSizing: 'border-box',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: `${SPACING.md} ${SPACING.lg}`,
              backgroundColor: BRAND_COLORS.primary,
              color: 'white',
              borderRadius: BORDER_RADIUS.lg,
              border: 'none',
              fontSize: FONT_SIZES.base,
              fontWeight: 700,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s',
              marginTop: SPACING.md,
            }}
          >
            {loading ? t('auth.registering') : t('auth.criar')}
          </button>
        </form>

        <div style={{ marginTop: SPACING.lg, textAlign: 'center' }}>
          <p style={{ color: BRAND_COLORS.mediumGray, fontSize: FONT_SIZES.sm }}>
            {t('auth.temconta')}{' '}
            <Link href="/auth/login" style={{
              color: BRAND_COLORS.primary,
              textDecoration: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}>
              {t('auth.entrar')}
            </Link>
          </p>
        </div>

        <div style={{ marginTop: SPACING.lg, paddingTop: SPACING.lg, borderTop: `1px solid ${BRAND_COLORS.lightGray}`, textAlign: 'center' }}>
          <p style={{ color: BRAND_COLORS.mediumGray, fontSize: FONT_SIZES.xs }}>
            {t('home.copyright')}
          </p>
        </div>
      </div>
    </div>
  );
}
