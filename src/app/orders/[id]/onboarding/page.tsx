'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useFetch } from '@/shared/hooks/useFetch';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { buildApiUrl } from '@/lib/api-url';

export default function OnboardingPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const { fetchWithAuth } = useFetch();
  const orderId = params.id as string;

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    phone: '',
    whatsapp_opt_in: true,
  });

  const handleContinue = async () => {
    if (!formData.phone) {
      setError(t('onboarding.error.phone'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetchWithAuth(buildApiUrl(`/orders/${orderId}/`), {
        method: 'PATCH',
        body: JSON.stringify({
          phone: formData.phone,
          whatsapp_opt_in: formData.whatsapp_opt_in,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar dados');
      }

      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('onboarding.error.generic'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          padding: SPACING.xl,
          backgroundColor: 'white',
          borderRadius: BORDER_RADIUS.md,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {step === 1 ? (
            <>
              <h1 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0, marginBottom: SPACING.md }}>
                {t('onboarding.title')}
              </h1>
              <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.lg }}>
                {t('onboarding.subtitle')}
              </p>

              <div style={{ marginBottom: SPACING.lg }}>
                <label style={{
                  display: 'block',
                  fontSize: FONT_SIZES.sm,
                  fontWeight: 600,
                  color: BRAND_COLORS.textDark,
                  marginBottom: SPACING.xs,
                }}>
                  {t('onboarding.phone')}
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+351 9XX XXX XXX"
                  style={{
                    width: '100%',
                    padding: `${SPACING.md} ${SPACING.md}`,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.base,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div style={{ marginBottom: SPACING.lg }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: SPACING.md,
                  cursor: 'pointer',
                }}>
                  <input
                    type="checkbox"
                    checked={formData.whatsapp_opt_in}
                    onChange={(e) => setFormData({ ...formData, whatsapp_opt_in: e.target.checked })}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.textDark }}>
                    {t('onboarding.whatsapp')}
                  </span>
                </label>
              </div>

              {error && (
                <div style={{
                  backgroundColor: '#FEE',
                  border: `1px solid #FCC`,
                  borderRadius: BORDER_RADIUS.sm,
                  padding: SPACING.md,
                  marginBottom: SPACING.lg,
                  color: '#C33',
                  fontSize: FONT_SIZES.sm,
                }}>
                  {error}
                </div>
              )}

              <button
                onClick={handleContinue}
                disabled={loading}
                style={{
                  width: '100%',
                  backgroundColor: BRAND_COLORS.primary,
                  color: 'white',
                  border: 'none',
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: FONT_SIZES.base,
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? t('onboarding.processing') : t('onboarding.continue')}
              </button>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: SPACING.xl }}>
                <div style={{
                  fontSize: '48px',
                  marginBottom: SPACING.md,
                }}>
                  ✓
                </div>
                <h2 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0, marginBottom: SPACING.md }}>
                  {t('onboarding.confirmed')}
                </h2>
                <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray }}>
                  {t('onboarding.working')}
                </p>
              </div>

              <button
                onClick={() => router.push('/dashboard')}
                style={{
                  width: '100%',
                  backgroundColor: BRAND_COLORS.primary,
                  color: 'white',
                  border: 'none',
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: FONT_SIZES.base,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('onboarding.viewDashboard')}
              </button>
            </>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
