'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { buildApiUrl } from '@/lib/api-url';

export default function DocumentsPage() {
  const { t } = useLanguage();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(buildApiUrl('/documents'), {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setDocuments(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('Failed to fetch documents');
      } finally {
        setLoading(false);
      }
    };
    fetchDocuments();
  }, []);

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const documentType = formData.get('document_type') as string;
    
    // Check if this document type already exists
    const existingDoc = documents.find(doc => doc.document_type === documentType);
    if (existingDoc) {
      alert(`You already have a document of this type. Please delete it first before uploading a new one.`);
      return;
    }
    
    setUploading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(buildApiUrl('/documents/upload/'), {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      if (res.ok) {
        const newDoc = await res.json();
        setDocuments([...documents, newDoc]);
        form.reset();
      } else {
        const errorData = await res.json().catch(() => ({}));
        const errorMsg = errorData.detail || errorData.file || JSON.stringify(errorData) || `Error: ${res.status}`;
        alert(`Upload failed: ${errorMsg}`);
        console.error('Upload error:', errorData);
      }
    } catch (err) {
      alert(`Upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Upload exception:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(buildApiUrl(`/documents/${docId}/`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok || res.status === 204) {
        setDocuments(documents.filter((d: any) => d.id !== docId));
      } else {
        alert('Failed to delete document');
      }
    } catch (err) {
      alert('Failed to delete document');
      console.error('Delete error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
      <div style={{ display: 'flex' }}>
        <Sidebar active="documents" />
        
        <main style={{ marginLeft: '280px', padding: SPACING.xl, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
            <Link href="/dashboard" style={{ color: BRAND_COLORS.primary, textDecoration: 'none', display: 'inline-block' }}>
              {t('documents.backToDash')}
            </Link>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'right' }}>
              <LanguageSwitcher />
            </div>
          </div>
          
          <h2 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.textDark, margin: `${SPACING.lg} 0 ${SPACING.sm} 0` }}>
            {t('documents.title')}
          </h2>
          <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray, margin: 0 }}>
            {t('documents.subtitle')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.xl, marginTop: SPACING.xl }}>
            {/* Upload Section */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.lg} 0` }}>
                {t('documents.uploadNew')}
              </h3>

              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                <div>
                  <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                    {t('documents.docType')}
                  </label>
                  <select
                    name="document_type"
                    required
                    style={{
                      width: '100%',
                      padding: `${SPACING.md} ${SPACING.md}`,
                      borderRadius: BORDER_RADIUS.sm,
                      border: `1px solid ${BRAND_COLORS.lightGray}`,
                      fontSize: FONT_SIZES.base,
                      boxSizing: 'border-box',
                    }}
                  >
                    <option value="">{t('documents.selectType')}</option>
                    <option value="id" disabled={documents.some(d => d.document_type === 'id')}>{t('documents.titleDeed')} {documents.some(d => d.document_type === 'id') ? '(Already uploaded)' : ''}</option>
                    <option value="license" disabled={documents.some(d => d.document_type === 'license')}>{t('documents.propertyTax')} {documents.some(d => d.document_type === 'license') ? '(Already uploaded)' : ''}</option>
                    <option value="proof_of_address" disabled={documents.some(d => d.document_type === 'proof_of_address')}>{t('documents.mortgageDeed')} {documents.some(d => d.document_type === 'proof_of_address') ? '(Already uploaded)' : ''}</option>
                    <option value="other" disabled={documents.some(d => d.document_type === 'other')}>{t('documents.other')} {documents.some(d => d.document_type === 'other') ? '(Already uploaded)' : ''}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                    {t('documents.file')}
                  </label>
                  <input
                    type="file"
                    name="file"
                    required
                    style={{
                      width: '100%',
                      padding: `${SPACING.md} ${SPACING.md}`,
                      borderRadius: BORDER_RADIUS.sm,
                      border: `1px solid ${BRAND_COLORS.lightGray}`,
                      fontSize: FONT_SIZES.base,
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={uploading}
                  style={{
                    padding: `${SPACING.md} ${SPACING.lg}`,
                    borderRadius: BORDER_RADIUS.lg,
                    backgroundColor: BRAND_COLORS.primary,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: FONT_SIZES.base,
                    border: 'none',
                    cursor: uploading ? 'not-allowed' : 'pointer',
                    opacity: uploading ? 0.6 : 1,
                  }}
                >
                  {uploading ? t('documents.uploading') : t('documents.uploadDoc')}
                </button>
              </form>
            </div>

            {/* Documents List */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.lg} 0` }}>
                {t('documents.myDocs')} ({documents.length})
              </h3>

              {loading ? (
                <p style={{ color: BRAND_COLORS.mediumGray }}>{t('documents.loading')}</p>
              ) : documents.length === 0 ? (
                <p style={{ color: BRAND_COLORS.mediumGray }}>{t('documents.noDocs')}</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                  {documents.map((doc: any, i: number) => {
                    // Get filename from file path
                    const filename = typeof doc.file === 'string' ? doc.file.split('/').pop() : 'Document';
                    // Map document_type to display label
                    const docTypeLabel: { [key: string]: string } = {
                      id: 'ID Document',
                      license: 'License',
                      proof_of_address: 'Proof of Address',
                      other: 'Other'
                    };
                    const displayType = docTypeLabel[doc.document_type] || doc.document_type || 'Document';
                    return (
                      <div
                        key={i}
                        style={{
                          padding: SPACING.md,
                          backgroundColor: BRAND_COLORS.background,
                          borderRadius: BORDER_RADIUS.sm,
                          borderLeft: `3px solid ${BRAND_COLORS.primary}`,
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: SPACING.md }}>
                          <div style={{ flex: 1 }}>
                            <p style={{ fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, margin: 0 }}>
                              {filename}
                            </p>
                            <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: `${SPACING.xs} 0 0 0` }}>
                              {displayType} • {t('documents.uploaded')} {new Date(doc.uploaded_at || Date.now()).toLocaleDateString()}
                            </p>
                          </div>
                          <div style={{ display: 'flex', gap: SPACING.sm, alignItems: 'center' }}>
                            <span style={{
                              padding: `${SPACING.xs} ${SPACING.sm}`,
                              backgroundColor: doc.status === 'approved' ? '#E8F5E9' : doc.status === 'rejected' ? '#FFEBEE' : '#FFF3E0',
                              color: doc.status === 'approved' ? BRAND_COLORS.success : doc.status === 'rejected' ? '#C62828' : BRAND_COLORS.warning,
                              borderRadius: BORDER_RADIUS.sm,
                              fontSize: FONT_SIZES.xs,
                              fontWeight: 600,
                              textTransform: 'capitalize',
                              whiteSpace: 'nowrap',
                            }}>
                              {doc.status || 'pending'}
                            </span>
                            <button
                              onClick={() => handleDelete(doc.id)}
                              style={{
                                padding: `${SPACING.xs} ${SPACING.sm}`,
                                backgroundColor: '#FFEBEE',
                                color: '#C62828',
                                border: 'none',
                                borderRadius: BORDER_RADIUS.sm,
                                fontSize: FONT_SIZES.xs,
                                fontWeight: 600,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#FFCDD2';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#FFEBEE';
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

const Sidebar: React.FC<{ active: string }> = ({ active }) => (
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
    <h1 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, margin: 0 }}>Fizbo</h1>
    <p style={{ fontSize: FONT_SIZES.sm, opacity: 0.9, margin: `${SPACING.xs} 0 ${SPACING.xl} 0` }}>
      Seller Platform
    </p>

    <nav style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
      {[
        { href: '/dashboard', label: 'Dashboard', icon: 'D' },
        { href: '/doccheck', label: 'DocCheck', icon: 'C' },
        { href: '/documents', label: 'Documents', icon: 'F' },
        { href: '/orders', label: 'Orders', icon: 'O' },
        { href: '/cma', label: 'CMA Report', icon: 'R' },
      ].map(({ href, label, icon }) => (
        <Link
          key={href}
          href={href}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: SPACING.md,
            padding: SPACING.md,
            borderRadius: BORDER_RADIUS.md,
            textDecoration: 'none',
            color: 'white',
            backgroundColor: active === label.toLowerCase() ? 'rgba(255,255,255,0.15)' : 'transparent',
            fontWeight: active === label.toLowerCase() ? 600 : 500,
            transition: 'all 0.2s ease',
          }}
        >
          <span style={{ width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
            {icon}
          </span>
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  </aside>
);
