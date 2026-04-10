'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useNotification } from '@/shared/context/NotificationContext';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface Document {
  id: string;
  document_key: string;
  file_name: string;
  status: 'pending' | 'uploaded' | 'verified' | 'expired' | 'rejected';
  expiry_date?: string;
  is_expired: boolean;
  uploaded_at?: string;
  reason?: string;
}

interface Case {
  provider_case_id: string;
  seller_email: string;
  status: string;
  documents: Document[];
  created_at: string;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' },
  uploaded: { bg: '#E3F2FD', text: '#1565C0', border: '#64B5F6' },
  verified: { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' },
  expired: { bg: '#FCE4EC', text: '#C2185B', border: '#F48FB1' },
  rejected: { bg: '#FFEBEE', text: '#B71C1C', border: '#EF5350' },
};

export default function AgentDashboard() {
  const router = useRouter();
  const { t } = useLanguage();
  const { addNotification } = useNotification();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [updatingDoc, setUpdatingDoc] = useState<string | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      router.push('/auth/login');
      return;
    }

    const userData = JSON.parse(userStr);
    const role = userData.role || 'user';

    if (role !== 'agent') {
      router.push('/dashboard');
      return;
    }

    // Mock assigned cases - in production, fetch from API
    const mockCases: Case[] = [
      {
        provider_case_id: 'dc_case_001',
        seller_email: 'seller1@example.com',
        status: 'active',
        documents: [
          {
            id: '1',
            document_key: 'caderneta',
            file_name: 'Caderneta Informática (2024-2025)',
            status: 'uploaded',
            expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
            is_expired: false,
            uploaded_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            document_key: 'certidao',
            file_name: 'Certidão de Propriedade - Imóvel Lisboa',
            status: 'uploaded',
            expiry_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
            is_expired: false,
            uploaded_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            document_key: 'energy_cert',
            file_name: 'Certificado Energético - Loja Porto',
            status: 'uploaded',
            expiry_date: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            is_expired: false,
            uploaded_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ],
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        provider_case_id: 'dc_case_002',
        seller_email: 'seller2@example.com',
        status: 'active',
        documents: [
          {
            id: '4',
            document_key: 'caderneta',
            file_name: 'Caderneta Informática (2024-2025)',
            status: 'pending',
            is_expired: false,
          },
        ],
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];

    setCases(mockCases);
    setLoading(false);
  }, [router]);

