'use client';

import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';

export default function PricingPage() {
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
          <Link href="/" style={{
            fontSize: FONT_SIZES['3xl'],
            fontWeight: 700,
            color: BRAND_COLORS.primary,
            textDecoration: 'none',
          }}>
            Fizbo
          </Link>
          <div style={{ display: 'flex', gap: SPACING.lg, alignItems: 'center' }}>
            <Link href="/auth/login" style={{
              color: BRAND_COLORS.textDark,
              textDecoration: 'none',
              fontWeight: 600,
            }}>
              Entrar
            </Link>
            <Link href="/auth/register" style={{
              padding: `${SPACING.md} ${SPACING.lg}`,
              backgroundColor: BRAND_COLORS.primary,
              color: 'white',
              borderRadius: BORDER_RADIUS.lg,
              textDecoration: 'none',
              fontWeight: 700,
            }}>
              Começar
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${SPACING.xl}`,
        paddingTop: '60px',
        paddingBottom: '60px',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: FONT_SIZES['3xl'],
          fontWeight: 700,
          color: BRAND_COLORS.textDark,
          marginBottom: SPACING.lg,
        }}>
          Preços Transparentes
        </h1>
        <p style={{
          fontSize: FONT_SIZES.lg,
          color: BRAND_COLORS.mediumGray,
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          Escolha o plano que melhor se adequa ao seu caso. Sem surpresas, sem custos ocultos.
        </p>
      </section>

      {/* Pricing Cards */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${SPACING.xl}`,
        paddingBottom: '80px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: SPACING.xl,
          marginBottom: SPACING.xl,
        }}>
          <PricingCardDetailed
            tier="Standard"
            price="399"
            badge={null}
            ideal="Apartamento ou moradia em condomínio, residente em Portugal"
            features={[
              'Caderneta Predial Urbana',
              'Certidão Permanente do Registo Predial',
              'Licença de Utilização (LU)',
              'Coordenação do Certificado Energético',
              'Declaração do Condomínio',
              'Distrate de Hipoteca (se aplicável)',
            ]}
            timeline="15–20 dias úteis"
          />
          <PricingCardDetailed
            tier="Premium"
            price="899"
            badge="MAIS POPULAR"
            ideal="Não-residente, herdeiros, situações complexas"
            features={[
              'Tudo do plano Standard',
              'Revisão Jurídica CPCV',
              'Cálculo de Mais-Valias',
              'Coordenação com Solicitador',
              'Habilitação de Herdeiros (se aplicável)',
              'Suporte dedicado por telefone',
            ]}
            timeline="20–30 dias úteis"
          />
          <PricingCardDetailed
            tier="DocExpress"
            price="1.499"
            badge={null}
            ideal="Prazo urgente, divórcio, deadline confirmada"
            features={[
              'Tudo do plano Premium',
              'Início em 48 horas',
              'Processamento em paralelo',
              'Suporte prioritário 24/7',
              'Gestão de urgências',
              'Garantia de conclusão no prazo',
            ]}
            timeline="Início em 48h, 10 dias úteis"
          />
        </div>
      </section>

      {/* FAQ Section */}
      <section style={{
        backgroundColor: 'white',
        padding: `${SPACING.xl}`,
        paddingTop: '80px',
        paddingBottom: '80px',
        borderTop: `1px solid ${BRAND_COLORS.lightGray}`,
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          <h2 style={{
            fontSize: FONT_SIZES['3xl'],
            fontWeight: 700,
            color: BRAND_COLORS.textDark,
            textAlign: 'center',
            marginBottom: SPACING.xl,
          }}>
            Perguntas Frequentes
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: SPACING.xl,
          }}>
            {[
              {
                q: 'O que está incluído em cada plano?',
                a: 'Cada plano inclui um conjunto específico de documentos e serviços. Consulte a lista acima para detalhes completos de cada tier.',
              },
              {
                q: 'Qual é o prazo exato?',
                a: 'Os prazos são estimativas baseadas em casos típicos. Alguns documentos (como a Licença de Utilização) dependem da velocidade da câmara municipal.',
              },
              {
                q: 'Posso mudar de plano depois de encomendar?',
                a: 'Sim, é possível atualizar para um plano superior. Apenas cobraremos a diferença de preço.',
              },
              {
                q: 'E se precisar de documentos adicionais?',
                a: 'Documentos adicionais (como procurações especiais) podem ser solicitados. Contacte-nos para uma cotação personalizada.',
              },
              {
                q: 'Como funciona o pagamento?',
                a: 'Utilizamos Stripe para processamento seguro. O pagamento é efetuado na ordem, e a fatura é enviada imediatamente por email.',
              },
              {
                q: 'Há políticas de reembolso?',
                a: 'Oferecemos uma política de satisfação total. Se não estiver satisfeito, contacte-nos nos primeiros 7 dias.',
              },
            ].map((faq, i) => (
              <div key={i}>
                <h4 style={{
                  fontSize: FONT_SIZES.base,
                  fontWeight: 700,
                  color: BRAND_COLORS.textDark,
                  marginBottom: SPACING.md,
                }}>
                  {faq.q}
                </h4>
                <p style={{
                  fontSize: FONT_SIZES.sm,
                  color: BRAND_COLORS.mediumGray,
                  margin: 0,
                  lineHeight: '1.6',
                }}>
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: `${SPACING.xl}`,
        paddingTop: '60px',
        paddingBottom: '60px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: SPACING.xl,
        textAlign: 'center',
      }}>
        <div>
          <p style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.primary, margin: 0 }}>
            Pagamento Seguro
          </p>
          <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 0 0` }}>
            Processado com Stripe
          </p>
        </div>
        <div>
          <p style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.primary, margin: 0 }}>
            AMI 123456
          </p>
          <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 0 0` }}>
            Intermediário Mediação Imobiliária
          </p>
        </div>
        <div>
          <p style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.primary, margin: 0 }}>
            FAIRBANK Group
          </p>
          <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 0 0` }}>
            Empresa regulada
          </p>
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
        <h2 style={{
          fontSize: FONT_SIZES['3xl'],
          fontWeight: 700,
          marginBottom: SPACING.lg,
        }}>
          Pronto para começar?
        </h2>
        <p style={{
          fontSize: FONT_SIZES.lg,
          marginBottom: SPACING.xl,
          opacity: 0.9,
        }}>
          Determine qual o plano ideal para si com uma avaliação gratuita.
        </p>
        <Link href="/doccheck" style={{
          display: 'inline-block',
          padding: `${SPACING.lg} ${SPACING.xl}`,
          backgroundColor: 'white',
          color: BRAND_COLORS.primary,
          borderRadius: BORDER_RADIUS.lg,
          textDecoration: 'none',
          fontWeight: 700,
        }}>
          Fazer Avaliação Gratuita
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
          borderTop: '1px solid rgba(255,255,255,0.2)',
          paddingTop: SPACING.lg,
          textAlign: 'center',
        }}>
          <p style={{ margin: 0, opacity: 0.8 }}>
            © 2026 Fizbo.pt · FAIRBANK Group · AMI 123456 · Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}

const PricingCardDetailed: React.FC<{
  tier: string;
  price: string;
  badge: string | null;
  ideal: string;
  features: string[];
  timeline: string;
}> = ({ tier, price, badge, ideal, features, timeline }) => (
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

    <h3 style={{
      fontSize: FONT_SIZES.xl,
      fontWeight: 700,
      color: BRAND_COLORS.textDark,
      margin: 0,
      marginBottom: SPACING.md,
    }}>
      {tier}
    </h3>

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
      borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
      paddingBottom: SPACING.lg,
    }}>
      Ideal para: {ideal}
    </p>

    <div style={{ marginBottom: SPACING.lg }}>
      <h4 style={{
        fontSize: FONT_SIZES.sm,
        fontWeight: 700,
        color: BRAND_COLORS.textDark,
        marginBottom: SPACING.md,
      }}>
        Incluído:
      </h4>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0,
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
    </div>

    <div style={{
      backgroundColor: BRAND_COLORS.background,
      padding: SPACING.md,
      borderRadius: BORDER_RADIUS.sm,
      marginBottom: SPACING.lg,
    }}>
      <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>
        ⏱ Prazo estimado
      </p>
      <p style={{ fontSize: FONT_SIZES.base, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `${SPACING.xs} 0 0 0` }}>
        {timeline}
      </p>
    </div>

    <Link href="/doccheck" style={{
      display: 'block',
      padding: `${SPACING.md} ${SPACING.lg}`,
      backgroundColor: badge ? BRAND_COLORS.primary : 'white',
      color: badge ? 'white' : BRAND_COLORS.primary,
      border: badge ? 'none' : `2px solid ${BRAND_COLORS.primary}`,
      borderRadius: BORDER_RADIUS.lg,
      textDecoration: 'none',
      fontWeight: 700,
      textAlign: 'center',
      fontSize: FONT_SIZES.base,
    }}>
      Escolher este plano
    </Link>
  </div>
);
