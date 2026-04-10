'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';

interface Order {
  id: string;
  seller_name: string;
  property_address: string;
  tier: string;
  status: string;
  urgency: 'critical' | 'high' | 'normal' | 'low';
  created_at: string;
  documents_pending: number;
  blocked: boolean;
  block_reason?: string;
}

export default function OperatorDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'new' | 'blocked'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch('http://localhost:8000/api/operator/queue', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const sortedOrders = [...orders].sort((a, b) => {
    const urgencyOrder = { critical: 0, high: 1, normal: 2, low: 3 };
    return (urgencyOrder[a.urgency] || 2) - (urgencyOrder[b.urgency] || 2);
  });

  const filteredOrders = sortedOrders.filter((order) => {
    if (tab === 'new') return order.status === 'created';
    if (tab === 'blocked') return order.blocked;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
      <div style={{ display: 'flex' }}>
        {/* Sidebar */}
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
          <h1 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, margin: 0, marginBottom: SPACING.md }}>
            Fizbo
          </h1>
          <p style={{ fontSize: FONT_SIZES.sm, opacity: 0.9, margin: `0 0 ${SPACING.xl} 0` }}>
            Operator Portal
          </p>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
            <NavLink href="/operator" label="Queue" icon="Q" active={true} />
            <NavLink href="/operator/stats" label="Statistics" icon="S" />
            <NavLink href="/operator/suppliers" label="Suppliers" icon="P" />
          </nav>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: `${SPACING.xl} 0` }} />

          <button
            onClick={() => {
              localStorage.removeItem('access_token');
              window.location.href = '/auth/login';
            }}
            style={{
              width: '100%',
              padding: SPACING.md,
              backgroundColor: 'rgba(255,255,255,0.1)',
              color: 'white',
              border: 'none',
              borderRadius: BORDER_RADIUS.md,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main style={{ marginLeft: '280px', padding: SPACING.xl, width: '100%' }}>
          <div style={{ marginBottom: SPACING.xl }}>
            <h2 style={{
              fontSize: FONT_SIZES['3xl'],
              fontWeight: 700,
              color: BRAND_COLORS.textDark,
              margin: 0,
            }}>
              Order Queue
            </h2>
            <p style={{
              fontSize: FONT_SIZES.base,
              color: BRAND_COLORS.mediumGray,
              margin: `${SPACING.sm} 0 0 0`,
            }}>
              Manage incoming orders and document procurement. Total: {orders.length} orders
            </p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: SPACING.md, marginBottom: SPACING.lg }}>
            {[
              { key: 'all', label: `All Orders (${orders.length})` },
              { key: 'new', label: `New (${orders.filter((o) => o.status === 'created').length})` },
              { key: 'blocked', label: `Blocked (${orders.filter((o) => o.blocked).length})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTab(key as any)}
                style={{
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  backgroundColor: tab === key ? BRAND_COLORS.primary : 'white',
                  color: tab === key ? 'white' : BRAND_COLORS.primary,
                  border: `2px solid ${BRAND_COLORS.primary}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <p style={{ color: BRAND_COLORS.mediumGray }}>Loading...</p>
          ) : filteredOrders.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.xl,
              textAlign: 'center',
              border: `1px solid ${BRAND_COLORS.lightGray}`,
            }}>
              <p style={{ color: BRAND_COLORS.mediumGray, fontSize: FONT_SIZES.lg }}>
                No orders in this category
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
              {filteredOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const urgencyColor: Record<string, string> = {
    critical: '#D32F2F',
    high: '#FF9800',
    normal: '#2196F3',
    low: '#4CAF50',
  };

  return (
    <Link href={`/operator/orders/${order.id}`} style={{ textDecoration: 'none' }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.lg,
        border: `1px solid ${BRAND_COLORS.lightGray}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget).style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
        (e.currentTarget).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget).style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
        (e.currentTarget).style.transform = 'translateY(0)';
      }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: SPACING.md }}>
          <div>
            <h3 style={{
              fontSize: FONT_SIZES.lg,
              fontWeight: 700,
              color: BRAND_COLORS.textDark,
              margin: 0,
            }}>
              {order.seller_name}
            </h3>
            <p style={{
              fontSize: FONT_SIZES.sm,
              color: BRAND_COLORS.mediumGray,
              margin: `${SPACING.xs} 0 0 0`,
            }}>
              {order.property_address}
            </p>
          </div>
          <div style={{ display: 'flex', gap: SPACING.sm }}>
            <span style={{
              padding: `${SPACING.xs} ${SPACING.md}`,
              backgroundColor: urgencyColor[order.urgency] + '20',
              color: urgencyColor[order.urgency],
              borderRadius: BORDER_RADIUS.sm,
              fontSize: FONT_SIZES.xs,
              fontWeight: 700,
            }}>
              {order.urgency.toUpperCase()}
            </span>
            <span style={{
              padding: `${SPACING.xs} ${SPACING.md}`,
              backgroundColor: BRAND_COLORS.gold + '20',
              color: BRAND_COLORS.gold,
              borderRadius: BORDER_RADIUS.sm,
              fontSize: FONT_SIZES.xs,
              fontWeight: 700,
            }}>
              {order.tier.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          gap: SPACING.md,
          marginBottom: SPACING.md,
          paddingBottom: SPACING.md,
          borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
        }}>
          <div>
            <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>Status</p>
            <p style={{ fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, margin: `${SPACING.xs} 0 0 0` }}>
              {order.status}
            </p>
          </div>
          <div>
            <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>Documents Pending</p>
            <p style={{ fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, margin: `${SPACING.xs} 0 0 0` }}>
              {order.documents_pending}
            </p>
          </div>
          <div>
            <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>Created</p>
            <p style={{ fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, margin: `${SPACING.xs} 0 0 0` }}>
              {new Date(order.created_at).toLocaleDateString('pt-PT')}
            </p>
          </div>
          <div>
            {order.blocked ? (
              <p style={{ fontSize: FONT_SIZES.xs, color: '#D32F2F', fontWeight: 700, margin: 0 }}>
                BLOCKED
              </p>
            ) : (
              <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.success, fontWeight: 700, margin: 0 }}>
                ACTIVE
              </p>
            )}
          </div>
        </div>

        {order.blocked && order.block_reason && (
          <div style={{
            backgroundColor: '#FFEBEE',
            border: '1px solid #EF5350',
            borderRadius: BORDER_RADIUS.sm,
            padding: SPACING.md,
          }}>
            <p style={{ fontSize: FONT_SIZES.sm, color: '#D32F2F', margin: 0, fontWeight: 600 }}>
              Block Reason: {order.block_reason}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
};

const NavLink: React.FC<{ href: string; label: string; icon: string; active?: boolean }> = ({
  href,
  label,
  icon,
  active = false,
}) => (
  <Link
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: SPACING.md,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      textDecoration: 'none',
      color: 'white',
      backgroundColor: active ? 'rgba(255,255,255,0.15)' : 'transparent',
      fontWeight: active ? 600 : 500,
      transition: 'all 0.2s ease',
    }}
  >
    <span style={{
      width: '24px',
      height: '24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 700,
    }}>
      {icon}
    </span>
    <span>{label}</span>
  </Link>
);
