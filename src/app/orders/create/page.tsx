'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useAuth } from '@/shared/context/AuthContext';
import { useFetch } from '@/shared/hooks/useFetch';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface ServiceTier {
  id: string;
  name: string;
  price: number;
  descriptionKey: string;
  featureKeys: string[];
  timelineKey: string;
  recommended?: boolean;
}

const SERVICE_TIERS: ServiceTier[] = [
  {
    id: 'standard',
    name: 'Standard',
    price: 0,
    descriptionKey: 'pricing.standard_ideal',
    featureKeys: ['pricing.f1', 'pricing.f2', 'pricing.f3', 'pricing.f4', 'pricing.f5', 'pricing.f6'],
    timelineKey: 'pricing.timeline_standard',
    recommended: false,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 0,
    descriptionKey: 'pricing.premium_ideal',
    featureKeys: ['pricing.p1', 'pricing.p2', 'pricing.p3', 'pricing.p4', 'pricing.p5', 'pricing.p6'],
    timelineKey: 'pricing.timeline_premium',
    recommended: true,
  },
  {
    id: 'express',
    name: 'DocExpress',
    price: 0,
    descriptionKey: 'pricing.docexpress_ideal',
    featureKeys: ['pricing.d1', 'pricing.d2', 'pricing.d3', 'pricing.d4', 'pricing.d5', 'pricing.d6'],
    timelineKey: 'pricing.timeline_docexpress',
    recommended: false,
  },
];

function CreateOrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { fetchWithAuth } = useFetch();
  const [selectedTier, setSelectedTier] = useState<string>('standard');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const recommendedTier = searchParams.get('tier') || 'standard';

  useEffect(() => {
    if (recommendedTier) {
      setSelectedTier(recommendedTier);
    }
  }, [recommendedTier]);

  const handleCreateOrder = async () => {
    if (!user) {
      setError('Erro de autenticação. Por favor, faça login novamente.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetchWithAuth('http://localhost:8000/api/orders/', {
        method: 'POST',
        body: JSON.stringify({
          service_tier: selectedTier,
          seller_email: user.email,
          seller_name: user.username || user.email,
        }),
      });

      console.log('[Orders Create] Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('[Orders Create] Error response:', errorData);
        throw new Error(errorData.error || 'Erro ao criar encomenda');
      }

      const data = await response.json();
      console.log('[Orders Create] Success:', data);
      
      // Redirect to onboarding
      router.push(`/orders/${data.data.id}/onboarding`);
    } catch (err) {
      console.error('[Orders Create] Exception:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar encomenda');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: SPACING.xl 
        }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl }}>
            <Link href="/doccheck" style={{ color: BRAND_COLORS.primary, textDecoration: 'none' }}>
              ← Voltar
            </Link>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'right' }}>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Title */}
          <div style={{ marginBottom: SPACING.xl }}>
            <h1 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0, marginBottom: SPACING.md }}>
              {t('orders.create.title')}
            </h1>
            <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray, margin: 0 }}>
              {t('orders.create.subtitle').replace('{{plan}}', SERVICE_TIERS.find(t => t.id === recommendedTier)?.name || '')}
            </p>
          </div>

          {/* Pricing Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: SPACING.lg,
            marginBottom: SPACING.xl,
          }}>
            {SERVICE_TIERS.map((tier) => (
              <div
                key={tier.id}
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  border: selectedTier === tier.id 
                    ? `2px solid ${BRAND_COLORS.primary}` 
                    : `1px solid ${BRAND_COLORS.lightGray}`,
                  borderRadius: BORDER_RADIUS.md,
                  padding: SPACING.lg,
                  backgroundColor: selectedTier === tier.id ? '#F0F5F3' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (selectedTier !== tier.id) {
                    (e.currentTarget).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTier !== tier.id) {
                    (e.currentTarget).style.boxShadow = 'none';
                  }
                }}
              >
                {tier.recommended && (
                  <div style={{
                    position: 'absolute',
                    top: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: BRAND_COLORS.primary,
                    color: 'white',
                    padding: `${SPACING.xs} ${SPACING.md}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.sm,
                    fontWeight: 600,
                  }}>
                    {t('orders.create.recommended')}
                  </div>
                )}

                <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0, marginBottom: SPACING.sm }}>
                  {tier.name}
                </h3>

                <p style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.primary, margin: 0, marginBottom: SPACING.md }}>
                  €{tier.price}
                </p>

                <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: 0, marginBottom: SPACING.md }}>
                  {t(tier.descriptionKey)}
                </p>

                <div style={{ 
                  marginBottom: SPACING.md,
                  paddingBottom: SPACING.md,
                  borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
                }}>
                  <h4 style={{ fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm, margin: 0 }}>
                    {t('orders.create.features')}
                  </h4>
                  {tier.featureKeys.map((featureKey, idx) => (
                    <div key={idx} style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      fontSize: FONT_SIZES.sm,
                      color: BRAND_COLORS.textDark,
                      marginBottom: SPACING.xs,
                    }}>
                      <span style={{ marginRight: SPACING.sm, color: BRAND_COLORS.primary }}>✓</span>
                      {t(featureKey)}
                    </div>
                  ))}
                </div>

                <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                  ⏱ {t('orders.create.timeline')}: {t(tier.timelineKey)}
                </p>
              </div>
            ))}
          </div>

          {/* Error Message */}
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

          {/* CTA Button */}
          <div style={{ display: 'flex', gap: SPACING.md }}>
            <button
              onClick={handleCreateOrder}
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: BRAND_COLORS.primary,
                color: 'white',
                border: 'none',
                padding: `${SPACING.md} ${SPACING.lg}`,
                borderRadius: BORDER_RADIUS.md,
                fontSize: FONT_SIZES.base,
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                if (!loading) (e.currentTarget).style.backgroundColor = '#1A4D35';
              }}
              onMouseLeave={(e) => {
                if (!loading) (e.currentTarget).style.backgroundColor = BRAND_COLORS.primary;
              }}
            >
              {loading ? t('orders.create.creating') : t('orders.create.proceed')}
            </button>

            <button
              onClick={() => window.open('https://wa.me/+351912345678', '_blank')}
              style={{
                backgroundColor: 'white',
                color: BRAND_COLORS.primary,
                border: `2px solid ${BRAND_COLORS.primary}`,
                padding: `${SPACING.md} ${SPACING.lg}`,
                borderRadius: BORDER_RADIUS.md,
                fontSize: FONT_SIZES.base,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget).style.backgroundColor = '#F0F5F3';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget).style.backgroundColor = 'white';
              }}
            >
              {t('orders.create.contact')}
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

export default function CreateOrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateOrderContent />
    </Suspense>
  );
}
