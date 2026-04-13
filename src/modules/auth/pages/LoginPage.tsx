'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { GoogleLogin } from '@react-oauth/google';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useAuth } from '@/shared/context/AuthContext';
import { exchangeGoogleToken } from '@/lib/google-auth';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { login: _login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await _login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || t('auth.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    setError('');
    
    try {
      const result = await exchangeGoogleToken(response.credential);
      
      if (result.success) {
        router.push('/dashboard');
      } else {
        setError(result.error || t('auth.error'));
      }
    } catch (err) {
      setError(t('auth.error'));
      console.error('Google login error:', err);
    }
  };

  const handleGoogleError = () => {
    setError('Google authentication failed. Please try again.');
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
          {t('auth.entrar')}
        </h1>
        <p style={{
          fontSize: FONT_SIZES.base,
          color: BRAND_COLORS.mediumGray,
          marginBottom: SPACING.lg,
        }}>
          {t('auth.aceda')}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            {loading ? t('auth.entering') : t('auth.entrar')}
          </button>
        </form>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.md,
          margin: `${SPACING.lg} 0`,
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: BRAND_COLORS.lightGray }}></div>
          <span style={{ color: BRAND_COLORS.mediumGray, fontSize: FONT_SIZES.sm }}>ou</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: BRAND_COLORS.lightGray }}></div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{
            transform: 'scale(0.95)',
            transformOrigin: 'top center',
          }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              useOneTap={false}
            />
          </div>
        </div>

        <div style={{ marginTop: SPACING.lg, textAlign: 'center' }}>
          <p style={{ color: BRAND_COLORS.mediumGray, fontSize: FONT_SIZES.sm }}>
            {t('auth.noaccount')}{' '}
            <Link href="/auth/register" style={{
              color: BRAND_COLORS.primary,
              textDecoration: 'none',
              fontWeight: 700,
              cursor: 'pointer',
            }}>
              {t('auth.registar')}
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
