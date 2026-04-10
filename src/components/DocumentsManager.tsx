'use client';

import React, { useState } from 'react';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useFetch } from '@/shared/hooks/useFetch';

export interface Document {
  id: string;
  document_key: string;
  file_name: string;
  status: 'pending' | 'uploaded' | 'verified' | 'expired' | 'rejected';
  expiry_date?: string;
  is_expired: boolean;
  uploaded_at?: string;
  reason?: string;
  extracted_fields?: Record<string, string | number | boolean>;
}

interface DocumentsManagerProps {
  userRole: string;
  documents?: Document[];
  onUpload?: (documentKey: string, file: File) => Promise<void>;
}

const statusColors: Record<string, { bg: string; text: string; border: string }> = {
  pending: { bg: '#FFF3E0', text: '#E65100', border: '#FFB74D' },
  uploaded: { bg: '#E3F2FD', text: '#1565C0', border: '#64B5F6' },
  verified: { bg: '#E8F5E9', text: '#2E7D32', border: '#81C784' },
  expired: { bg: '#FCE4EC', text: '#C2185B', border: '#F48FB1' },
  rejected: { bg: '#FFEBEE', text: '#B71C1C', border: '#EF5350' },
};

// Expected extraction fields per document type
const extractionFieldTemplates: Record<string, string[]> = {
  nif: ['Full Name', 'NIF Number', 'Date of Birth', 'Issue Date', 'Expiry Date'],
  passport: ['Full Name', 'Passport Number', 'Date of Birth', 'Nationality', 'Issue Date', 'Expiry Date'],
  certidao: ['Cartório Name', 'Registry Number', 'Property Address', 'Owner Name', 'Issue Date', 'Registration Number'],
  caderneta: ['Property Address', 'Cadastre Number', 'Owner Name', 'Area', 'Land Classification', 'Issue Date'],
  energy_cert: ['Building Address', 'Energy Rating', 'CO2 Emissions', 'Issue Date', 'Valid Until', 'Inspector Name'],
  certidao_propriedade: ['Property Address', 'Owner Name', 'Property Value', 'Registration Number', 'Issue Date', 'Status'],
  id: ['Full Name', 'ID Number', 'Date of Birth', 'Issue Date', 'Expiry Date', 'Nationality'],
  other: ['Field 1', 'Field 2', 'Field 3'],
};

