'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useAuthReady } from '@/shared/hooks/useAuthReady';
import { useFetch } from '@/shared/hooks/useFetch';
import { buildApiUrl } from '@/lib/api-url';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface SubmissionForReview {
  id: number;
  seller_username: string;
  template_name: string;
  status: string;
  submitted_at: string;
  file?: string;
  extracted_data: any;
  missing_fields: string[];
}

export default function AdminDocumentsReviewPage() {
  const { t } = useLanguage();
  const router = useRouter();
  const { isReady } = useAuthReady();
  const { fetchWithAuth } = useFetch();

  const [submissions, setSubmissions] = useState<SubmissionForReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('pending_review'); // pending_review, all
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionForReview | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [reviewing, setReviewing] = useState(false);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!isReady) return;

      try {
        const res = await fetchWithAuth(buildApiUrl('/admin/property-documents/'));
        if (res.ok) {
          const data = await res.json();
          setSubmissions(data.results || data);
        }
      } catch (err) {
        console.error('Failed to fetch submissions:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isReady) {
      fetchSubmissions();
    }
  }, [isReady, fetchWithAuth]);

  const handleReview = async (action: 'approve' | 'reject' | 'needs_revision') => {
    if (!selectedSubmission) return;

    setReviewing(true);
    try {
      const res = await fetchWithAuth(buildApiUrl(`/admin/property-documents/${selectedSubmission.id}/review/`), {
        method: 'PATCH',
        body: JSON.stringify({
          action,
          notes: reviewNotes,
        }),
      });

      if (res.ok) {
        alert(`Document ${action} successfully!`);
        setSelectedSubmission(null);
        setReviewNotes('');
        // Refresh list
        const updatedRes = await fetchWithAuth(buildApiUrl('/admin/property-documents/'));
        if (updatedRes.ok) {
          const data = await updatedRes.json();
          setSubmissions(data.results || data);
        }
      } else {
        alert('Failed to review document');
      }
    } catch (err) {
      console.error('Review error:', err);
      alert('Error reviewing document');
    } finally {
      setReviewing(false);
    }
  };

  const filteredSubmissions = submissions.filter((s) => {
    if (filter === 'all') return true;
    return s.status === filter;
  });

  if (loading) {
    return (
      <ProtectedRoute>
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', padding: SPACING.xl }}>
          <p>Loading...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
        <main style={{ padding: SPACING.xl, maxWidth: '1400px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
            <div>
              <Link href="/dashboard" style={{ color: BRAND_COLORS.primary, textDecoration: 'none' }}>
                ← Back to Dashboard
              </Link>
              <h1 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.textDark, margin: `${SPACING.lg} 0 ${SPACING.sm} 0` }}>
                Document Review
              </h1>
              <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                Review seller document submissions
              </p>
            </div>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'right' }}>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.xl }}>
            {/* Submissions List */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {/* Filter */}
              <div style={{ padding: SPACING.lg, borderBottom: `1px solid ${BRAND_COLORS.lightGray}` }}>
                <label style={{ fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark }}>
                  Filter:
                </label>
                <div style={{ marginTop: SPACING.sm }}>
                  {['pending_review', 'all'].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        marginRight: SPACING.md,
                        padding: `${SPACING.sm} ${SPACING.md}`,
                        backgroundColor: filter === f ? BRAND_COLORS.primary : 'transparent',
                        color: filter === f ? 'white' : BRAND_COLORS.textDark,
                        border: `1px solid ${BRAND_COLORS.lightGray}`,
                        borderRadius: BORDER_RADIUS.md,
                        cursor: 'pointer',
                        fontSize: FONT_SIZES.sm,
                        fontWeight: 600,
                      }}
                    >
                      {f === 'pending_review' ? 'Pending Review' : 'All'}
                    </button>
                  ))}
                </div>
              </div>

              {/* List */}
              <div style={{ flex: 1, overflowY: 'auto', maxHeight: '600px' }}>
                {filteredSubmissions.map((submission) => (
                  <div
                    key={submission.id}
                    onClick={() => setSelectedSubmission(submission)}
                    style={{
                      padding: SPACING.lg,
                      borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
                      cursor: 'pointer',
                      backgroundColor: selectedSubmission?.id === submission.id ? '#F0F0F0' : 'white',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseOver={(e) => {
                      if (selectedSubmission?.id !== submission.id) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = '#FAFAFA';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedSubmission?.id !== submission.id) {
                        (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
                      }
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                      <p style={{
                        fontSize: FONT_SIZES.sm,
                        fontWeight: 600,
                        color: BRAND_COLORS.textDark,
                        margin: 0,
                      }}>
                        {submission.seller_username}
                      </p>
                      <span style={{
                        fontSize: FONT_SIZES.xs,
                        backgroundColor: '#FF9800',
                        color: 'white',
                        padding: `2px 8px`,
                        borderRadius: BORDER_RADIUS.sm,
                      }}>
                        Pending
                      </span>
                    </div>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      color: BRAND_COLORS.mediumGray,
                      margin: 0,
                    }}>
                      {submission.template_name}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Panel */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              padding: SPACING.lg,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
            }}>
              {selectedSubmission ? (
                <>
                  <div style={{ borderBottom: `1px solid ${BRAND_COLORS.lightGray}`, paddingBottom: SPACING.lg, marginBottom: SPACING.lg }}>
                    <h3 style={{
                      fontSize: FONT_SIZES.lg,
                      fontWeight: 600,
                      color: BRAND_COLORS.textDark,
                      margin: '0 0 8px 0',
                    }}>
                      {selectedSubmission.seller_username}
                    </h3>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      color: BRAND_COLORS.mediumGray,
                      margin: 0,
                    }}>
                      {selectedSubmission.template_name}
                    </p>
                  </div>

                  {/* Extracted Data */}
                  {selectedSubmission.extracted_data && Object.keys(selectedSubmission.extracted_data).length > 0 && (
                    <div style={{ marginBottom: SPACING.lg }}>
                      <h4 style={{
                        fontSize: FONT_SIZES.sm,
                        fontWeight: 600,
                        color: BRAND_COLORS.textDark,
                        marginBottom: SPACING.md,
                      }}>
                        Extracted Data:
                      </h4>
                      <div style={{
                        backgroundColor: '#F5F5F5',
                        padding: SPACING.md,
                        borderRadius: BORDER_RADIUS.md,
                      }}>
                        {Object.entries(selectedSubmission.extracted_data).map(([key, value]) => (
                          <div key={key} style={{ marginBottom: SPACING.sm }}>
                            <p style={{
                              fontSize: FONT_SIZES.xs,
                              fontWeight: 600,
                              color: BRAND_COLORS.mediumGray,
                              textTransform: 'uppercase',
                              margin: '0 0 4px 0',
                            }}>
                              {key}
                            </p>
                            <p style={{
                              fontSize: FONT_SIZES.sm,
                              color: BRAND_COLORS.textDark,
                              margin: 0,
                              wordBreak: 'break-word',
                            }}>
                              {typeof value === 'string' ? value : JSON.stringify(value)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missing Fields */}
                  {selectedSubmission.missing_fields && selectedSubmission.missing_fields.length > 0 && (
                    <div style={{ marginBottom: SPACING.lg }}>
                      <h4 style={{
                        fontSize: FONT_SIZES.sm,
                        fontWeight: 600,
                        color: '#E65100',
                        marginBottom: SPACING.md,
                      }}>
                        ⚠️ Missing Fields:
                      </h4>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: SPACING.sm,
                      }}>
                        {selectedSubmission.missing_fields.map((field) => (
                          <span key={field} style={{
                            backgroundColor: '#FFCCBC',
                            color: '#D84315',
                            padding: `${SPACING.xs} ${SPACING.sm}`,
                            borderRadius: BORDER_RADIUS.sm,
                            fontSize: FONT_SIZES.xs,
                            fontWeight: 600,
                          }}>
                            {field}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Review Notes */}
                  <div style={{ marginBottom: SPACING.lg, flex: 1 }}>
                    <label style={{
                      fontSize: FONT_SIZES.sm,
                      fontWeight: 600,
                      color: BRAND_COLORS.textDark,
                      display: 'block',
                      marginBottom: SPACING.sm,
                    }}>
                      Review Notes:
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Add notes for the seller..."
                      style={{
                        width: '100%',
                        height: '150px',
                        padding: SPACING.md,
                        border: `1px solid ${BRAND_COLORS.lightGray}`,
                        borderRadius: BORDER_RADIUS.md,
                        fontSize: FONT_SIZES.sm,
                        fontFamily: 'inherit',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: SPACING.md,
                  }}>
                    <button
                      onClick={() => handleReview('needs_revision')}
                      disabled={reviewing}
                      style={{
                        padding: SPACING.md,
                        backgroundColor: '#FFC107',
                        color: 'white',
                        border: 'none',
                        borderRadius: BORDER_RADIUS.md,
                        fontWeight: 600,
                        cursor: reviewing ? 'not-allowed' : 'pointer',
                        opacity: reviewing ? 0.6 : 1,
                      }}
                    >
                      Needs Revision
                    </button>
                    <button
                      onClick={() => handleReview('reject')}
                      disabled={reviewing}
                      style={{
                        padding: SPACING.md,
                        backgroundColor: '#F44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: BORDER_RADIUS.md,
                        fontWeight: 600,
                        cursor: reviewing ? 'not-allowed' : 'pointer',
                        opacity: reviewing ? 0.6 : 1,
                      }}
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleReview('approve')}
                      disabled={reviewing}
                      style={{
                        padding: SPACING.md,
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        borderRadius: BORDER_RADIUS.md,
                        fontWeight: 600,
                        cursor: reviewing ? 'not-allowed' : 'pointer',
                        opacity: reviewing ? 0.6 : 1,
                        gridColumn: '1 / -1',
                      }}
                    >
                      {reviewing ? 'Processing...' : 'Approve'}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  color: BRAND_COLORS.mediumGray,
                }}>
                  <p>Select a submission to review</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
