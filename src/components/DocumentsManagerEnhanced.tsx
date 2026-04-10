'use client';

import React, { useState } from 'react';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';

export interface ExtractedFields {
  name?: string;
  nif?: string;
  date_issued?: string;
  date_expiry?: string;
  issuer?: string;
  reference_number?: string;
  property_reference?: string;
  condominium?: string;
  unit_number?: string;
}

export interface FieldCompleteness {
  total_expected_fields?: number;
  fields_found?: number;
  missing_fields?: string[];
  percentage_complete?: number;
}

export interface ExtractionResult {
  extracted_fields: ExtractedFields;
  field_completeness?: FieldCompleteness;
  detected_document_type?: string;
  document_type_confidence?: number;
  document_type_match?: boolean;
  document_type_mismatch_reason?: string;
  clarity_flag: 'CLEAR' | 'PARTIAL' | 'UNCLEAR' | 'NOT_ASSESSED';
  validity_flag: 'VALID' | 'EXPIRED' | 'INVALID' | 'NOT_ASSESSED';
  confidence_score: number;
  extraction_notes: string;
  operator_notes: string;
  needs_manual_review: boolean;
  all_fields_present: boolean;
  extraction_status: 'pending' | 'processing' | 'success' | 'failed';
  agent_review_required?: boolean;
  agent_review_reason?: string;
  extraction_error?: string;
}

export interface Document extends ExtractionResult {
  id: string;
  document_key: string;
  file_name: string;
  status: 'pending' | 'processing' | 'uploaded' | 'extracted' | 'verified' | 'expired' | 'rejected';
  user_submitted_document_type?: string;
  detected_document_type?: string;
  document_type_confidence?: number;
  document_type_match?: boolean;
  fields_complete_percentage?: number;
  missing_fields?: string[];
  expiry_date?: string;
  is_expired: boolean;
  uploaded_at?: string;
  extracted_at?: string;
  reason?: string;
}

interface DocumentsManagerProps {
  userRole: string;
  documents?: Document[];
  onUpload?: (documentKey: string, file: File) => Promise<void>;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' },
  processing: { bg: '#F3E5F5', text: '#6A1B9A', border: '#BA68C8' },
  uploaded: { bg: '#E3F2FD', text: '#1565C0', border: '#64B5F6' },
  extracted: { bg: '#E0F2F1', text: '#00695C', border: '#4DB6AC' },
  verified: { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' },
  expired: { bg: '#FCE4EC', text: '#C2185B', border: '#F48FB1' },
  rejected: { bg: '#FFEBEE', text: '#B71C1C', border: '#EF5350' },
};

const clarityColors: Record<string, { bg: string; text: string }> = {
  CLEAR: { bg: '#E8F5E9', text: '#2E7D32' },
  PARTIAL: { bg: '#FFF9C4', text: '#F57F17' },
  UNCLEAR: { bg: '#FFEBEE', text: '#C2185B' },
  NOT_ASSESSED: { bg: '#F5F5F5', text: '#616161' },
};

const validityColors: Record<string, { bg: string; text: string }> = {
  VALID: { bg: '#E8F5E9', text: '#2E7D32' },
  EXPIRED: { bg: '#FCE4EC', text: '#C2185B' },
  INVALID: { bg: '#FFEBEE', text: '#B71C1C' },
  NOT_ASSESSED: { bg: '#F5F5F5', text: '#616161' },
};

export const DocumentsManager: React.FC<DocumentsManagerProps> = ({
  userRole,
  documents = [],
  onUpload,
}) => {
  const { t } = useLanguage();
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [, setSelectedDoc] = useState<Document | null>(null);
  const [_isModalOpen, setIsModalOpen] = useState(false);

  const isAgent = userRole === 'agent';

  const handleFileSelect = async (documentKey: string, file: File) => {
    console.log('[DocumentsManager] File selected:', documentKey, file.name, file.size);
    if (!onUpload) {
      console.error('[DocumentsManager] onUpload callback not provided');
      return;
    }

    setUploadingKey(documentKey);
    try {
      console.log('[DocumentsManager] Starting upload...');
      await onUpload(documentKey, file);
      console.log('[DocumentsManager] Upload completed');
      setIsModalOpen(false);
    } catch (error) {
      console.error('[DocumentsManager] Upload failed:', error);
    } finally {
      setUploadingKey(null);
    }
  };

  const getDocumentIcon = (key: string): string => {
    const icons: Record<string, string> = {
      caderneta_predial: '🏠',
      certidao_permanente: '📋',
      certificado_energetico: '⚡',
      nif: '🆔',
      passport: '📕',
    };
    return icons[key] || '📄';
  };

  const getDocumentName = (key: string): string => {
    const names: Record<string, string> = {
      caderneta_predial: t('docName.caderneta'),
      certidao_permanente: t('docName.certidao'),
      certificado_energetico: t('docName.energy_cert'),
      nif: t('docType.nif'),
      passport: t('docType.passport'),
    };
    return names[key] || key;
  };

  const getExpiryInfo = (
    expiryDate: string | undefined,
    isExpired: boolean,
  ): { text: string; color: string } => {
    if (!expiryDate) return { text: '', color: '' };

    if (isExpired) {
      return { text: t('documentManager.expired'), color: '#C2185B' };
    }

    const expiryMs = new Date(expiryDate).getTime();
    const nowMs = Date.now();
    const daysLeft = Math.ceil((expiryMs - nowMs) / (1000 * 60 * 60 * 24));

    if (daysLeft < 0) {
      return { text: t('documentManager.expired'), color: '#C2185B' };
    }
    if (daysLeft <= 30) {
      return { text: `⚠️ ${daysLeft} days`, color: '#F57F17' };
    }
    if (daysLeft <= 90) {
      return { text: `${daysLeft} days`, color: '#E65100' };
    }

    return { text: `✓ ${daysLeft} days`, color: '#2E7D32' };
  };

  const ExtractionDetails: React.FC<{ doc: Document }> = ({ doc }) => {
    if (doc.extraction_status === 'pending') {
      return (
        <div style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray }}>
          {t('documentManager.waitingForExtraction')}
        </div>
      );
    }

