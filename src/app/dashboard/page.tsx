'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/shared/utils/helpers';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useFetch } from '@/shared/hooks/useFetch';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import DocumentsManager, { Document } from '@/components/DocumentsManager';
import NotificationsCenter from '@/components/NotificationsCenter';

interface DashboardStats {
  totalOrders: number;
  activeOrders: number;
  completedOrders: number;
  totalSpent: number;
}

interface RecentOrder {
  id: string;
  status: string;
  service_tier: string;
  total_cost: number;
  created_at: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { fetchWithAuth } = useFetch();
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<'user' | 'agent' | 'admin'>('user');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [caseId, setCaseId] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          router.push('/auth/login');
          return;
        }

        const userData = JSON.parse(userStr);
        const userEmail = userData.email;
        const username = userData.username || userData.email?.split('@')[0] || 'User';
        const role = userData.role || 'user';
        
        setUserName(username);
        setUserRole(role);

        // Use port 8000 for orders (backend_django) and port 8001 for documents (doccheck_service)
        const backendUrl = 'http://127.0.0.1:8000/api';
        const ordersRes = await fetchWithAuth(`${backendUrl}/orders/seller/list/?email=${encodeURIComponent(userEmail)}`, {
          method: 'GET',
        });

        if (ordersRes.ok) {
          const data = await ordersRes.json();
          const ordersList = Array.isArray(data) ? data : data.results || data.data || [];
          
          setOrders(ordersList.slice(0, 5));
          
          const active = ordersList.filter((o: RecentOrder) => o.status !== 'completed').length;
          const completed = ordersList.filter((o: RecentOrder) => o.status === 'completed').length;
          const total = ordersList.reduce((sum: number, o: RecentOrder) => sum + (o.total_cost || 0), 0);
          
          setStats({
            totalOrders: ordersList.length,
            activeOrders: active,
            completedOrders: completed,
            totalSpent: total,
          });

          // Fetch real documents from backend
          const mockCaseId = 'dc_case_' + Math.random().toString(36).substr(2, 9);
          setCaseId(mockCaseId);
          
          try {
            // Use fetchWithAuth for automatic token refresh on 401
            const docsRes = await fetchWithAuth('http://127.0.0.1:8000/api/documents/', {
              method: 'GET',
            });
            
            console.log('[Dashboard] Documents response:', docsRes.status, docsRes.ok);
            
            if (docsRes.ok) {
              const docsData = await docsRes.json();
              console.log('[Dashboard] Documents data:', docsData);
              const docsList = Array.isArray(docsData) ? docsData : docsData.results || [];
              console.log('[Dashboard] Documents list:', docsList);
              
              // Transform backend Document model to DocumentsManager Document interface
              const transformedDocuments: Document[] = docsList.map((doc: any, index: number) => {
                // Extract filename from file path (e.g., "/media/documents/2026/03/30/file.pdf" -> "file.pdf")
                const fileUrl = doc.file || '';
                const filename = typeof fileUrl === 'string' ? fileUrl.split('/').pop() || 'Document' : 'Document';
                
                // Map document_type to document_key - use filename as differentiator
                const typeMap: Record<string, string> = {
                  'id': 'nif',
                  'license': 'passport',
                  'proof_of_address': 'certidao',
                  'other': 'caderneta'
                };
                
                // Use a combination of document_type and index to create unique keys for display
                const baseKey = typeMap[doc.document_type] || doc.document_type;
                const documentKey = filename ? `${baseKey}_${filename}` : `${baseKey}_${index}`;
                
                const transformed = {
                  id: doc.id?.toString() || `doc_${index}`,
                  document_key: documentKey,
                  file_name: filename,
                  status: doc.status === 'approved' ? 'verified' : (doc.status === 'pending' ? 'pending' : 'uploaded'),
                  is_expired: false,
                  uploaded_at: doc.uploaded_at || new Date().toISOString(),
                  reason: doc.rejection_reason,
                  extracted_fields: doc.extracted_fields || undefined,
                };
                console.log('[Dashboard] Transformed doc:', transformed);
                return transformed;
              });
              
              console.log('[Dashboard] Final documents:', transformedDocuments);
              setDocuments(transformedDocuments);
            } else {
              console.error('[Dashboard] Failed to fetch documents:', docsRes.status);
              const errorText = await docsRes.text();
              console.error('[Dashboard] Error response:', errorText);
              setDocuments([]);
            }
          } catch (err) {
            console.error('[Dashboard] Error fetching documents:', err);
            setDocuments([]);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const handleDocumentUpload = async (documentKey: string, file: File) => {
    console.log('[Dashboard] Upload started:', { documentKey, fileName: file.name, fileSize: file.size, caseId });
    
    if (!caseId) {
      alert('Case ID not found. Please submit the document verification first.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('document_key', documentKey);
      formData.append('file', file);

      console.log('[Dashboard] Sending POST to:', `http://127.0.0.1:8001/api/cases/${caseId}/documents/upload/`);
      const response = await fetch(
        `http://127.0.0.1:8001/api/cases/${caseId}/documents/upload/`,
        {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token') || ''}`,
          },
        }
      );

      console.log('[Dashboard] Response:', { status: response.status, ok: response.ok });
      
      if (response.ok) {
        const uploadedDoc = await response.json();
        // Update documents list
        setDocuments((prev) => {
          const index = prev.findIndex((d) => d.document_key === documentKey);
          if (index >= 0) {
            const updated = [...prev];
            updated[index] = {
              ...updated[index],
              id: uploadedDoc.id,
              file_name: uploadedDoc.file_name,
              status: 'uploaded',
              uploaded_at: new Date().toISOString(),
            };
            return updated;
          }
          return prev;
        });
        alert('Document uploaded successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', response.status, errorData);
        alert(`Failed to upload document: ${errorData.detail || response.statusText}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Error uploading document: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF8' }}>
        <p style={{ color: BRAND_COLORS.mediumGray, fontSize: FONT_SIZES.lg }}>⏳ Loading...</p>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'active': '#2196F3',
      'pending': '#FF9800',
      'completed': '#4CAF50',
      'cancelled': '#F44336',
    };
    return colors[status] || '#999';
  };

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
      {/* Sidebar */}
      <div style={{ display: 'flex' }}>
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
          <div style={{ marginBottom: SPACING.xl }}>
            <h1 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, margin: 0 }}>Fizbo</h1>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: SPACING.md }}>
              <p style={{ fontSize: FONT_SIZES.sm, opacity: 0.9, margin: 0 }}>
                Seller Platform
              </p>
              <div style={{ transform: 'scale(0.8)' }}>
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md, marginBottom: SPACING.xl }}>
            <SidebarLink href="/dashboard" label={t('nav.dashboard')} icon="D" active={true} />
            <SidebarLink href="/doccheck" label={t('nav.doccheck')} icon="C" />
            <SidebarLink href="/documents" label={t('nav.documentos')} icon="F" />
            <SidebarLink href="/orders" label={t('nav.pedidos')} icon="O" />
            <SidebarLink href="/cma" label={t('nav.cma')} icon="R" />
          </nav>

          <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: `${SPACING.xl} 0` }} />

          <nav style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
            <SidebarLink href="/profile" label={t('nav.perfil')} icon="P" />
            <SidebarLink href="/settings" label={t('nav.definicoes')} icon="S" />
            <LogoutButton label={t('nav.logout')} icon="L" />
          </nav>
        </aside>

        {/* Main Content */}
        <main style={{ marginLeft: '280px', padding: SPACING.xl }}>
          <div style={{ marginBottom: SPACING.xl, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0 }}>
                {t('dashboard.dashboard')}
              </h2>
              <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 0 0` }}>
                Welcome back, <strong>{userName}</strong>! Here's your activity overview.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.lg }}>
              <NotificationsCenter />
              <div style={{ width: '180px', display: 'flex', justifyContent: 'flex-end' }}>
                <LanguageSwitcher />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: SPACING.lg,
            marginBottom: SPACING.xl,
          }}>
            <StatCard label={t('dashboard.pedidos')} value={stats?.totalOrders || 0} color={BRAND_COLORS.primary} />
            <StatCard label={t('dashboard.pendentes')} value={stats?.activeOrders || 0} color={BRAND_COLORS.gold} />
            <StatCard label={t('dashboard.completos')} value={stats?.completedOrders || 0} color={BRAND_COLORS.success} />
            <StatCard label={t('dashboard.gasto')} value={formatCurrency(stats?.totalSpent || 0)} color={BRAND_COLORS.accent} />
          </div>

          {/* Main Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: SPACING.lg,
          }}>
            {/* Recent Orders */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
                <h3 style={{
                  fontSize: FONT_SIZES.xl,
                  fontWeight: 700,
                  color: BRAND_COLORS.textDark,
                  margin: 0,
                }}>
                  {t('dashboard.recentOrders')}
                </h3>
                <Link href="/orders" style={{
                  color: BRAND_COLORS.primary,
                  textDecoration: 'none',
                  fontWeight: 600,
                  fontSize: FONT_SIZES.sm,
                }}>
                  {t('dashboard.viewAll')}
                </Link>
              </div>

              {orders.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                  {orders.map((order) => (
                    <div
                      key={order.id}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: SPACING.md,
                        border: `1px solid ${BRAND_COLORS.lightGray}`,
                        borderRadius: BORDER_RADIUS.sm,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                      }}
                      onClick={() => router.push(`/orders/${order.id}`)}
                      onMouseEnter={(e) => {
                        (e.currentTarget).style.backgroundColor = '#F9F7F4';
                        (e.currentTarget).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget).style.backgroundColor = 'transparent';
                        (e.currentTarget).style.boxShadow = 'none';
                      }}
                    >
                      <div>
                        <p style={{ fontSize: FONT_SIZES.base, fontWeight: 600, color: BRAND_COLORS.textDark, margin: 0 }}>
                          {t('dashboard.orderNo')}{order.id}
                        </p>
                        <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.xs} 0 0 0` }}>
                          {order.service_tier || 'Standard'} {t('dashboard.plan')}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: FONT_SIZES.base, fontWeight: 600, color: BRAND_COLORS.textDark, margin: 0 }}>
                          {formatCurrency(order.total_cost || 0)}
                        </p>
                        <span style={{
                          display: 'inline-block',
                          fontSize: FONT_SIZES.sm,
                          backgroundColor: getStatusColor(order.status) + '33',
                          color: getStatusColor(order.status),
                          padding: `${SPACING.xs} ${SPACING.md}`,
                          borderRadius: BORDER_RADIUS.sm,
                          fontWeight: 600,
                          marginTop: SPACING.xs,
                        }}>
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: SPACING.xl }}>
                  <p style={{ fontSize: FONT_SIZES.lg, color: BRAND_COLORS.mediumGray, margin: 0 }}>{t('dashboard.noOrders')}</p>
                </div>
              )}
            </div>

            {/* Quick Actions & Support */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
              {/* Quick Actions */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.lg,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              }}>
                <h3 style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: 700,
                  color: BRAND_COLORS.textDark,
                  margin: 0,
                  marginBottom: SPACING.lg,
                }}>
                  {t('dashboard.quickActions')}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                  <ActionButton href="/doccheck" label={t('dashboard.assessment')} />
                  <ActionButton href="/documents" label={t('dashboard.documents')} />
                  <ActionButton href="/cma" label={t('dashboard.cmaReport')} />
                </div>
              </div>

              {/* Support Card */}
              <div style={{
                backgroundColor: BRAND_COLORS.primary,
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.lg,
                color: 'white',
              }}>
                <h3 style={{
                  fontSize: FONT_SIZES.lg,
                  fontWeight: 700,
                  margin: 0,
                  marginBottom: SPACING.md,
                }}>
                  {t('dashboard.needHelp')}
                </h3>
                <p style={{
                  fontSize: FONT_SIZES.sm,
                  opacity: 0.9,
                  margin: `0 0 ${SPACING.md} 0`,
                }}>
                  {t('dashboard.supportText')}
                </p>
                <a
                  href="mailto:support@fizbo.pt"
                  style={{
                    display: 'inline-block',
                    color: 'white',
                    textDecoration: 'underline',
                    fontWeight: 600,
                    fontSize: FONT_SIZES.sm,
                  }}
                >
                  {t('dashboard.contactSupport')}
                </a>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.lg,
            border: `1px solid ${BRAND_COLORS.lightGray}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            marginTop: SPACING.xl,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
              <h3 style={{
                fontSize: FONT_SIZES.xl,
                fontWeight: 700,
                color: BRAND_COLORS.textDark,
                margin: 0,
              }}>
                📄 {t('dashboard.documents') || 'Document Verification'}
              </h3>
              {userRole === 'agent' && (
                <span style={{
                  fontSize: FONT_SIZES.sm,
                  backgroundColor: BRAND_COLORS.primary + '20',
                  color: BRAND_COLORS.primary,
                  padding: `${SPACING.xs} ${SPACING.md}`,
                  borderRadius: BORDER_RADIUS.sm,
                  fontWeight: 600,
                }}>
                  Agent Access
                </span>
              )}
            </div>
            
            <DocumentsManager
              userRole={userRole || 'user'}
              documents={documents}
              onUpload={handleDocumentUpload}
            />
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}

interface StatCardProps {
  label: string;
  value: number | string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, color }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: `1px solid ${BRAND_COLORS.lightGray}`,
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ flex: 1 }}>
        <p style={{
          fontSize: FONT_SIZES.sm,
          color: BRAND_COLORS.mediumGray,
          fontWeight: 500,
          margin: 0,
        }}>
          {label}
        </p>
        <h4 style={{
          fontSize: FONT_SIZES['3xl'],
          fontWeight: 700,
          color: color,
          margin: `${SPACING.md} 0 0 0`,
        }}>
          {value}
        </h4>
      </div>
    </div>
  </div>
);