  const handleStatusChange = async (caseId: string, doc: Document, newStatus: string) => {
    setUpdatingDoc(doc.id);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newReason = newStatus === 'rejected' ? rejectionNote : undefined;

      // Update local state
      setCases((prev) =>
        prev.map((c) =>
          c.provider_case_id === caseId
            ? {
                ...c,
                documents: c.documents.map((d) =>
                  d.id === doc.id
                    ? { ...d, status: newStatus as any, reason: newReason }
                    : d
                ),
              }
            : c
        )
      );

      // Add notification to user
      const statusText = t(`documentManager.status.${newStatus}`);
      addNotification({
        type:
          newStatus === 'verified'
            ? 'document_verified'
            : newStatus === 'rejected'
              ? 'document_rejected'
              : 'document_status_changed',
        title: t('notification.documentStatusChanged'),
        message: `${doc.file_name} - ${statusText}${newStatus === 'rejected' && newReason ? `: ${newReason}` : ''}`,
        documentKey: doc.document_key,
        caseId,
        status: newStatus,
      });

      setRejectionNote('');
      alert(t('documentManager.statusSuccess'));
    } catch (error) {
      console.error('Status update error:', error);
      alert(t('documentManager.statusError'));
    } finally {
      setUpdatingDoc(null);
    }
  };

  const getDocumentIcon = (key: string): string => {
    const icons: Record<string, string> = {
      caderneta: '📚',
      certidao: '🏛️',
      energy_cert: '⚡',
      certidao_propriedade: '🏠',
      nif: '🆔',
      passport: '🛂',
      default: '📄',
    };
    return icons[key] || icons.default;
  };

  const getDocumentName = (key: string): string => {
    const names: Record<string, string> = {
      caderneta: 'Caderneta Informática (2024-2025)',
      certidao: 'Certidão de Propriedade - Imóvel Lisboa',
      energy_cert: 'Certificado Energético - Loja Porto',
      certidao_propriedade: t('docType.certidao_propriedade'),
      nif: t('docType.nif'),
      passport: t('docType.passport'),
    };
    return names[key] || key;
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: BRAND_COLORS.mediumGray }}>{t('documentManager.updating')}</p>
      </div>
    );
  }

  return (
    <ProtectedRoute requiredRole="agent">
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', padding: SPACING.xl }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: SPACING.xl,
          }}
        >
          <h1
            style={{
              fontSize: FONT_SIZES['3xl'],
              fontWeight: 700,
              color: BRAND_COLORS.textDark,
              margin: 0,
            }}
          >
            {t('agent.dashboard')}
          </h1>
          <LanguageSwitcher />
        </div>

        {!selectedCase ? (
          // Cases List View
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: SPACING.lg,
            }}
          >
            {cases.length === 0 ? (
              <div
                style={{
                  padding: SPACING.xl,
                  backgroundColor: 'white',
                  borderRadius: BORDER_RADIUS.md,
                  border: `1px dashed ${BRAND_COLORS.lightGray}`,
                  textAlign: 'center',
                }}
              >
                <p style={{ color: BRAND_COLORS.mediumGray }}>
                  {t('agent.noCases')}
                </p>
              </div>
            ) : (
              cases.map((caseItem) => (
                <div
                  key={caseItem.provider_case_id}
                  onClick={() => setSelectedCase(caseItem)}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: BORDER_RADIUS.md,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    padding: SPACING.lg,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'start',
                      marginBottom: SPACING.md,
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          fontSize: FONT_SIZES.base,
                          fontWeight: 600,
                          color: BRAND_COLORS.textDark,
                          margin: 0,
                          marginBottom: SPACING.xs,
                        }}
                      >
                        {t('agent.caseId')}: {caseItem.provider_case_id}
                      </h3>
                      <p
                        style={{
                          fontSize: FONT_SIZES.sm,
                          color: BRAND_COLORS.mediumGray,
                          margin: 0,
                        }}
                      >
                        📧 {caseItem.seller_email}
                      </p>
                    </div>
                    <div
                      style={{
                        backgroundColor: '#E8F5E9',
                        color: '#2E7D32',
                        padding: `${SPACING.xs} ${SPACING.md}`,
                        borderRadius: BORDER_RADIUS.full,
                        fontSize: FONT_SIZES.xs,
                        fontWeight: 600,
                      }}
                    >
                      {caseItem.status.toUpperCase()}
                    </div>
                  </div>

                  <hr style={{ border: 'none', borderTop: `1px solid ${BRAND_COLORS.lightGray}`, margin: SPACING.md }} />

                  <div style={{ marginBottom: SPACING.md }}>
                    <p
                      style={{
                        fontSize: FONT_SIZES.sm,
                        fontWeight: 600,
                        color: BRAND_COLORS.textDark,
                        margin: `0 0 ${SPACING.sm}`,
                      }}
                    >
                      📄 {t('agent.documents')}: {caseItem.documents.length}
                    </p>
                    <div style={{ display: 'flex', gap: SPACING.sm, flexWrap: 'wrap' }}>
                      {caseItem.documents.map((doc) => (
                        <div
                          key={doc.id}
                          style={{
                            ...statusColors[doc.status],
                            padding: `${SPACING.xs} ${SPACING.sm}`,
                            borderRadius: BORDER_RADIUS.full,
                            fontSize: FONT_SIZES.xs,
                            fontWeight: 600,
                          }}
                        >
                          {getDocumentIcon(doc.document_key)} {doc.document_key}
                        </div>
                      ))}
                    </div>
                  </div>

                  <p
                    style={{
                      fontSize: FONT_SIZES.xs,
                      color: BRAND_COLORS.mediumGray,
                      margin: 0,
                    }}
                  >
                    Created: {new Date(caseItem.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          // Case Details View
          <div>
            <button
              onClick={() => setSelectedCase(null)}
              style={{
                background: 'none',
                border: 'none',
                color: BRAND_COLORS.primary,
                fontSize: FONT_SIZES.base,
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: SPACING.lg,
              }}
            >
              {t('agent.backToAgentDash')}
            </button>

            <div
              style={{
                backgroundColor: 'white',
                borderRadius: BORDER_RADIUS.md,
                border: `1px solid ${BRAND_COLORS.lightGray}`,
                padding: SPACING.xl,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: SPACING.xl,
                }}
              >
                <h2
                  style={{
                    fontSize: FONT_SIZES['2xl'],
                    fontWeight: 700,
                    color: BRAND_COLORS.textDark,
                    margin: 0,
                  }}
                >
                  {t('agent.caseDetails')}: {selectedCase.provider_case_id}
                </h2>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: SPACING.lg,
                }}
              >
                {selectedCase.documents.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      backgroundColor: '#FAFAF8',
                      borderRadius: BORDER_RADIUS.md,
                      border: `2px solid ${statusColors[doc.status].border}`,
                      padding: SPACING.lg,
                    }}
                  >
                    {/* Document Header */}
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'start',
                        marginBottom: SPACING.md,
                      }}
                    >
                      <div style={{ display: 'flex', gap: SPACING.md, alignItems: 'flex-start' }}>
                        <span style={{ fontSize: FONT_SIZES['2xl'] }}>
                          {getDocumentIcon(doc.document_key)}
                        </span>
                        <div>
                          <h3
                            style={{
                              fontSize: FONT_SIZES.base,
                              fontWeight: 600,
                              color: BRAND_COLORS.textDark,
                              margin: 0,
                              marginBottom: SPACING.xs,
                            }}
                          >
                            {getDocumentName(doc.document_key)}
                          </h3>
                          <p
                            style={{
                              fontSize: FONT_SIZES.xs,
                              color: BRAND_COLORS.mediumGray,
                              margin: 0,
                              textTransform: 'uppercase',
                            }}
                          >
                            {doc.document_key}
                          </p>
                        </div>
                      </div>
                      <div
                        style={{
                          ...statusColors[doc.status],
                          padding: `${SPACING.xs} ${SPACING.md}`,
                          borderRadius: BORDER_RADIUS.full,
                          fontSize: FONT_SIZES.xs,
                          fontWeight: 600,
                        }}
                      >
                        {t(`documentManager.status.${doc.status}`)}
                      </div>
                    </div>

                    {/* Document Info */}
                    {doc.uploaded_at && (
                      <p
                        style={{
                          fontSize: FONT_SIZES.xs,
                          color: BRAND_COLORS.mediumGray,
                          margin: `0 0 ${SPACING.md}`,
                        }}
                      >
                        📅 {new Date(doc.uploaded_at).toLocaleDateString()}
                      </p>
                    )}

                    {/* Status Change Controls */}
                    <div style={{ marginBottom: SPACING.md }}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: FONT_SIZES.sm,
                          fontWeight: 600,
                          color: BRAND_COLORS.textDark,
                          marginBottom: SPACING.sm,
                        }}
                      >
                        {t('agent.changeStatus')}
                      </label>
                      <div style={{ display: 'flex', gap: SPACING.sm }}>
                        <button
                          onClick={() =>
                            handleStatusChange(selectedCase.provider_case_id, doc, 'verified')
                          }
                          disabled={updatingDoc === doc.id || doc.status === 'verified'}
                          style={{
                            flex: 1,
                            padding: SPACING.md,
                            backgroundColor: '#E8F5E9',
                            color: '#2E7D32',
                            border: '1px solid #81C784',
                            borderRadius: BORDER_RADIUS.sm,
                            fontWeight: 600,
                            cursor: updatingDoc === doc.id ? 'not-allowed' : 'pointer',
                            opacity: updatingDoc === doc.id ? 0.6 : 1,
                          }}
                        >
                          {updatingDoc === doc.id ? '⏳' : '✅'} {t('agent.verifyDoc')}
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(selectedCase.provider_case_id, doc, 'rejected')
                          }
                          disabled={updatingDoc === doc.id || doc.status === 'rejected'}
                          style={{
                            flex: 1,
                            padding: SPACING.md,
                            backgroundColor: '#FFEBEE',
                            color: '#B71C1C',
                            border: '1px solid #EF5350',
                            borderRadius: BORDER_RADIUS.sm,
                            fontWeight: 600,
                            cursor: updatingDoc === doc.id ? 'not-allowed' : 'pointer',
                            opacity: updatingDoc === doc.id ? 0.6 : 1,
                          }}
                        >
                          {updatingDoc === doc.id ? '⏳' : '❌'} {t('agent.rejectDoc')}
                        </button>
                      </div>
                    </div>

                    {/* Rejection Note */}
                    {doc.status === 'rejected' || updatingDoc === doc.id ? (
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: FONT_SIZES.sm,
                            fontWeight: 600,
                            color: BRAND_COLORS.textDark,
                            marginBottom: SPACING.sm,
                          }}
                        >
                          {t('agent.rejectionNote')}
                        </label>
                        <textarea
                          value={rejectionNote}
                          onChange={(e) => setRejectionNote(e.target.value)}
                          placeholder={t('agent.addNote')}
                          style={{
                            width: '100%',
                            padding: SPACING.md,
                            borderRadius: BORDER_RADIUS.sm,
                            border: `1px solid ${BRAND_COLORS.lightGray}`,
                            fontSize: FONT_SIZES.sm,
                            fontFamily: 'inherit',
                            resize: 'vertical',
                            minHeight: '80px',
                          }}
                        />
                      </div>
                    ) : null}

                    {/* Rejection Reason Display */}
                    {doc.status === 'rejected' && doc.reason && (
                      <div
                        style={{
                          backgroundColor: '#FFEBEE',
                          borderLeft: `3px solid #D32F2F`,
                          padding: SPACING.md,
                          borderRadius: BORDER_RADIUS.sm,
                          marginTop: SPACING.md,
                        }}
                      >
                        <p
                          style={{
                            fontSize: FONT_SIZES.sm,
                            color: '#B71C1C',
                            margin: 0,
                            fontWeight: 600,
                            marginBottom: SPACING.xs,
                          }}
                        >
                          ❌ {t('documentManager.rejectionReason')}
                        </p>
                        <p
                          style={{
                            fontSize: FONT_SIZES.sm,
                            color: '#C62828',
                            margin: 0,
                          }}
                        >
                          {doc.reason}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
