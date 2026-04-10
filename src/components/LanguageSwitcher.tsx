'use client';

import { useLanguage } from '@/shared/context/LanguageContext';
import { BRAND_COLORS } from '@/shared/theme/colors';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      <button
        onClick={() => setLanguage('pt')}
        style={{
          padding: '6px 12px',
          backgroundColor: language === 'pt' ? BRAND_COLORS.primary : 'transparent',
          color: language === 'pt' ? 'white' : BRAND_COLORS.primary,
          border: `1px solid ${BRAND_COLORS.primary}`,
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: language === 'pt' ? 700 : 500,
          fontSize: '12px',
          transition: 'all 0.2s',
        }}
      >
        PT
      </button>
      <button
        onClick={() => setLanguage('en')}
        style={{
          padding: '6px 12px',
          backgroundColor: language === 'en' ? BRAND_COLORS.primary : 'transparent',
          color: language === 'en' ? 'white' : BRAND_COLORS.primary,
          border: `1px solid ${BRAND_COLORS.primary}`,
          borderRadius: '4px',
          cursor: 'pointer',
          fontWeight: language === 'en' ? 700 : 500,
          fontSize: '12px',
          transition: 'all 0.2s',
        }}
      >
        EN
      </button>
    </div>
  );
}
