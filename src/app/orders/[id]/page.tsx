'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useFetch } from '@/shared/hooks/useFetch';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface OrderDetail {
  id: string;
  seller_email: string;
  seller_name: string;
  seller_phone: string;
  phone: string;
  service_tier: string;
  service_tier_name: string;
  status: string;
  whatsapp_opt_in: boolean;
  assigned_operator: string | null;
  created_at: string;
  completed_at: string | null;
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { t } = useLanguage();
  const { fetchWithAuth } = useFetch();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetchWithAuth(`http://localhost:8000/api/orders/${orderId}/`, {
          method: 'GET',
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.detail || 'Falha ao carregar encomenda');
        }

        const data = await response.json();
        setOrder(data.data || data);
      } catch (err) {
        console.error('[OrderDetail] Error:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar encomenda');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId, fetchWithAuth]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'pendente':
        return '#FFA500';
      case 'completed':
      case 'concluído':
        return '#4CAF50';
      case 'in_progress':
      case 'em_progresso':
        return '#2196F3';
      default:
        return BRAND_COLORS.mediumGray;
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: SPACING.xl }}>
          {/* Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: SPACING.xl,
            }}
          >
            <Link
              href="/orders"
              style={{ color: BRAND_COLORS.primary, textDecoration: 'none' }}
            >
              ← {t('common.back')}
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Loading State */}
          {loading && (
            <div
              style={{
                textAlign: 'center',
                padding: SPACING.xl,
                color: BRAND_COLORS.mediumGray,
              }}
            >
              {t('common.loading')}...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div
              style={{
                backgroundColor: '#FEE',
                border: `1px solid #FCC`,
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.lg,
                marginBottom: SPACING.lg,
                color: '#C33',
              }}
            >
              {error}
            </div>
          )}

          {/* Order Details */}
          {order && !loading && (
            <div>
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: BORDER_RADIUS.lg,
                  padding: SPACING.xl,
                  marginBottom: SPACING.lg,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                }}
              >
                {/* Order Header */}
                <div style={{ marginBottom: SPACING.lg }}>
                  <h1
                    style={{
                      fontSize: FONT_SIZES.xl,
                      fontWeight: 700,
                      color: BRAND_COLORS.textDark,
                      margin: 0,
                      marginBottom: SPACING.md,
                    }}
                  >
                    {t('orders.detail.title')}: {order.id}
                  </h1>

                  <div style={{ display: 'flex', gap: SPACING.md, alignItems: 'center' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        backgroundColor: getStatusColor(order.status),
                        color: 'white',
                        padding: `${SPACING.xs} ${SPACING.md}`,
                        borderRadius: BORDER_RADIUS.sm,
                        fontSize: FONT_SIZES.sm,
                        fontWeight: 600,
                      }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Two Column Layout */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: SPACING.lg,
                    borderTop: `1px solid ${BRAND_COLORS.lightGray}`,
                    paddingTop: SPACING.lg,
                  }}
                >
                  {/* Left Column - Seller Info */}
                  <div>
                    <h3
                      style={{
                        fontSize: FONT_SIZES.base,
                        fontWeight: 600,
                        color: BRAND_COLORS.textDark,
                        marginBottom: SPACING.md,
                      }}
                    >
                      {t('orders.detail.sellerInfo')}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                      <div>
                        <p
                          style={{
                            fontSize: FONT_SIZES.sm,
                            color: BRAND_COLORS.mediumGray,
                            margin: 0,
                            marginBottom: SPACING.xs,
                          }}
                        >
                          {t('orders.detail.name')}
                        </p>
                        <p
                          style={{
                            fontSize: FONT_SIZES.base,
                            color: BRAND_COLORS.textDark,
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          {order.seller_name}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: FONT_SIZES.sm,
                            color: BRAND_COLORS.mediumGray,
                            margin: 0,
                            marginBottom: SPACING.xs,
                          }}
                        >
                          {t('orders.detail.email')}
                        </p>
                        <p
                          style={{
                            fontSize: FONT_SIZES.base,
                            color: BRAND_COLORS.textDark,
                            fontWeight: 500,
                            margin: 0,
                            wordBreak: 'break-all',
                          }}
                        >
                          {order.seller_email}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: FONT_SIZES.sm,
                            color: BRAND_COLORS.mediumGray,
                            margin: 0,
                            marginBottom: SPACING.xs,
                          }}
                        >
                          {t('orders.detail.phone')}
                        </p>
                        <p
                          style={{
                            fontSize: FONT_SIZES.base,
                            color: BRAND_COLORS.textDark,
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          {order.phone || order.seller_phone || '-'}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: FONT_SIZES.sm,
                            color: BRAND_COLORS.mediumGray,
                            margin: 0,
                            marginBottom: SPACING.xs,
                          }}
                        >
                          {t('orders.detail.whatsapp')}
                        </p>
                        <p
                          style={{
                            fontSize: FONT_SIZES.base,
                            color: BRAND_COLORS.textDark,
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          {order.whatsapp_opt_in ? '✓ Sim' : '✗ Não'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Order Info */}
                  <div>
                    <h3
                      style={{
                        fontSize: FONT_SIZES.base,
                        fontWeight: 600,
                        color: BRAND_COLORS.textDark,
                        marginBottom: SPACING.md,
                      }}
                    >
                      {t('orders.detail.orderInfo')}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                      <div>
                        <p
                          style={{
                            fontSize: FONT_SIZES.sm,
                            color: BRAND_COLORS.mediumGray,
                            margin: 0,
                            marginBottom: SPACING.xs,
                          }}
                        >
                          {t('orders.detail.tier')}
                        </p>
                        <p
                          style={{
                            fontSize: FONT_SIZES.base,
                            color: BRAND_COLORS.textDark,
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          {order.service_tier_name || order.service_tier}
                        </p>
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: FONT_SIZES.sm,
                            color: BRAND_COLORS.mediumGray,
                            margin: 0,
                            marginBottom: SPACING.xs,
                          }}
                        >
                          {t('orders.detail.created')}
                        </p>
                        <p
                          style={{
                            fontSize: FONT_SIZES.base,
                            color: BRAND_COLORS.textDark,
                            fontWeight: 500,
                            margin: 0,
                          }}
                        >
                          {formatDate(order.created_at)}
                        </p>
                      </div>
                      {order.completed_at && (
                        <div>
                          <p
                            style={{
                              fontSize: FONT_SIZES.sm,
                              color: BRAND_COLORS.mediumGray,
                              margin: 0,
                              marginBottom: SPACING.xs,
                            }}
                          >
                            {t('orders.detail.completed')}
                          </p>
                          <p
                            style={{
                              fontSize: FONT_SIZES.base,
                              color: BRAND_COLORS.textDark,
                              fontWeight: 500,
                              margin: 0,
                            }}
                          >
                            {formatDate(order.completed_at)}
                          </p>
                        </div>
                      )}
                      {order.assigned_operator && (
                        <div>
                          <p
                            style={{
                              fontSize: FONT_SIZES.sm,
                              color: BRAND_COLORS.mediumGray,
                              margin: 0,
                              marginBottom: SPACING.xs,
                            }}
                          >
                            {t('orders.detail.operator')}
                          </p>
                          <p
                            style={{
                              fontSize: FONT_SIZES.base,
                              color: BRAND_COLORS.textDark,
                              fontWeight: 500,
                              margin: 0,
                            }}
                          >
                            {order.assigned_operator}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: SPACING.md }}>
                <button
                  onClick={() => router.push('/orders')}
                  style={{
                    flex: 1,
                    backgroundColor: BRAND_COLORS.primary,
                    color: 'white',
                    border: 'none',
                    padding: `${SPACING.md} ${SPACING.lg}`,
                    borderRadius: BORDER_RADIUS.md,
                    fontSize: FONT_SIZES.base,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget).style.backgroundColor = '#1A4D35';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget).style.backgroundColor = BRAND_COLORS.primary;
                  }}
                >
                  {t('common.back')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
