'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate } from '@/shared/utils/helpers';
import { BRAND_COLORS } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useFetch } from '@/shared/hooks/useFetch';
import { buildApiUrl } from '@/lib/api-url';

interface Order {
  id: string;
  status: string;
  service_tier: string;
  total_cost: number;
  created_at: string;
  property_address?: string;
  payment_id?: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { fetchWithAuth } = useFetch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userStr = localStorage.getItem('user');
        
        if (!userStr) {
          console.error('[Orders] No user found');
          router.push('/auth/login');
          return;
        }

        const user = JSON.parse(userStr);
        const userEmail = user.email;

        console.log('[Orders] User:', userEmail);

        const res = await fetchWithAuth(buildApiUrl(`/orders/seller/list/?email=${encodeURIComponent(userEmail)}`), {
          method: 'GET',
        });

        console.log('[Orders] Response status:', res.status);

        if (res.ok) {
          const data = await res.json();
          console.log('[Orders] Fetched:', data);
          setOrders(Array.isArray(data) ? data : data.results || data.data || []);
        } else {
          const errorData = await res.text();
          console.error('[Orders] Failed to fetch:', res.status, errorData);
        }
      } catch (err) {
        console.error('[Orders] Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router, fetchWithAuth]);

  const filteredOrders = orders.filter(order => {
    if (filter === 'active') return order.status !== 'completed';
    if (filter === 'completed') return order.status === 'completed';
    return true;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; dot: string }> = {
      'active': { bg: 'bg-blue-100', text: 'text-blue-800', dot: '🔵' },
      'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: '🟡' },
      'completed': { bg: 'bg-green-100', text: 'text-green-800', dot: '🟢' },
      'cancelled': { bg: 'bg-red-100', text: 'text-red-800', dot: '🔴' },
    };
    return colors[status] || { bg: 'bg-gray-100', text: 'text-gray-800', dot: '⚪' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 mb-4 inline-block">
            {t('orders.backToDash')}
          </a>
          <h1 className="text-4xl font-bold text-gray-900">{t('orders.title')}</h1>
          <p className="text-gray-600 mt-2">{t('orders.subtitle')}</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          {(['all', 'active', 'completed'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                filter === tab
                  ? 'text-white'
                  : 'bg-white text-gray-700 hover:shadow'
              }`}
              style={filter === tab ? { backgroundColor: BRAND_COLORS.primary } : {}}
            >
              {t(`orders.${tab}`)} ({
                tab === 'all' 
                  ? orders.length 
                  : tab === 'active' 
                  ? orders.filter(o => o.status !== 'completed').length
                  : orders.filter(o => o.status === 'completed').length
              })
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const statusInfo = getStatusColor(order.status);
              return (
                <div 
                  key={order.id}
                  className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition cursor-pointer"
                  onClick={() => router.push(`/orders/${order.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl">{statusInfo.dot}</div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Created on {formatDate(order.created_at)}
                          </p>
                          {order.property_address && (
                            <p className="text-sm text-gray-600">
                              📍 {order.property_address}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: BRAND_COLORS.primary }}>
                        {formatCurrency(order.total_cost || 0)}
                      </p>
                      <div className="mt-2 flex flex-col items-end gap-2">
                        <span className={`text-xs px-3 py-1 rounded-full font-semibold ${statusInfo.bg} ${statusInfo.text}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span className="text-xs text-gray-600">
                          {order.service_tier || 'Standard'} Plan
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{t('orders.noOrders')}</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? "You haven't created any orders. Start by running a document assessment."
                : `You don't have any ${filter} orders.`
              }
            </p>
            <a
              href="/doccheck"
              className="inline-block px-6 py-3 rounded-lg font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: BRAND_COLORS.primary }}
            >
              Start Assessment
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
