'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/shared/context/LanguageContext';

export default function Home() {
  const router = useRouter();
  const { t, language } = useLanguage();

  // Plans data structure
  const plans = [
    {
      tier: t('pricing.standard'),
      tierKey: 'pricing.standard',
      price: '399',
      badge: null,
      idealKey: 'pricing.standard_ideal',
      featuresKeys: ['pricing.f1', 'pricing.f2', 'pricing.f3', 'pricing.f4', 'pricing.f5', 'pricing.f6'],
      timelineKey: 'pricing.timeline_standard',
      ctaKey: 'home.comece',
      ctaHref: '/doccheck'
    },
    {
      tier: t('pricing.premium'),
      tierKey: 'pricing.premium',
      price: '899',
      badge: t('pricing.popular'),
      badgeKey: 'pricing.popular',
      idealKey: 'pricing.premium_ideal',
      featuresKeys: ['pricing.p1', 'pricing.p2', 'pricing.p3', 'pricing.p4', 'pricing.p5', 'pricing.p6'],
      timelineKey: 'pricing.timeline_premium',
      ctaKey: 'home.comece',
      ctaHref: '/doccheck'
    },
    {
      tier: t('pricing.docexpress'),
      tierKey: 'pricing.docexpress',
      price: '1.499',
      badge: null,
      idealKey: 'pricing.docexpress_ideal',
      featuresKeys: ['pricing.d1', 'pricing.d2', 'pricing.d3', 'pricing.d4', 'pricing.d5', 'pricing.d6'],
      timelineKey: 'pricing.timeline_docexpress',
      ctaKey: 'pricing.contact',
      ctaHref: 'https://wa.me/351934567890?text=Interessado%20no%20plano%20DocExpress'
    }
  ];

  // Testimonials data
  const testimonials = [
    {
      nameKey: 'testimonial.maria',
      roleKey: 'testimonial.maria_city',
      quoteKey: 'testimonial.maria_quote'
    },
    {
      nameKey: 'testimonial.joao',
      roleKey: 'testimonial.joao_city',
      quoteKey: 'testimonial.joao_quote'
    },
    {
      nameKey: 'testimonial.ana',
      roleKey: 'testimonial.ana_city',
      quoteKey: 'testimonial.ana_quote'
    }
  ];

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  // Forcer le re-render lors du changement de langue
  useEffect(() => {
    // Déclencher une mise à jour du composant
  }, [language]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8' }}>
      {/* Navigation */}
      <nav style={{
        backgroundColor: 'white',
        borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
        padding: `${SPACING.lg} ${SPACING.xl}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.primary, margin: 0 }}>
            Fizbo
          </h1>
          <div style={{ display: 'flex', gap: SPACING.lg, alignItems: 'center' }}>
            <LanguageSwitcher />
            <Link href="/auth/login" style={{
              color: BRAND_COLORS.textDark,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: FONT_SIZES.base,
            }}>
              {t('nav.entrar')}
            </Link>
            <Link href="/auth/register" style={{
              padding: `${SPACING.md} ${SPACING.lg}`,
              backgroundColor: BRAND_COLORS.primary,
              color: 'white',
              borderRadius: BORDER_RADIUS.lg,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: FONT_SIZES.base,
            }}>
              {t('nav.comecar')}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${SPACING.xl} ${SPACING.xl}`,
        textAlign: 'center',
        paddingTop: '80px',
        paddingBottom: '80px',
      }}>
        <h2 style={{
          fontSize: FONT_SIZES['3xl'],
          fontWeight: 700,
          color: BRAND_COLORS.textDark,
          marginBottom: SPACING.lg,
        }}>
          {t('home.hero')}
        </h2>
        <p style={{
          fontSize: FONT_SIZES.xl,
          color: BRAND_COLORS.mediumGray,
          marginBottom: SPACING.xl,
          maxWidth: '600px',
          margin: `0 auto ${SPACING.xl}`,
        }}>
          {t('home.heroSub')}
        </p>
        <div style={{ display: 'flex', gap: SPACING.lg, justifyContent: 'center', marginBottom: SPACING.xl }}>
          <Link href="/doccheck" style={{
            padding: `${SPACING.lg} ${SPACING.xl}`,
            backgroundColor: BRAND_COLORS.primary,
            color: 'white',
            borderRadius: BORDER_RADIUS.lg,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: FONT_SIZES.base,
          }}>
            {t('home.verificar')}
          </Link>
          <a href="#como-funciona" style={{
            padding: `${SPACING.lg} ${SPACING.xl}`,
            backgroundColor: 'white',
            color: BRAND_COLORS.primary,
            border: `2px solid ${BRAND_COLORS.primary}`,
            borderRadius: BORDER_RADIUS.lg,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: FONT_SIZES.base,
            cursor: 'pointer',
          }}>
            {t('home.comofunciona')}
          </a>
        </div>
      </section>

      {/* Trust Bar */}
      <section style={{
        backgroundColor: 'white',
        padding: `${SPACING.xl}`,
        borderTop: `1px solid ${BRAND_COLORS.lightGray}`,
        borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: SPACING.lg,
          textAlign: 'center',
        }}>
          <div>
            <p style={{ fontSize: FONT_SIZES['2xl'], fontWeight: 700, color: BRAND_COLORS.primary, margin: 0 }}>
              500+
            </p>
            <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 0 0` }}>
              {t('home.propriedades')}
            </p>
          </div>
          <div>
            <p style={{ fontSize: FONT_SIZES['2xl'], fontWeight: 700, color: BRAND_COLORS.primary, margin: 0 }}>
              450+
            </p>
            <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 0 0` }}>
              {t('home.certificados')}
            </p>
          </div>
          <div>
            <p style={{ fontSize: FONT_SIZES['2xl'], fontWeight: 700, color: BRAND_COLORS.primary, margin: 0 }}>
              98%
            </p>
            <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 0 0` }}>
              {t('home.satisfacao')}
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${SPACING.xl}`,
        paddingTop: '80px',
        paddingBottom: '80px',
      }}>
        <h3 style={{
          fontSize: FONT_SIZES['3xl'],
          fontWeight: 700,
          color: BRAND_COLORS.textDark,
          textAlign: 'center',
          marginBottom: SPACING.xl,
        }}>
          {t('home.comoFunciona')}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: SPACING.xl,
        }}>
          {[
            { num: '1', titleKey: 'home.passo1', descKey: 'home.desc1' },
            { num: '2', titleKey: 'home.passo2', descKey: 'home.desc2' },
            { num: '3', titleKey: 'home.passo3', descKey: 'home.desc3' },
          ].map((step, i) => (
            <div key={i} style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                backgroundColor: BRAND_COLORS.primary,
                color: 'white',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: FONT_SIZES.xl,
                fontWeight: 700,
                margin: `0 auto ${SPACING.lg}`,
              }}>
                {step.num}
              </div>
              <h4 style={{
                fontSize: FONT_SIZES.lg,
                fontWeight: 700,
                color: BRAND_COLORS.textDark,
                margin: 0,
                marginBottom: SPACING.md,
              }}>
                {t(step.titleKey)}
              </h4>
              <p style={{
                fontSize: FONT_SIZES.base,
                color: BRAND_COLORS.mediumGray,
                margin: 0,
              }}>
                {t(step.descKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section style={{
        backgroundColor: 'white',
        padding: `${SPACING.xl}`,
        paddingTop: '80px',
        paddingBottom: '80px',
        borderTop: `1px solid ${BRAND_COLORS.lightGray}`,
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{
            fontSize: FONT_SIZES['3xl'],
            fontWeight: 700,
            color: BRAND_COLORS.textDark,
            textAlign: 'center',
            marginBottom: SPACING.xl,
          }}>
            {t('home.escolha')}
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: SPACING.xl,
            marginBottom: SPACING.xl,
          }}>
            {plans.map((plan, idx) => (
              <PricingCard
                key={idx}
                tier={t(plan.tierKey)}
                price={plan.price}
                badge={plan.badge ? t(plan.badgeKey) : null}
                ideal={t(plan.idealKey)}
                features={plan.featuresKeys.map(key => t(key))}
                timeline={t(plan.timelineKey)}
                cta={t(plan.ctaKey)}
                ctaHref={plan.ctaHref}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${SPACING.xl}`,
        paddingTop: '80px',
        paddingBottom: '80px',
      }}>
        <h3 style={{
          fontSize: FONT_SIZES['3xl'],
          fontWeight: 700,
          color: BRAND_COLORS.textDark,
          textAlign: 'center',
          marginBottom: SPACING.xl,
        }}>
          {t('home.clientes')}
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: SPACING.lg,
        }}>
          {testimonials.map((testimonial, i) => (
            <div key={i} style={{
              backgroundColor: 'white',
              borderRadius: BORDER_RADIUS.md,
              padding: SPACING.lg,
              border: `1px solid ${BRAND_COLORS.lightGray}`,
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            }}>
              <p style={{
                fontSize: FONT_SIZES.base,
                color: BRAND_COLORS.textDark,
                fontStyle: 'italic',
                margin: `0 0 ${SPACING.md} 0`,
              }}>
                "{t(testimonial.quoteKey)}"
              </p>
              <p style={{
                fontSize: FONT_SIZES.sm,
                fontWeight: 700,
                color: BRAND_COLORS.primary,
                margin: 0,
              }}>
                {t(testimonial.nameKey)}
              </p>
              <p style={{
                fontSize: FONT_SIZES.xs,
                color: BRAND_COLORS.mediumGray,
                margin: `${SPACING.xs} 0 0 0`,
              }}>
                {t(testimonial.roleKey)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        backgroundColor: BRAND_COLORS.primary,
        padding: `${SPACING.xl}`,
        paddingTop: '80px',
        paddingBottom: '80px',
        color: 'white',
        textAlign: 'center',
      }}>
        <h3 style={{
          fontSize: FONT_SIZES['3xl'],
          fontWeight: 700,
          marginBottom: SPACING.lg,
        }}>
          {t('home.pronto')}
        </h3>
        <p style={{
          fontSize: FONT_SIZES.lg,
          marginBottom: SPACING.xl,
          opacity: 0.9,
        }}>
          {t('home.comece')}
        </p>
        <Link href="/doccheck" style={{
          display: 'inline-block',
          padding: `${SPACING.lg} ${SPACING.xl}`,
          backgroundColor: 'white',
          color: BRAND_COLORS.primary,
          borderRadius: BORDER_RADIUS.lg,
          textDecoration: 'none',
          fontWeight: 700,
          fontSize: FONT_SIZES.base,
        }}>
          {t('home.checkDocuments')}
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: BRAND_COLORS.textDark,
        color: 'white',
        padding: `${SPACING.xl}`,
        fontSize: FONT_SIZES.sm,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: SPACING.lg,
          marginBottom: SPACING.xl,
        }}>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: SPACING.md }}>{t('footer.title')}</h4>
            <p style={{ opacity: 0.8, margin: 0 }}>{t('footer.description')}</p>
          </div>
          <div>
            <h4 style={{ fontWeight: 700, marginBottom: SPACING.md }}>{t('footer.links')}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
              <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>{t('footer.privacy')}</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>{t('footer.terms')}</a>
              <a href="#" style={{ color: 'white', textDecoration: 'none', opacity: 0.8 }}>{t('footer.contact')}</a>
            </div>
          </div>
        </div>
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: SPACING.lg,
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>
            {t('home.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
}

const PricingCard: React.FC<{
  tier: string;
  price: string;
  badge: string | null;
  ideal: string;
  features: string[];
  timeline: string;
  cta: string;
  ctaHref: string;
}> = ({ tier, price, badge, ideal, features, timeline, cta, ctaHref }) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    border: `2px solid ${badge ? BRAND_COLORS.primary : BRAND_COLORS.lightGray}`,
    boxShadow: badge ? '0 8px 24px rgba(46,93,75,0.15)' : '0 1px 3px rgba(0,0,0,0.08)',
    position: 'relative',
    transform: badge ? 'translateY(-10px)' : 'none',
  }}>
    {badge && (
      <div style={{
        position: 'absolute',
        top: '-12px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: BRAND_COLORS.gold,
        color: BRAND_COLORS.textDark,
        padding: `${SPACING.xs} ${SPACING.md}`,
        borderRadius: BORDER_RADIUS.sm,
        fontSize: FONT_SIZES.xs,
        fontWeight: 700,
      }}>
        {badge}
      </div>
    )}
    <h4 style={{
      fontSize: FONT_SIZES.xl,
      fontWeight: 700,
      color: BRAND_COLORS.textDark,
      margin: 0,
      marginBottom: SPACING.md,
    }}>
      {tier}
    </h4>
    <div style={{ marginBottom: SPACING.lg }}>
      <span style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.primary }}>
        €{price}
      </span>
      <span style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray }}>
        {' '}(único)
      </span>
    </div>
    <p style={{
      fontSize: FONT_SIZES.sm,
      color: BRAND_COLORS.mediumGray,
      marginBottom: SPACING.lg,
      fontStyle: 'italic',
    }}>
      {ideal}
    </p>
    <ul style={{
      listStyle: 'none',
      padding: 0,
      margin: `0 0 ${SPACING.lg} 0`,
      display: 'flex',
      flexDirection: 'column',
      gap: SPACING.sm,
    }}>
      {features.map((feature, i) => (
        <li key={i} style={{
          fontSize: FONT_SIZES.sm,
          color: BRAND_COLORS.textDark,
          display: 'flex',
          gap: SPACING.sm,
        }}>
          <span style={{ color: BRAND_COLORS.success, fontWeight: 700 }}>✓</span>
          {feature}
        </li>
      ))}
    </ul>
    <p style={{
      fontSize: FONT_SIZES.xs,
      color: BRAND_COLORS.mediumGray,
      margin: `0 0 ${SPACING.lg} 0`,
    }}>
      ⏱ {timeline}
    </p>
    <Link href={ctaHref} style={{
      display: 'block',
      padding: `${SPACING.md} ${SPACING.lg}`,
      backgroundColor: badge ? BRAND_COLORS.primary : 'white',
      color: badge ? 'white' : BRAND_COLORS.primary,
      border: badge ? 'none' : `2px solid ${BRAND_COLORS.primary}`,
      borderRadius: BORDER_RADIUS.lg,
      textDecoration: 'none',
      fontWeight: 700,
      textAlign: 'center',
      cursor: 'pointer',
    }}>
      {cta}
    </Link>
  </div>
);