export const DocumentsManager: React.FC<DocumentsManagerProps> = ({
  userRole,
  documents = [],
  onUpload,
}) => {
  const { t } = useLanguage();
  const { fetchWithAuth } = useFetch();
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [draggedOver, setDraggedOver] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [localDocuments, setLocalDocuments] = useState<Document[]>(documents);

  const isAgent = userRole === 'agent';

  // Update local documents when prop changes
  React.useEffect(() => {
    setLocalDocuments(documents);
  }, [documents]);

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

  const triggerExtraction = async (doc: Document) => {
    // Only trigger extraction if document is uploaded and doesn't have extracted fields yet
    if (doc.status !== 'uploaded' || doc.extracted_fields) {
      return;
    }

    setIsExtracting(true);
    try {
      const response = await fetchWithAuth(`http://127.0.0.1:8000/api/documents/${doc.id}/extract/`, {
        method: 'PUT',
      });

      if (response.ok) {
        const updatedDoc = await response.json();
        console.log('[DocumentsManager] Extraction completed:', updatedDoc);
        
        // Update local documents with extracted data
        const updatedDocsList = localDocuments.map(d => 
          d.id === doc.id ? { ...d, extracted_fields: updatedDoc.extracted_fields } : d
        );
        setLocalDocuments(updatedDocsList);
        setSelectedDoc({ ...doc, extracted_fields: updatedDoc.extracted_fields });
      } else {
        console.error('[DocumentsManager] Extraction failed:', response.status);
      }
    } catch (error) {
      console.error('[DocumentsManager] Extraction error:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const getExpiryInfo = (expiryDate?: string, isExpired?: boolean) => {
    if (!expiryDate) return null;
    
    const expiryTime = new Date(expiryDate).getTime();
    const nowTime = new Date().getTime();
    const daysLeft = Math.ceil((expiryTime - nowTime) / (1000 * 60 * 60 * 24));

    if (isExpired || daysLeft <= 0) {
      return { text: t('documentManager.expired'), color: '#D32F2F' };
    }
    if (daysLeft <= 7) {
      return { text: `${t('documentManager.expires')} ${daysLeft}d`, color: '#F57C00' };
    }
    return { text: `${t('documentManager.expires')} ${daysLeft}d`, color: '#388E3C' };
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
      caderneta: t('docName.caderneta'),
      certidao: t('docName.certidao'),
      energy_cert: t('docName.energy_cert'),
      certidao_propriedade: t('docType.certidao_propriedade'),
      nif: t('docType.nif'),
      passport: t('docType.passport'),
    };
    return names[key] || key;
  };

  const getExtractionFields = (documentKey: string): string[] => {
    // Extract base document type from the key
    // Examples: "nif_document.pdf" -> "nif", "passport_last_2_pages.pdf" -> "passport"
    const parts = documentKey.split('_');
    
    // Try each part as a potential key (longest matches first for compound types)
    for (let i = Math.min(3, parts.length); i >= 1; i--) {
      const testKey = parts.slice(0, i).join('_');
      if (extractionFieldTemplates[testKey]) {
        return extractionFieldTemplates[testKey];
      }
    }
    
    // Fallback to 'other' if no match
    return extractionFieldTemplates.other;
  };

  return (
    <div style={{ marginTop: SPACING.xl }}>
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
          📄 {documents.length > 0 ? t('documentManager.count').replace('{count}', documents.length.toString()) : t('documentManager.title')}
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

          return (
            <div
              key={doc.id}
              onClick={() => {
                setSelectedDoc(doc);
                setIsModalOpen(true);
                // Trigger extraction for uploaded documents without extracted fields
                if (doc.status === 'uploaded' && !doc.extracted_fields) {
                  triggerExtraction(doc);
                }
              }}
              style={{
                backgroundColor: 'white',
                borderRadius: BORDER_RADIUS.md,
                border: `2px solid ${colors.border}`,
                padding: SPACING.lg,
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.1)';
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
                      marginBottom: SPACING.xs,
                      wordBreak: 'break-word',
                    }}>
                      {doc.file_name || getDocumentName(doc.document_key)}
                    </h3>
                    <p style={{
                      fontSize: FONT_SIZES.xs,
                      color: BRAND_COLORS.mediumGray,
                      margin: 0,
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      {getDocumentName(doc.document_key)}
                    </p>
                  </div>
                </div>
                <div style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  padding: `${SPACING.xs} ${SPACING.md}`,
                  borderRadius: BORDER_RADIUS.full,
                  fontSize: FONT_SIZES.xs,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}>
                  {t(`documentManager.status.${doc.status}`)}
                </div>
              </div>

              {/* Expiry Info */}
              {expiryInfo && (
                <div style={{
                  fontSize: FONT_SIZES.sm,
                  color: expiryInfo.color,
                  marginBottom: SPACING.md,
                  fontWeight: 500,
                  padding: `${SPACING.sm} ${SPACING.md}`,
                  backgroundColor: colors.bg,
                  borderRadius: BORDER_RADIUS.sm,
                  borderLeft: `3px solid ${expiryInfo.color}`,
                }}>
                  ⏱️ {expiryInfo.text}
                </div>
              )}

              {/* Upload Date */}
              {doc.uploaded_at && (
                <p style={{
                  fontSize: FONT_SIZES.xs,
                  color: BRAND_COLORS.mediumGray,
                  margin: 0,
                  paddingTop: SPACING.md,
                  borderTop: `1px solid ${BRAND_COLORS.lightGray}`,
                }}>
                  📅 {new Date(doc.uploaded_at).toLocaleDateString()}
                </p>
              )}

              {/* Click Action Hint */}
              <div style={{
                marginTop: SPACING.md,
                padding: `${SPACING.sm} ${SPACING.md}`,
                backgroundColor: isPending ? '#FFF3E0' : '#E8F5E9',
                borderRadius: BORDER_RADIUS.sm,
                fontSize: FONT_SIZES.xs,
                fontWeight: 600,
                color: isPending ? '#E65100' : '#2E7D32',
                textAlign: 'center',
              }}>
                {isPending ? `📤 ${t('documentManager.upload')}` : `👁️ ${t('documentManager.view')}`}
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Modal for Upload/View */}
      {isModalOpen && selectedDoc && (
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
          padding: SPACING.lg,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.lg,
            padding: SPACING.xl,
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          }}>
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: SPACING.xl,
              gap: SPACING.md,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: SPACING.md, minWidth: 0, flex: 1 }}>
                <span style={{ fontSize: FONT_SIZES['3xl'], flexShrink: 0 }}>
                  {getDocumentIcon(selectedDoc.document_key)}
                </span>
                <div style={{ minWidth: 0 }}>
                  <h2 style={{
                    fontSize: FONT_SIZES.xl,
                    fontWeight: 700,
                    color: BRAND_COLORS.textDark,
                    margin: 0,
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}>
                    {getDocumentName(selectedDoc.document_key)}
                  </h2>
                  <p style={{
                    fontSize: FONT_SIZES.xs,
                    color: BRAND_COLORS.mediumGray,
                    margin: 0,
                    marginTop: SPACING.xs,
                    textTransform: 'uppercase',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}>
                    {selectedDoc.document_key}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: FONT_SIZES.xl,
                  cursor: 'pointer',
                  color: BRAND_COLORS.mediumGray,
                  padding: SPACING.sm,
                  flexShrink: 0,
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: BORDER_RADIUS.sm,
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#F0F0F0';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                ✕
              </button>
            </div>

            {/* Status Badge */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: SPACING.md,
              marginBottom: SPACING.lg,
            }}>
              <div style={{
                ...statusColors[selectedDoc.status],
                padding: `${SPACING.sm} ${SPACING.md}`,
                borderRadius: BORDER_RADIUS.full,
                fontSize: FONT_SIZES.sm,
                fontWeight: 600,
              }}>
                {t(`documentManager.status.${selectedDoc.status}`)}
              </div>
              {getExpiryInfo(selectedDoc.expiry_date, selectedDoc.is_expired) && (
                <span style={{
                  color: getExpiryInfo(selectedDoc.expiry_date, selectedDoc.is_expired)?.color,
                  fontSize: FONT_SIZES.sm,
                  fontWeight: 500,
                }}>
                  ⏱️ {getExpiryInfo(selectedDoc.expiry_date, selectedDoc.is_expired)?.text}
                </span>
              )}
            </div>

            {/* Content */}
            {selectedDoc.status === 'pending' ? (
              <>
                {/* Expected Fields Preview for Pending Documents */}
                <div style={{
                  marginBottom: SPACING.lg,
                  padding: SPACING.lg,
                  backgroundColor: '#E8F5E9',
                  borderRadius: BORDER_RADIUS.md,
                  border: `1px solid #81C784`,
                }}>
                  <h3 style={{
                    fontSize: FONT_SIZES.base,
                    fontWeight: 700,
                    color: '#2E7D32',
                    margin: `0 0 ${SPACING.md} 0`,
                    display: 'flex',
                    alignItems: 'center',
                    gap: SPACING.sm,
                  }}>
                    📋 Expected Fields
                  </h3>
                  <p style={{
                    fontSize: FONT_SIZES.xs,
                    color: '#558B2F',
                    margin: `0 0 ${SPACING.md} 0`,
                    fontStyle: 'italic',
                  }}>
                    These fields will be extracted once you upload the document:
                  </p>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: SPACING.md,
                  }}>
                    {getExtractionFields(selectedDoc.document_key).map((field, idx) => (
                      <div key={idx} style={{
                        padding: SPACING.md,
                        backgroundColor: 'white',
                        borderRadius: BORDER_RADIUS.sm,
                        border: `1px dashed #81C784`,
                        opacity: 0.7,
                      }}>
                        <p style={{
                          fontSize: FONT_SIZES.xs,
                          color: BRAND_COLORS.mediumGray,
                          margin: 0,
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}>
                          {field}
                        </p>
                        <p style={{
                          fontSize: FONT_SIZES.sm,
                          fontWeight: 400,
                          color: '#999',
                          margin: `${SPACING.xs} 0 0`,
                          fontStyle: 'italic',
                        }}>
                          (Will be extracted)
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <p style={{
                  fontSize: FONT_SIZES.base,
                  color: BRAND_COLORS.mediumGray,
                  marginBottom: SPACING.lg,
                  margin: 0,
                }}>
                  {t('documentManager.dragDrop')}
                </p>

                {/* Upload Area */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDraggedOver(selectedDoc.id);
                  }}
                  onDragLeave={() => setDraggedOver(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDraggedOver(null);
                    const files = e.dataTransfer.files;
                    if (files.length > 0) {
                      handleFileSelect(selectedDoc.document_key, files[0]);
                    }
                  }}
                  style={{
                    border: `2px dashed ${draggedOver === selectedDoc.id ? BRAND_COLORS.primary : '#DDD'}`,
                    borderRadius: BORDER_RADIUS.md,
                    padding: SPACING.xl,
                    textAlign: 'center',
                    backgroundColor: draggedOver === selectedDoc.id ? '#F0F7FF' : '#FAFAF8',
                    cursor: 'pointer',
                    marginBottom: SPACING.lg,
                    transition: 'all 0.2s',
                  }}
                >
                  <input
                    type="file"
                    id={`file-modal-${selectedDoc.id}`}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        handleFileSelect(selectedDoc.document_key, e.target.files[0]);
                      }
                    }}
                    accept=".pdf,.jpg,.jpeg,.png,.tiff"
                  />
                  <label
                    htmlFor={`file-modal-${selectedDoc.id}`}
                    style={{
                      cursor: 'pointer',
                      display: 'block',
                    }}
                  >
                    <p style={{
                      fontSize: FONT_SIZES.lg,
                      color: BRAND_COLORS.primary,
                      margin: 0,
                      fontWeight: 600,
                    }}>
                      {uploadingKey === selectedDoc.document_key ? '⏳ ' + t('documentManager.uploading') : '📁 ' + t('documentManager.dragDrop')}
                    </p>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      color: BRAND_COLORS.mediumGray,
                      margin: `${SPACING.md} 0 0`,
                    }}>
                      {t('documentManager.supportedFormats')}
                    </p>
                  </label>
                </div>
              </>
            ) : (
              <>
                <div style={{
                  backgroundColor: statusColors[selectedDoc.status].bg,
                  borderLeft: `4px solid ${statusColors[selectedDoc.status].border}`,
                  padding: SPACING.lg,
                  borderRadius: BORDER_RADIUS.md,
                  marginBottom: SPACING.lg,
                }}>
                  <p style={{
                    fontSize: FONT_SIZES.base,
                    color: statusColors[selectedDoc.status].text,
                    margin: 0,
                    fontWeight: 500,
                  }}>
                    {selectedDoc.status === 'verified' && '✅ Document is verified and ready to use'}
                    {selectedDoc.status === 'uploaded' && '📤 Document has been uploaded and is under review'}
                    {selectedDoc.status === 'expired' && '⚠️ This document has expired and needs renewal'}
                    {selectedDoc.status === 'rejected' && '❌ Document was rejected and needs to be re-uploaded'}
                  </p>
                </div>

                {selectedDoc.status === 'rejected' && selectedDoc.reason && (
                  <div style={{
                    backgroundColor: '#FFEBEE',
                    borderLeft: `4px solid #D32F2F`,
                    padding: SPACING.lg,
                    borderRadius: BORDER_RADIUS.md,
                    marginBottom: SPACING.lg,
                  }}>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      color: '#B71C1C',
                      margin: 0,
                      fontWeight: 600,
                      marginBottom: SPACING.xs,
                    }}>
                      {t('documentManager.rejectionReason')}
                    </p>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      color: '#C62828',
                      margin: 0,
                    }}>
                      {selectedDoc.reason}
                    </p>
                  </div>
                )}

                {/* Extracted Fields Section */}
                {selectedDoc.extracted_fields && Object.keys(selectedDoc.extracted_fields).length > 0 ? (
                  <div style={{
                    marginBottom: SPACING.lg,
                    padding: SPACING.lg,
                    backgroundColor: '#F0F8FF',
                    borderRadius: BORDER_RADIUS.md,
                    border: `1px solid #64B5F6`,
                  }}>
                    <h3 style={{
                      fontSize: FONT_SIZES.base,
                      fontWeight: 700,
                      color: BRAND_COLORS.primary,
                      margin: `0 0 ${SPACING.md} 0`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: SPACING.sm,
                    }}>
                      📋 Extracted Information
                    </h3>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: SPACING.md,
                    }}>
                      {Object.entries(selectedDoc.extracted_fields).map(([key, value]) => (
                        <div key={key} style={{
                          padding: SPACING.md,
                          backgroundColor: 'white',
                          borderRadius: BORDER_RADIUS.sm,
                          border: `1px solid #E0E0E0`,
                        }}>
                          <p style={{
                            fontSize: FONT_SIZES.xs,
                            color: BRAND_COLORS.mediumGray,
                            margin: 0,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px',
                          }}>
                            {key.replace(/_/g, ' ')}
                          </p>
                          <p style={{
                            fontSize: FONT_SIZES.sm,
                            fontWeight: 600,
                            color: BRAND_COLORS.textDark,
                            margin: `${SPACING.xs} 0 0`,
                            wordBreak: 'break-word',
                          }}>
                            {String(value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : isExtracting ? (
                  <div style={{
                    marginBottom: SPACING.lg,
                    padding: SPACING.lg,
                    backgroundColor: '#E3F2FD',
                    borderRadius: BORDER_RADIUS.md,
                    border: `1px solid #64B5F6`,
                  }}>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      color: '#1565C0',
                      margin: 0,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: SPACING.sm,
                    }}>
                      ⏳ Extracting document fields... Please wait.
                    </p>
                  </div>
                ) : (
                  <div style={{
                    marginBottom: SPACING.lg,
                    padding: SPACING.lg,
                    backgroundColor: '#FFF3E0',
                    borderRadius: BORDER_RADIUS.md,
                    border: `1px solid #FFB74D`,
                  }}>
                    <p style={{
                      fontSize: FONT_SIZES.sm,
                      color: '#E65100',
                      margin: 0,
                      fontWeight: 500,
                      display: 'flex',
                      alignItems: 'center',
                      gap: SPACING.sm,
                    }}>
                      ⏳ Extracting document fields... Please check back soon.
                    </p>
                  </div>
                )}

                {selectedDoc.uploaded_at && (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: SPACING.md,
                    marginBottom: SPACING.lg,
                  }}>
                    <div>
                      <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                        {t('documentManager.uploaded')}
                      </p>
                      <p style={{
                        fontSize: FONT_SIZES.base,
                        fontWeight: 600,
                        color: BRAND_COLORS.textDark,
                        margin: `${SPACING.xs} 0 0`,
                      }}>
                        {new Date(selectedDoc.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                    {selectedDoc.expiry_date && (
                      <div>
                        <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                          Expiry Date
                        </p>
                        <p style={{
                          fontSize: FONT_SIZES.base,
                          fontWeight: 600,
                          color: BRAND_COLORS.textDark,
                          margin: `${SPACING.xs} 0 0`,
                        }}>
                          {new Date(selectedDoc.expiry_date).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Close Button */}
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    width: '100%',
                    padding: SPACING.md,
                    backgroundColor: BRAND_COLORS.primary,
                    color: 'white',
                    border: 'none',
                    borderRadius: BORDER_RADIUS.md,
                    fontSize: FONT_SIZES.base,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLButtonElement).style.opacity = '0.9';
                    (e.target as HTMLButtonElement).style.transform = 'scale(0.98)';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLButtonElement).style.opacity = '1';
                    (e.target as HTMLButtonElement).style.transform = 'scale(1)';
                  }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentsManager;
