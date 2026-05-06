'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useAuthReady } from '@/shared/hooks/useAuthReady';
import { useFetch } from '@/shared/hooks/useFetch';
import { buildApiUrl } from '@/lib/api-url';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Submission {
  id: number;
  template: number;
  template_name: string;
  template_description: string;
  template_category: string;
  template_required_fields: string[];
  status: string;
  extracted_data: any;
  missing_fields: string[];
  reviewer_notes: string;
  submitted_at: string;
  reviewed_at: string;
}

export default function SellingDocumentsPage() {
  const { isReady } = useAuthReady();
  const { fetchWithAuth } = useFetch();

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!isReady) return;

      try {
        // Fetch submissions dashboard
        const dashboardRes = await fetchWithAuth(buildApiUrl('/property-documents/dashboard/'), {
          method: 'POST',
        });
        if (dashboardRes.ok) {
          const data = await dashboardRes.json();
          setSubmissions(data.submissions || []);
          setSummary(data);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isReady) {
      fetchData();
    }
  }, [isReady, fetchWithAuth]);

  const handleFileUpload = async (submissionId: number, file: File) => {
    setUploading((prev) => ({ ...prev, [submissionId]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetchWithAuth(buildApiUrl(`/property-documents/${submissionId}/`), {
        method: 'PATCH',
        body: formData,
        // Don't set Content-Type, let the browser set it with boundary
      } as any);

      if (res.ok) {
        const data = await res.json();
        setSubmissions((prev) =>
          prev.map((s) => (s.id === submissionId ? data : s))
        );
        alert('Document uploaded successfully!');
      } else {
        const error = await res.json();
        alert(`Upload failed: ${JSON.stringify(error)}`);
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to upload document');
    } finally {
      setUploading((prev) => ({ ...prev, [submissionId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return '#4CAF50'; // green
      case 'rejected':
        return '#F44336'; // red
      case 'pending_review':
        return '#FF9800'; // orange
      case 'needs_revision':
        return '#FFC107'; // yellow
      case 'not_submitted':
        return '#9E9E9E'; // gray
      default:
        return BRAND_COLORS.primary;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'not_submitted': 'Not Submitted',
      'pending_review': 'Pending Review',
      'approved': 'Approved ✓',
      'rejected': 'Rejected ✗',
      'needs_revision': 'Needs Revision',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', padding: SPACING.xl }}>
          <p>Loading documents...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
        <main style={{ padding: SPACING.xl, maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
            <div>
              <Link href="/dashboard" style={{ color: BRAND_COLORS.primary, textDecoration: 'none' }}>
                ← Back to Dashboard
              </Link>
              <h1 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.textDark, margin: `${SPACING.lg} 0 ${SPACING.sm} 0` }}>
                Selling Documents Checklist
              </h1>
              <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                Upload required documents to sell your property
              </p>
            </div>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'right' }}>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Summary Cards */}
          {summary && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: SPACING.md,
              marginBottom: SPACING.lg,
            }}>
              <SummaryCard label="Total Documents" value={summary.total_documents} color={BRAND_COLORS.primary} />
              <SummaryCard label="Approved" value={summary.approved} color="#4CAF50" />
              <SummaryCard label="Pending Review" value={summary.pending_review} color="#FF9800" />
              <SummaryCard label="Not Submitted" value={summary.not_submitted} color="#9E9E9E" />
            </div>
          )}

          {/* Documents List */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.lg,
            border: `1px solid ${BRAND_COLORS.lightGray}`,
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}>
            {submissions.map((submission, idx) => (
              <div key={submission.id} style={{
                borderBottom: idx < submissions.length - 1 ? `1px solid ${BRAND_COLORS.lightGray}` : 'none',
                padding: SPACING.lg,
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: SPACING.md,
                }}>
                  {/* Document Info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, marginBottom: SPACING.sm }}>
                      <h3 style={{
                        fontSize: FONT_SIZES.lg,
                        fontWeight: 600,
                        color: BRAND_COLORS.textDark,
                        margin: 0,
                      }}>
                        {submission.template_name}
                      </h3>
                      {submission.template_required_fields.length > 0 && (
                        <span style={{
                          fontSize: FONT_SIZES.sm,
                          backgroundColor: '#F0F0F0',
                          padding: `${SPACING.xs} ${SPACING.sm}`,
                          borderRadius: BORDER_RADIUS.sm,
                          color: BRAND_COLORS.mediumGray,
                        }}>
                          {submission.template_required_fields.length} fields
                        </span>
                      )}
                    </div>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      color: BRAND_COLORS.mediumGray,
                      margin: 0,
                      marginBottom: SPACING.sm,
                    }}>
                      {submission.template_description}
                    </p>
                    <span style={{
                      fontSize: FONT_SIZES.xs,
                      backgroundColor: '#E8F5E9',
                      color: '#2E7D32',
                      padding: `${SPACING.xs} ${SPACING.sm}`,
                      borderRadius: BORDER_RADIUS.sm,
                    }}>
                      {submission.template_category.toUpperCase()}
                    </span>
                  </div>

                  {/* Status and Upload */}
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: SPACING.md,
                  }}>
                    {/* Status Badge */}
                    <div style={{
                      backgroundColor: getStatusColor(submission.status),
                      color: 'white',
                      padding: `${SPACING.sm} ${SPACING.md}`,
                      borderRadius: BORDER_RADIUS.md,
                      fontSize: FONT_SIZES.sm,
                      fontWeight: 600,
                    }}>
                      {getStatusLabel(submission.status)}
                    </div>

                    {/* Upload Button */}
                    {submission.status === 'not_submitted' || submission.status === 'needs_revision' ? (
                      <label style={{
                        cursor: 'pointer',
                        backgroundColor: BRAND_COLORS.primary,
                        color: 'white',
                        padding: `${SPACING.sm} ${SPACING.md}`,
                        borderRadius: BORDER_RADIUS.md,
                        fontSize: FONT_SIZES.sm,
                        border: 'none',
                        fontWeight: 600,
                      }}>
                        {uploading[submission.id] ? 'Uploading...' : 'Upload Document'}
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleFileUpload(submission.id, e.target.files[0]);
                            }
                          }}
                          style={{ display: 'none' }}
                        />
                      </label>
                    ) : submission.status === 'approved' ? (
                      <button style={{
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        padding: `${SPACING.sm} ${SPACING.md}`,
                        borderRadius: BORDER_RADIUS.md,
                        fontSize: FONT_SIZES.sm,
                        border: 'none',
                        cursor: 'default',
                      }}>
                        ✓ Approved
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Extracted Data */}
                {submission.extracted_data && Object.keys(submission.extracted_data).length > 0 && (
                  <div style={{
                    marginTop: SPACING.md,
                    padding: SPACING.md,
                    backgroundColor: '#F5F5F5',
                    borderRadius: BORDER_RADIUS.md,
                  }}>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      fontWeight: 600,
                      color: BRAND_COLORS.textDark,
                      marginBottom: SPACING.sm,
                    }}>
                      Extracted Information:
                    </p>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: SPACING.sm,
                    }}>
                      {Object.entries(submission.extracted_data).map(([key, value]) => (
                        <div key={key} style={{
                          padding: SPACING.sm,
                          backgroundColor: 'white',
                          borderRadius: BORDER_RADIUS.sm,
                          borderLeft: `3px solid ${BRAND_COLORS.primary}`,
                        }}>
                          <p style={{
                            fontSize: FONT_SIZES.xs,
                            color: BRAND_COLORS.mediumGray,
                            margin: '0 0 4px 0',
                            fontWeight: 600,
                            textTransform: 'uppercase',
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
                {submission.missing_fields && submission.missing_fields.length > 0 && (
                  <div style={{
                    marginTop: SPACING.md,
                    padding: SPACING.md,
                    backgroundColor: '#FFF3E0',
                    borderRadius: BORDER_RADIUS.md,
                    borderLeft: `4px solid #FF9800`,
                  }}>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      fontWeight: 600,
                      color: '#E65100',
                      marginBottom: SPACING.sm,
                    }}>
                      ⚠️ Missing Information:
                    </p>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: SPACING.sm,
                    }}>
                      {submission.missing_fields.map((field) => (
                        <li key={field} style={{
                          backgroundColor: '#FFCCBC',
                          color: '#D84315',
                          padding: `${SPACING.xs} ${SPACING.sm}`,
                          borderRadius: BORDER_RADIUS.sm,
                          fontSize: FONT_SIZES.xs,
                          fontWeight: 600,
                        }}>
                          {field}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Reviewer Notes */}
                {submission.reviewer_notes && (
                  <div style={{
                    marginTop: SPACING.md,
                    padding: SPACING.md,
                    backgroundColor: '#E3F2FD',
                    borderRadius: BORDER_RADIUS.md,
                    borderLeft: `4px solid ${BRAND_COLORS.primary}`,
                  }}>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      fontWeight: 600,
                      color: '#1565C0',
                      marginBottom: SPACING.sm,
                    }}>
                      Reviewer Notes:
                    </p>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      color: '#1565C0',
                      margin: 0,
                    }}>
                      {submission.reviewer_notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}

// Summary Card Component
function SummaryCard({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: BORDER_RADIUS.md,
      padding: SPACING.lg,
      border: `2px solid ${color}`,
      textAlign: 'center',
    }}>
      <p style={{
        fontSize: FONT_SIZES.sm,
        color: BRAND_COLORS.mediumGray,
        margin: '0 0 8px 0',
        fontWeight: 600,
      }}>
        {label}
      </p>
      <p style={{
        fontSize: FONT_SIZES['3xl'],
        fontWeight: 700,
        color: color,
        margin: 0,
      }}>
        {value}
      </p>
    </div>
  );
}
