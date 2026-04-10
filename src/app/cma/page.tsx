'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function CMAPage() {
  const { t } = useLanguage();
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [location, setLocation] = useState('');
  const [size, setSize] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('http://localhost:8000/api/cma/generate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          property_type: propertyType,
          bedrooms: parseInt(bedrooms),
          location,
          size: parseInt(size),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReport(data);
      } else {
        alert('Error generating CMA report');
      }
    } catch (err) {
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
      <div style={{ display: 'flex' }}>
        <Sidebar active="cma report" />
        
        <main style={{ marginLeft: '280px', padding: SPACING.xl, width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.lg }}>
            <Link href="/dashboard" style={{ color: BRAND_COLORS.primary, textDecoration: 'none', display: 'inline-block' }}>
              {t('cma.backToDash')}
            </Link>
            <div style={{ transform: 'scale(0.8)', transformOrigin: 'right' }}>
              <LanguageSwitcher />
            </div>
          </div>
          
          <h2 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.textDark, margin: `${SPACING.lg} 0 ${SPACING.sm} 0` }}>
            {t('cma.title')}
          </h2>
          <p style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.mediumGray, margin: 0 }}>
            {t('cma.subtitle')}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.xl, marginTop: SPACING.xl }}>
            {/* Form */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.lg} 0` }}>
                {t('cma.propertyDetails')}
              </h3>

              <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                <div>
                  <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                    {t('cma.propertyType')}
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
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
                    <option value="">{t('cma.selectType')}</option>
                    <option value="apartment">{t('cma.apartment')}</option>
                    <option value="house">{t('cma.house')}</option>
                    <option value="townhouse">{t('cma.townhouse')}</option>
                    <option value="commercial">{t('cma.commercial')}</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                    {t('cma.bedrooms')}
                  </label>
                  <input
                    type="number"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="e.g., 3"
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

                <div>
                  <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                    {t('cma.location')}
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Downtown"
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

                <div>
                  <label style={{ display: 'block', fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, marginBottom: SPACING.sm }}>
                    {t('cma.size')}
                  </label>
                  <input
                    type="number"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="e.g., 150"
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
                  disabled={loading}
                  style={{
                    padding: `${SPACING.md} ${SPACING.lg}`,
                    borderRadius: BORDER_RADIUS.lg,
                    backgroundColor: BRAND_COLORS.primary,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: FONT_SIZES.base,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                    marginTop: SPACING.md,
                  }}
                >
                  {loading ? t('cma.generating') : t('cma.generate')}
                </button>
              </form>
            </div>

            {/* Report */}
            <div>
              {report ? (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: BORDER_RADIUS.md,
                  padding: SPACING.lg,
                  border: `1px solid ${BRAND_COLORS.lightGray}`,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}>
                  <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.primary, margin: `0 0 ${SPACING.lg} 0` }}>
                    {t('cma.report')}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: SPACING.md,
                    backgroundColor: BRAND_COLORS.background,
                    padding: SPACING.lg,
                    borderRadius: BORDER_RADIUS.md,
                    marginBottom: SPACING.lg,
                  }}>
                    <div>
                      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: 0 }}>{t('cma.estimatedValue')}</p>
                      <h4 style={{ fontSize: FONT_SIZES['2xl'], fontWeight: 700, color: BRAND_COLORS.primary, margin: `${SPACING.sm} 0 0 0` }}>
                        €{report.estimated_value || '0'}
                      </h4>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.md }}>
                      <div>
                        <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>{t('cma.marketRange')}</p>
                        <p style={{ fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, margin: `${SPACING.xs} 0 0 0` }}>
                          €{report.price_range_low || '0'} - €{report.price_range_high || '0'}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>{t('cma.pricePerSqm')}</p>
                        <p style={{ fontSize: FONT_SIZES.sm, fontWeight: 600, color: BRAND_COLORS.textDark, margin: `${SPACING.xs} 0 0 0` }}>
                          €{report.price_per_sqm || '0'}/m²
                        </p>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: SPACING.lg }}>
                    <h4 style={{ fontSize: FONT_SIZES.base, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `0 0 ${SPACING.md} 0` }}>
                      {t('cma.marketInsights')}
                    </h4>
                    <ul style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: SPACING.sm,
                    }}>
                      {Array.isArray(report.insights) ? (
                        report.insights.map((insight: string, i: number) => (
                          <li key={i} style={{
                            padding: `${SPACING.sm} ${SPACING.md}`,
                            backgroundColor: '#E3F2FD',
                            borderLeft: `3px solid ${BRAND_COLORS.primary}`,
                            borderRadius: BORDER_RADIUS.sm,
                            fontSize: FONT_SIZES.sm,
                            color: BRAND_COLORS.textDark,
                          }}>
                            {insight}
                          </li>
                        ))
                      ) : (
                        <li style={{ color: BRAND_COLORS.mediumGray }}>Market analysis data unavailable</li>
                      )}
                    </ul>
                  </div>

                  <button
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = `http://localhost:8000/api/cma/${report.id}/export`;
                      link.download = `CMA_Report_${report.id}.pdf`;
                      link.click();
                    }}
                    style={{
                      width: '100%',
                      padding: `${SPACING.md} ${SPACING.lg}`,
                      borderRadius: BORDER_RADIUS.lg,
                      backgroundColor: BRAND_COLORS.gold,
                      color: BRAND_COLORS.textDark,
                      fontWeight: 700,
                      fontSize: FONT_SIZES.base,
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    Download Report (PDF)
                  </button>
                </div>
              ) : (
                <div style={{
                  backgroundColor: 'white',
                  borderRadius: BORDER_RADIUS.md,
                  padding: SPACING.lg,
                  border: `1px solid ${BRAND_COLORS.lightGray}`,
                  textAlign: 'center',
                }}>
                  <p style={{ color: BRAND_COLORS.mediumGray, fontSize: FONT_SIZES.base }}>
                    {t('cma.fillDetails')}
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
