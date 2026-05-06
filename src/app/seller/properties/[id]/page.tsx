'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useAuthReady } from '@/shared/hooks/useAuthReady';
import { useFetch } from '@/shared/hooks/useFetch';
import { buildApiUrl } from '@/lib/api-url';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  postal_code: string;
  price: number;
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  description?: string;
  document_submissions_count: number;
  completed_documents_count: number;
}

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

export default function PropertyDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isReady } = useAuthReady();
  const { fetchWithAuth } = useFetch();

  const propertyId = params?.id;

  const [property, setProperty] = useState<Property | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({});
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  useEffect(() => {
    const fetchPropertyData = async () => {
      if (!isReady || !propertyId) return;

      try {
        // Fetch property details
        const propRes = await fetchWithAuth(buildApiUrl(`/properties/${propertyId}/`), {
          method: 'GET',
        });

        if (propRes.ok) {
          const propData = await propRes.json();
          setProperty(propData);
          setSubmissions(propData.document_submissions || []);
        } else if (propRes.status === 404) {
          router.push('/seller/properties');
        }
      } catch (err) {
        console.error('Failed to fetch property:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isReady && propertyId) {
      fetchPropertyData();
    }
  }, [isReady, propertyId, fetchWithAuth, router]);

  const handleFileUpload = async (submissionId: number, file: File) => {
    setUploading((prev) => ({ ...prev, [submissionId]: true }));
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetchWithAuth(buildApiUrl(`/property-documents/${submissionId}/`), {
        method: 'PATCH',
        body: formData,
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
        return BRAND_COLORS.success;
      case 'rejected':
        return '#F44336';
      case 'pending_review':
        return BRAND_COLORS.warning;
      case 'needs_revision':
        return '#FF6F00';
      case 'not_submitted':
        return BRAND_COLORS.lightGray;
      default:
        return BRAND_COLORS.lightGray;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: { [key: string]: string } = {
      'approved': '✓ Approved',
      'rejected': '✗ Rejected',
      'pending_review': '⏳ Pending Review',
      'needs_revision': '! Needs Revision',
      'not_submitted': 'Not Submitted'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="seller">
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Loading property...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (!property) {
    return (
      <ProtectedRoute requiredRole="seller">
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Property not found</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="seller">
      <div style={{ minHeight: '100vh', backgroundColor: BRAND_COLORS.background }}>
        {/* Header */}
        <div style={{
          backgroundColor: BRAND_COLORS.primary,
          color: 'white',
          padding: SPACING.lg,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <button
              onClick={() => router.back()}
              style={{
                backgroundColor: 'rgba(255,255,255,0.3)',
                color: 'white',
                border: 'none',
                padding: `${SPACING.sm} ${SPACING.md}`,
                borderRadius: BORDER_RADIUS.sm,
                cursor: 'pointer',
                marginBottom: SPACING.md,
                fontSize: FONT_SIZES.md,
              }}
            >
              ← Back
            </button>
            <h1 style={{ margin: 0, fontSize: FONT_SIZES.xl }}>{property.title}</h1>
          </div>
          <LanguageSwitcher />
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: SPACING.lg }}>
          {/* Property Info */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.lg,
            padding: SPACING.lg,
            marginBottom: SPACING.lg,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.lg }}>
              <div>
                <p style={{ margin: 0, color: BRAND_COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>
                  ADDRESS
                </p>
                <p style={{ margin: `${SPACING.sm} 0 0 0`, fontSize: FONT_SIZES.md }}>
                  {property.address}, {property.city} {property.postal_code}
                </p>
              </div>
              <div>
                <p style={{ margin: 0, color: BRAND_COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>
                  PRICE
                </p>
                <p style={{ margin: `${SPACING.sm} 0 0 0`, fontSize: FONT_SIZES.md, fontWeight: 'bold' }}>
                  ${property.price?.toLocaleString() || 'N/A'}
                </p>
              </div>
            </div>

            {/* Property Specs */}
            <div style={{ display: 'flex', gap: SPACING.lg, marginTop: SPACING.lg, paddingTop: SPACING.lg, borderTop: `1px solid ${BRAND_COLORS.lightGray}` }}>
              {property.bedrooms && <div>
                <p style={{ margin: 0, color: BRAND_COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>BEDROOMS</p>
                <p style={{ margin: `${SPACING.sm} 0 0 0`, fontSize: FONT_SIZES.md, fontWeight: 'bold' }}>{property.bedrooms}</p>
              </div>}
              {property.bathrooms && <div>
                <p style={{ margin: 0, color: BRAND_COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>BATHROOMS</p>
                <p style={{ margin: `${SPACING.sm} 0 0 0`, fontSize: FONT_SIZES.md, fontWeight: 'bold' }}>{property.bathrooms}</p>
              </div>}
              {property.area_sqm && <div>
                <p style={{ margin: 0, color: BRAND_COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>AREA</p>
                <p style={{ margin: `${SPACING.sm} 0 0 0`, fontSize: FONT_SIZES.md, fontWeight: 'bold' }}>{property.area_sqm} sqm</p>
              </div>}
            </div>

            {property.description && (
              <div style={{ marginTop: SPACING.lg, paddingTop: SPACING.lg, borderTop: `1px solid ${BRAND_COLORS.lightGray}` }}>
                <p style={{ margin: 0, color: BRAND_COLORS.textSecondary, fontSize: FONT_SIZES.sm }}>DESCRIPTION</p>
                <p style={{ margin: `${SPACING.sm} 0 0 0`, fontSize: FONT_SIZES.md }}>{property.description}</p>
              </div>
            )}
          </div>

          {/* Documents Section */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.lg,
            padding: SPACING.lg,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h2 style={{ marginTop: 0, color: BRAND_COLORS.primary }}>Documents ({property.completed_documents_count}/{submissions.length})</h2>

            {submissions.length === 0 ? (
              <p style={{ color: BRAND_COLORS.textSecondary }}>No documents to upload for this property</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: SPACING.md }}>
                {submissions.map((submission) => (
                  <div
                    key={submission.id}
                    style={{
                      border: `1px solid ${BRAND_COLORS.lightGray}`,
                      borderRadius: BORDER_RADIUS.md,
                      padding: SPACING.md,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, color: BRAND_COLORS.primary }}>
                        {submission.template_name}
                      </h4>
                      <p style={{ margin: `${SPACING.sm} 0 0 0`, fontSize: FONT_SIZES.sm, color: BRAND_COLORS.textSecondary }}>
                        {submission.template_description}
                      </p>

                      {/* Status Badge */}
                      <div style={{ marginTop: SPACING.sm }}>
                        <span
                          style={{
                            backgroundColor: getStatusColor(submission.status),
                            color: submission.status === 'not_submitted' ? BRAND_COLORS.textSecondary : 'white',
                            padding: '4px 12px',
                            borderRadius: BORDER_RADIUS.sm,
                            fontSize: FONT_SIZES.sm,
                            display: 'inline-block',
                          }}
                        >
                          {getStatusLabel(submission.status)}
                        </span>
                      </div>

                      {/* Reviewer Notes */}
                      {submission.reviewer_notes && (
                        <div style={{ marginTop: SPACING.sm }}>
                          <p style={{ margin: 0, fontSize: FONT_SIZES.sm, color: BRAND_COLORS.textSecondary }}>
                            <strong>Notes:</strong> {submission.reviewer_notes}
                          </p>
                        </div>
                      )}

                      {/* Missing Fields */}
                      {submission.missing_fields && submission.missing_fields.length > 0 && (
                        <div style={{ marginTop: SPACING.sm }}>
                          <p style={{ margin: 0, fontSize: FONT_SIZES.sm, color: '#F44336' }}>
                            <strong>Missing:</strong> {submission.missing_fields.join(', ')}
                          </p>
                        </div>
                      )}

                      {/* Extracted Data Preview */}
                      {submission.extracted_data && Object.keys(submission.extracted_data).length > 0 && (
                        <div style={{ marginTop: SPACING.md }}>
                          <button
                            onClick={() => setSelectedSubmission(submission)}
                            style={{
                              backgroundColor: BRAND_COLORS.primary,
                              color: 'white',
                              border: 'none',
                              padding: `4px 12px`,
                              borderRadius: BORDER_RADIUS.sm,
                              fontSize: FONT_SIZES.sm,
                              cursor: 'pointer',
                            }}
                          >
                            View Extracted Data
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Upload Section */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: SPACING.md,
                      marginLeft: SPACING.lg,
                      minWidth: '150px',
                    }}>
                      <label
                        htmlFor={`file-${submission.id}`}
                        style={{
                          backgroundColor: BRAND_COLORS.primary,
                          color: 'white',
                          padding: `${SPACING.md} ${SPACING.lg}`,
                          borderRadius: BORDER_RADIUS.md,
                          cursor: uploading[submission.id] ? 'not-allowed' : 'pointer',
                          textAlign: 'center',
                          opacity: uploading[submission.id] ? 0.7 : 1,
                          fontSize: FONT_SIZES.md,
                        }}
                      >
                        {uploading[submission.id] ? 'Uploading...' : 'Choose File'}
                      </label>
                      <input
                        id={`file-${submission.id}`}
                        type="file"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleFileUpload(submission.id, e.target.files[0]);
                          }
                        }}
                        disabled={uploading[submission.id]}
                        style={{ display: 'none' }}
                      />
                      {submission.submitted_at && (
                        <p style={{ margin: 0, fontSize: FONT_SIZES.sm, color: BRAND_COLORS.textSecondary }}>
                          Uploaded: {new Date(submission.submitted_at).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Document Detail Modal */}
        {selectedSubmission && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.lg,
              padding: SPACING.xl,
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
                <h3 style={{ margin: 0 }}>{selectedSubmission.template_name}</h3>
                <button
                  onClick={() => setSelectedSubmission(null)}
                  style={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    fontSize: FONT_SIZES.xl,
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Extracted Data Form */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: SPACING.md }}>
                {selectedSubmission.extracted_data && Object.entries(selectedSubmission.extracted_data).map(([key, value]: [string, any]) => (
                  <div key={key}>
                    <label style={{ display: 'block', marginBottom: SPACING.sm, fontWeight: 'bold', color: BRAND_COLORS.textSecondary }}>
                      {key.replace(/_/g, ' ').toUpperCase()}
                    </label>
                    <input
                      type="text"
                      value={value}
                      readOnly
                      style={{
                        width: '100%',
                        padding: SPACING.md,
                        border: `1px solid ${BRAND_COLORS.lightGray}`,
                        borderRadius: BORDER_RADIUS.sm,
                        fontSize: FONT_SIZES.md,
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                ))}
              </div>

              {selectedSubmission.missing_fields && selectedSubmission.missing_fields.length > 0 && (
                <div style={{ marginTop: SPACING.lg, padding: SPACING.md, backgroundColor: '#FFEBEE', borderRadius: BORDER_RADIUS.md }}>
                  <p style={{ margin: 0, color: '#F44336', fontWeight: 'bold' }}>
                    Missing Fields:
                  </p>
                  <ul style={{ margin: `${SPACING.sm} 0 0 0`, paddingLeft: SPACING.lg, color: '#F44336' }}>
                    {selectedSubmission.missing_fields.map((field, idx) => (
                      <li key={idx}>{field}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