    if (doc.extraction_status === 'processing') {
      return (
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.xs }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: `2px solid ${BRAND_COLORS.primary}`,
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <span style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.primary }}>
            {t('documentManager.extracting')}
          </span>
        </div>
      );
    }

    if (doc.extraction_status === 'failed') {
      return (
        <div style={{ fontSize: FONT_SIZES.xs, color: '#C2185B' }}>
          ❌ {t('documentManager.extractionFailed')}
          {doc.extraction_error && (
            <div style={{ fontSize: FONT_SIZES.xs, marginTop: SPACING.xs }}>
              {doc.extraction_error}
            </div>
          )}
        </div>
      );
    }

    if (doc.extraction_status === 'success') {
      const clarityColor = clarityColors[doc.clarity_flag] || clarityColors.NOT_ASSESSED;
      const validityColor = validityColors[doc.validity_flag] || validityColors.NOT_ASSESSED;

      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
          {/* Document Type Detection */}
          {doc.detected_document_type && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: SPACING.xs,
              padding: `${SPACING.xs} ${SPACING.sm}`,
              backgroundColor: '#F5F5F5',
              borderRadius: BORDER_RADIUS.sm,
              borderLeft: `3px solid ${doc.document_type_match ? '#4CAF50' : '#FF9800'}`,
            }}>
              <div style={{ fontSize: FONT_SIZES.xs }}>
                <span style={{ fontWeight: 600, color: BRAND_COLORS.textDark }}>
                  Document Type: 
                </span>
                <span style={{ color: BRAND_COLORS.mediumGray, marginLeft: SPACING.xs }}>{doc.detected_document_type}</span>
                {doc.document_type_confidence && (
                  <span style={{ color: BRAND_COLORS.lightGray, marginLeft: SPACING.xs }}>
                    ({doc.document_type_confidence}%)
                  </span>
                )}
              </div>
              {doc.user_submitted_document_type && (
                <div style={{ fontSize: FONT_SIZES.xs }}>
                  <span style={{ fontWeight: 600, color: BRAND_COLORS.textDark }}>
                    User Selected: 
                  </span>
                  <span style={{ color: BRAND_COLORS.mediumGray, marginLeft: SPACING.xs }}>{doc.user_submitted_document_type}</span>
                </div>
              )}
              {!doc.document_type_match && doc.document_type_mismatch_reason && (
                <div style={{ 
                  fontSize: FONT_SIZES.xs, 
                  color: '#FF6F00',
                  fontWeight: 500,
                }}>
                  ⚠️ {doc.document_type_mismatch_reason}
                </div>
              )}
            </div>
          )}

          {/* Field Completeness Progress */}
          {doc.field_completeness && doc.fields_complete_percentage !== undefined && (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: SPACING.xs,
              padding: `${SPACING.xs} ${SPACING.sm}`,
              backgroundColor: '#F5F5F5',
              borderRadius: BORDER_RADIUS.sm,
            }}>
              <div style={{ fontSize: FONT_SIZES.xs }}>
                <span style={{ fontWeight: 600, color: BRAND_COLORS.textDark }}>
                  Fields Extracted: 
                </span>
                <span style={{ color: BRAND_COLORS.mediumGray, marginLeft: SPACING.xs }}>
                  {doc.field_completeness.fields_found || 0}/{doc.field_completeness.total_expected_fields || 9} 
                  ({doc.fields_complete_percentage || 0}%)
                </span>
              </div>
              {/* Progress bar */}
              <div style={{
                width: '100%',
                height: '4px',
                backgroundColor: '#E0E0E0',
                borderRadius: BORDER_RADIUS.full,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${doc.fields_complete_percentage || 0}%`,
                  height: '100%',
                  backgroundColor: doc.fields_complete_percentage >= 80 ? '#4CAF50' : doc.fields_complete_percentage >= 50 ? '#FF9800' : '#F44336',
                  transition: 'width 0.3s ease',
                }}/>
              </div>
              {doc.missing_fields && doc.missing_fields.length > 0 && (
                <div style={{ fontSize: FONT_SIZES.xs, color: '#E57373' }}>
                  <span style={{ fontWeight: 500 }}>Missing: </span>
                  {doc.missing_fields.join(', ')}
                </div>
              )}
            </div>
          )}

          {/* Extracted Fields Preview */}
          {doc.extracted_fields.name && (
            <div style={{ fontSize: FONT_SIZES.xs }}>
              <span style={{ fontWeight: 600, color: BRAND_COLORS.textDark }}>Name: </span>
              <span style={{ color: BRAND_COLORS.mediumGray }}>{doc.extracted_fields.name}</span>
            </div>
          )}

          {doc.extracted_fields.issuer && (
            <div style={{ fontSize: FONT_SIZES.xs }}>
              <span style={{ fontWeight: 600, color: BRAND_COLORS.textDark }}>Issuer: </span>
              <span style={{ color: BRAND_COLORS.mediumGray }}>{doc.extracted_fields.issuer}</span>
            </div>
          )}

          {/* AI Assessment Badges */}
          <div style={{ display: 'flex', gap: SPACING.xs, flexWrap: 'wrap' }}>
            <div style={{
              backgroundColor: clarityColor.bg,
              color: clarityColor.text,
              padding: `${SPACING.xs} ${SPACING.sm}`,
              borderRadius: BORDER_RADIUS.full,
              fontSize: FONT_SIZES.xs,
              fontWeight: 600,
            }}>
              {t(`documentManager.clarity.${doc.clarity_flag.toLowerCase()}`)} {doc.confidence_score}%
            </div>

            <div style={{
              backgroundColor: validityColor.bg,
              color: validityColor.text,
              padding: `${SPACING.xs} ${SPACING.sm}`,
              borderRadius: BORDER_RADIUS.full,
              fontSize: FONT_SIZES.xs,
              fontWeight: 600,
            }}>
              {t(`documentManager.validity.${doc.validity_flag.toLowerCase()}`)}
            </div>
          </div>

          {/* Agent Review Flag */}
          {doc.agent_review_required && (
            <div style={{
              backgroundColor: '#FFEBEE',
              color: '#B71C1C',
              padding: `${SPACING.xs} ${SPACING.sm}`,
              borderRadius: BORDER_RADIUS.sm,
              fontSize: FONT_SIZES.xs,
              fontWeight: 600,
              borderLeft: '3px solid #B71C1C',
            }}>
              🚨 Agent Review Required
              {doc.agent_review_reason && (
                <div style={{ marginTop: SPACING.xs, fontWeight: 400, fontSize: FONT_SIZES.xs }}>
                  {doc.agent_review_reason}
                </div>
              )}
            </div>
          )}

          {/* Confidence & Review Status */}
          {doc.needs_manual_review && (
            <div style={{
              backgroundColor: '#FFF3E0',
              color: '#E65100',
              padding: `${SPACING.xs} ${SPACING.sm}`,
              borderRadius: BORDER_RADIUS.sm,
              fontSize: FONT_SIZES.xs,
              fontWeight: 600,
            }}>
              ⚠️ {t('documentManager.needsReview')}
            </div>
          )}

          {/* Operator Notes */}
          {doc.operator_notes && (
            <div style={{
              backgroundColor: '#F5F5F5',
              padding: SPACING.sm,
              borderRadius: BORDER_RADIUS.sm,
              fontSize: FONT_SIZES.xs,
              color: BRAND_COLORS.mediumGray,
              borderLeft: `3px solid ${BRAND_COLORS.primary}`,
            }}>
              <strong>Notes:</strong> {doc.operator_notes}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div style={{ marginTop: SPACING.xl }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
      }}>
        <h2 style={{
          fontSize: FONT_SIZES['2xl'],
          fontWeight: 700,
          color: BRAND_COLORS.primary,
          margin: 0,
        }}>
          📄 {documents.length > 0 
            ? t('documentManager.count').replace('{count}', documents.length.toString()) 
            : t('documentManager.title')}
        </h2>
        {isAgent && (
          <div style={{
            backgroundColor: '#FFF3E0',
            color: '#E65100',
            padding: `${SPACING.sm} ${SPACING.md}`,
            borderRadius: BORDER_RADIUS.full,
            fontSize: FONT_SIZES.xs,
            fontWeight: 600,
          }}>
            {t('documentManager.agentMode')}
          </div>
        )}
      </div>

      {documents.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: SPACING.xl,
          backgroundColor: '#FAFAF8',
          borderRadius: BORDER_RADIUS.md,
          border: `1px dashed ${BRAND_COLORS.lightGray}`,
        }}>
          <p style={{ color: BRAND_COLORS.mediumGray, fontSize: FONT_SIZES.base }}>
            {t('documentManager.noDocs')}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: SPACING.lg,
        }}>
          {documents.map((doc) => {
            const colors = statusColors[doc.status];
            const expiryInfo = getExpiryInfo(doc.expiry_date, doc.is_expired);
            const isPending = doc.status === 'pending';
            const isProcessing = doc.extraction_status === 'processing';

            return (
              <div
                key={doc.id}
                onClick={() => {
                  setSelectedDoc(doc);
                  setIsModalOpen(true);
                }}
                style={{
                  backgroundColor: 'white',
                  borderRadius: BORDER_RADIUS.md,
                  border: `2px solid ${colors.border}`,
                  padding: SPACING.lg,
                  boxShadow: isProcessing ? '0 4px 12px rgba(106, 27, 154, 0.3)' : '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  opacity: isProcessing ? 0.8 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!isProcessing) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = isProcessing ? '0 4px 12px rgba(106, 27, 154, 0.3)' : '0 2px 6px rgba(0,0,0,0.1)';
                }}
              >
                {/* Header with Icon */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  marginBottom: SPACING.md,
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING.sm }}>
                    <span style={{ fontSize: FONT_SIZES['2xl'] }}>
                      {getDocumentIcon(doc.document_key)}
                    </span>
                    <div>
                      <h3 style={{
                        fontSize: FONT_SIZES.base,
                        fontWeight: 600,
                        color: BRAND_COLORS.textDark,
                        margin: 0,
                      }}>
                        {getDocumentName(doc.document_key)}
                      </h3>
                      <p style={{
                        fontSize: FONT_SIZES.xs,
                        color: BRAND_COLORS.mediumGray,
                        margin: `${SPACING.xs} 0 0 0`,
                      }}>
                        {doc.file_name || t('documentManager.noFile')}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    padding: `${SPACING.xs} ${SPACING.sm}`,
                    borderRadius: BORDER_RADIUS.full,
                    fontSize: FONT_SIZES.xs,
                    fontWeight: 600,
                    whiteSpace: 'nowrap',
                  }}>
                    {t(`documentManager.status.${doc.status}`)}
                  </div>
                </div>

                {/* Expiry info */}
                {expiryInfo.text && (
                  <div style={{
                    fontSize: FONT_SIZES.xs,
                    color: expiryInfo.color,
                    fontWeight: 600,
                    marginBottom: SPACING.md,
                  }}>
                    {expiryInfo.text}
                  </div>
                )}

                {/* Extraction Status and Details */}
                <ExtractionDetails doc={doc} />

                {/* Upload Section (if pending) */}
                {isPending && (
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDraggedOver(doc.document_key);
                    }}
                    onDragLeave={() => setDraggedOver(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDraggedOver(null);
                      const files = e.dataTransfer.files;
                      if (files.length > 0) {
                        handleFileSelect(doc.document_key, files[0]);
                      }
                    }}
                    style={{
                      marginTop: SPACING.md,
                      padding: SPACING.md,
                      backgroundColor: draggedOver === doc.document_key ? '#E8F5E9' : '#F9F9F7',
                      border: `2px dashed ${draggedOver === doc.document_key ? '#2E7D32' : '#DDD'}`,
                      borderRadius: BORDER_RADIUS.sm,
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <label style={{
                      cursor: uploadingKey === doc.document_key ? 'not-allowed' : 'pointer',
                      opacity: uploadingKey === doc.document_key ? 0.6 : 1,
                    }}>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png,.tiff"
                        onChange={(e) => {
                          const files = e.currentTarget.files;
                          if (files && files.length > 0) {
                            handleFileSelect(doc.document_key, files[0]);
                          }
                        }}
                        disabled={uploadingKey === doc.document_key}
                        style={{ display: 'none' }}
                      />
                      <span style={{
                        fontSize: FONT_SIZES.sm,
                        fontWeight: 600,
                        color: uploadingKey === doc.document_key ? BRAND_COLORS.mediumGray : BRAND_COLORS.primary,
                      }}>
                        {uploadingKey === doc.document_key
                          ? `⏳ ${t('documentManager.uploading')}`
                          : `📥 ${t('documentManager.dragOrClick')}`}
                      </span>
                    </label>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