interface ActionButtonProps {
  href: string;
  label: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({ href, label }) => (
  <Link
    href={href}
    style={{
      display: 'block',
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.md,
      border: `2px solid ${BRAND_COLORS.primary}`,
      textDecoration: 'none',
      color: BRAND_COLORS.primary,
      fontWeight: 600,
      textAlign: 'center',
      transition: 'all 0.2s ease',
      cursor: 'pointer',
    }}
    onMouseEnter={(e) => {
      (e.currentTarget).style.backgroundColor = BRAND_COLORS.primary + '10';
      (e.currentTarget).style.transform = 'translateY(-2px)';
      (e.currentTarget).style.boxShadow = '0 4px 12px rgba(46,93,75,0.2)';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget).style.backgroundColor = 'transparent';
      (e.currentTarget).style.transform = 'translateY(0)';
      (e.currentTarget).style.boxShadow = 'none';
    }}
  >
    {label}
  </Link>
);

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, label, icon, active = false }) => (
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
    onMouseEnter={(e) => {
      if (!active) {
        (e.currentTarget).style.backgroundColor = 'rgba(255,255,255,0.1)';
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        (e.currentTarget).style.backgroundColor = 'transparent';
      }
    }}
  >
    <span style={{ 
      width: '24px', 
      height: '24px', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      fontWeight: 700,
      fontSize: FONT_SIZES.sm,
    }}>
      {icon}
    </span>
    <span>{label}</span>
  </Link>
);

interface LogoutButtonProps {
  label: string;
  icon: string;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({ label, icon }) => {
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/auth/login';
  };

  return (
    <button
      onClick={handleLogout}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.md,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: 'transparent',
        border: 'none',
        color: 'white',
        fontWeight: 500,
        textAlign: 'left',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget).style.backgroundColor = 'rgba(255,255,255,0.1)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget).style.backgroundColor = 'transparent';
      }}
    >
      <span style={{ 
        width: '24px', 
        height: '24px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        fontWeight: 700,
        fontSize: FONT_SIZES.sm,
      }}>
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
};

