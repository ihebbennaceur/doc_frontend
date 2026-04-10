'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';

interface OrderDetail {
  id: string;
  tier: string;
  status: string;
  created_at: string;
  completed_at?: string;
  total_cost: number;
  documents: Document[];
  timeline_estimate: number;
  risk_flags: string[];
  seller_notes?: string;
}

interface Document {
  name: string;
  status: 'complete' | 'pending' | 'blocked';
  uploaded_at?: string;
  note?: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploadingFile, setUploadingFile] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`http://localhost:8000/api/orders/${orderId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error('Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadingFile(true);
    const formData = new FormData(e.currentTarget);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`http://localhost:8000/api/orders/${orderId}/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const updatedOrder = await res.json();
        setOrder(updatedOrder);
        e.currentTarget.reset();
        alert('Document uploaded successfully');
      }
    } catch (err) {
      alert('Upload failed');
    } finally {
      setUploadingFile(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: BRAND_COLORS.mediumGray }}>Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: BRAND_COLORS.mediumGray }}>Order not found</p>
      </div>
    );
  }

  const progressPercentage = order.documents ? (order.documents.filter((d) => d.status === 'complete').length / order.documents.length) * 100 : 0;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
      <div style={{ display: 'flex' }}>
        <Sidebar />

        <main style={{ marginLeft: '280px', padding: SPACING.xl, width: '100%' }}>
          <Link href="/orders" style={{ color: BRAND_COLORS.primary, textDecoration: 'none', marginBottom: SPACING.md, display: 'inline-block' }}>
            ← Back to Orders
          </Link>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: SPACING.lg }}>
            {/* Main Content */}
            <div>
              <h2 style={{
                fontSize: FONT_SIZES['3xl'],
                fontWeight: 700,
                color: BRAND_COLORS.textDark,
                margin: `0 0 ${SPACING.lg} 0`,
              }}>
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h2>

              {/* Progress */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.lg,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
                marginBottom: SPACING.lg,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
                  <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0 }}>
                    Progress
                  </h3>
                  <span style={{ fontSize: FONT_SIZES.base, fontWeight: 700, color: BRAND_COLORS.primary }}>
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '8px',
                  backgroundColor: BRAND_COLORS.lightGray,
                  borderRadius: BORDER_RADIUS.lg,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    backgroundColor: BRAND_COLORS.primary,
                    width: `${progressPercentage}%`,
                    transition: 'width 0.3s ease',
                  }} />
                </div>
                <p style={{
                  fontSize: FONT_SIZES.sm,
                  color: BRAND_COLORS.mediumGray,
                  margin: `${SPACING.md} 0 0 0`,
                }}>
                  {order.documents.filter((d) => d.status === 'complete').length} of {order.documents.length} documents complete
                </p>
              </div>

              {/* Documents Checklist */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.lg,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
                marginBottom: SPACING.lg,
              }}>
                <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.lg} 0` }}>
                  Document Checklist
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                  {order.documents.map((doc, i) => (
                    <DocumentItem key={i} document={doc} />
                  ))}
                </div>
              </div>

              {/* Upload Section */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.lg,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
              }}>
                <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.lg} 0` }}>
                  Upload Document
                </h3>
                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                  <div>
                    <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                      Select Document
                    </label>
                    <select name="document_type" required style={{
                      width: '100%',
                      padding: `${SPACING.md}`,
                      borderRadius: BORDER_RADIUS.sm,
                      border: `1px solid ${BRAND_COLORS.lightGray}`,
                      fontSize: FONT_SIZES.base,
                      boxSizing: 'border-box',
                    }}>
                      <option value="">Choose document type</option>
                      {order.documents.filter((d) => d.status !== 'complete').map((doc) => (
                        <option key={doc.name} value={doc.name}>{doc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                      File
                    </label>
                    <input type="file" name="file" required style={{
                      width: '100%',
                      padding: `${SPACING.md}`,
                      borderRadius: BORDER_RADIUS.sm,
                      border: `1px solid ${BRAND_COLORS.lightGray}`,
                      boxSizing: 'border-box',
                    }} />
                  </div>
                  <button type="submit" disabled={uploadingFile} style={{
                    padding: `${SPACING.md} ${SPACING.lg}`,
                    backgroundColor: BRAND_COLORS.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: BORDER_RADIUS.lg,
                    fontWeight: 700,
                    cursor: uploadingFile ? 'not-allowed' : 'pointer',
                    opacity: uploadingFile ? 0.6 : 1,
                  }}>
                    {uploadingFile ? 'Uploading...' : 'Upload Document'}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
              {/* Order Info */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: BORDER_RADIUS.md,
                padding: SPACING.lg,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
              }}>
                <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0, marginBottom: SPACING.lg }}>
                  Order Info
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                  <InfoRow label="Tier" value={order.tier.toUpperCase()} />
                  <InfoRow label="Status" value={order.status.toUpperCase()} />
                  <InfoRow label="Created" value={new Date(order.created_at).toLocaleDateString('pt-PT')} />
                  <InfoRow label="Total Cost" value={`€${order.total_cost}`} />
                  <InfoRow label="Estimated Completion" value={`${order.timeline_estimate} days`} />
                </div>
              </div>

              {/* Risk Flags */}
              {order.risk_flags && order.risk_flags.length > 0 && (
                <div style={{
                  backgroundColor: '#FFF3E0',
                  borderRadius: BORDER_RADIUS.md,
                  padding: SPACING.lg,
                  border: `1px solid ${BRAND_COLORS.warning}`,
                }}>
                  <h3 style={{ fontSize: FONT_SIZES.base, fontWeight: 700, color: BRAND_COLORS.warning, margin: 0, marginBottom: SPACING.md }}>
                    Risk Flags
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
                    {order.risk_flags.map((flag, i) => (
                      <li key={i} style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.textDark }}>
                        • {flag}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Seller Notes */}
              {order.seller_notes && (
                <div style={{
                  backgroundColor: '#E3F2FD',
                  borderRadius: BORDER_RADIUS.md,
                  padding: SPACING.lg,
                  border: `1px solid ${BRAND_COLORS.primary}`,
                }}>
                  <h3 style={{ fontSize: FONT_SIZES.base, fontWeight: 700, color: BRAND_COLORS.primary, margin: 0, marginBottom: SPACING.md }}>
                    Seller Notes
                  </h3>
                  <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.textDark, margin: 0 }}>
                    {order.seller_notes}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const DocumentItem: React.FC<{ document: Document }> = ({ document }) => {
  const statusColor: Record<string, { bg: string; text: string; icon: string }> = {
    complete: { bg: '#E8F5E9', text: '#388E3C', icon: '✓' },
    pending: { bg: '#FFF3E0', text: '#F57C00', icon: '⏳' },
    blocked: { bg: '#FFEBEE', text: '#D32F2F', icon: '✕' },
  };

  const colors = statusColor[document.status];

  return (
    <div style={{
      padding: SPACING.md,
      backgroundColor: colors.bg,
      borderLeft: `3px solid ${colors.text}`,
      borderRadius: BORDER_RADIUS.sm,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.md }}>
        <span style={{ color: colors.text, fontWeight: 700, fontSize: FONT_SIZES.lg }}>
          {colors.icon}
        </span>
        <div>
          <p style={{ fontSize: FONT_SIZES.base, fontWeight: 600, color: BRAND_COLORS.textDark, margin: 0 }}>
            {document.name}
          </p>
          {document.uploaded_at && (
            <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: `${SPACING.xs} 0 0 0` }}>
              Uploaded: {new Date(document.uploaded_at).toLocaleDateString('pt-PT')}
            </p>
          )}
          {document.note && (
            <p style={{ fontSize: FONT_SIZES.xs, color: colors.text, margin: `${SPACING.xs} 0 0 0`, fontStyle: 'italic' }}>
              {document.note}
            </p>
          )}
        </div>
      </div>
      <span style={{
        padding: `${SPACING.xs} ${SPACING.md}`,
        backgroundColor: colors.text + '20',
        color: colors.text,
        borderRadius: BORDER_RADIUS.sm,
        fontSize: FONT_SIZES.xs,
        fontWeight: 700,
      }}>
        {document.status.toUpperCase()}
      </span>
    </div>
  );
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, fontWeight: 600, margin: 0 }}>
      {label}
    </p>
    <p style={{ fontSize: FONT_SIZES.base, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `${SPACING.xs} 0 0 0` }}>
      {value}
    </p>
  </div>
);

const Sidebar: React.FC = () => (
  <aside style={{
    width: '280px',
    backgroundColor: BRAND_COLORS.primary,
    color: 'white',
    padding: SPACING.xl,
    position: 'fixed',
    height: '100vh',
    overflowY: 'auto',
  }}>
    <h1 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, margin: 0, marginBottom: SPACING.md }}>
      Fizbo
    </h1>
    <p style={{ fontSize: FONT_SIZES.sm, opacity: 0.9, margin: `0 0 ${SPACING.xl} 0` }}>
      Seller Platform
    </p>

    <nav style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
      <SidebarLink href="/dashboard" label="Dashboard" icon="D" />
      <SidebarLink href="/doccheck" label="DocCheck" icon="C" />
      <SidebarLink href="/documents" label="Documents" icon="F" />
      <SidebarLink href="/orders" label="Orders" icon="O" active={true} />
      <SidebarLink href="/cma" label="CMA Report" icon="R" />
    </nav>
  </aside>
);

const SidebarLink: React.FC<{ href: string; label: string; icon: string; active?: boolean }> = ({
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
