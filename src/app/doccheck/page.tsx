'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useMemo } from 'react';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';
import { useFetch } from '@/shared/hooks/useFetch';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface AssessmentAnswers {
  email: string;
  property_type: string;
  has_condominium: boolean;
  building_construction: string;
  has_mortgage: boolean;
  acquisition_type: string;
  is_primary_residence: boolean;
  has_valid_energy_cert: boolean;
  all_owners_available: string;
  energy_class?: string;
  urgency?: string;
  is_portugal_resident?: boolean;
  ownership_type?: string;
  seller_residency?: string;
  number_of_heirs?: string;
  is_divorce_case?: boolean;
  has_missing_documents?: boolean;
  property_age_category?: string;
  buyer_status?: string;
}

interface AssessmentResult {
  email: string;
  persona: {
    slug: string;
    name: string;
    description: string;
    recommended_tier: string;
  };
  missing_documents: string[];
  missing_document_count: number;
  recommended_tier: {
    slug: string;
    name: string;
    price: number;
  };
  risk_flags: Array<{
    key: string;
    message: string;
    recommendation: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
  }>;
  has_risk_flags: boolean;
  summary: {
    documents_always_required: number;
    documents_missing_count: number;
    risk_flag_count: number;
    is_free_tier: boolean;
    is_urgent: boolean;
  };
}

const STORAGE_KEY = 'doccheck_enhanced_progress';

type QuestionStepId =
  | 'email'
  | 'propertyType'
  | 'condominium'
  | 'buildingAge'
  | 'mortgage'
  | 'acquisition'
  | 'primaryResidence'
  | 'owners'
  | 'sellerResidency'
  | 'heirs'
  | 'divorce'
  | 'urgency';

type StepId = QuestionStepId | 'results';

const QUESTION_STEPS: QuestionStepId[] = [
  'email',
  'propertyType',
  'condominium',
  'buildingAge',
  'mortgage',
  'acquisition',
  'primaryResidence',
  'owners',
  'sellerResidency',
  'heirs',
  'divorce',
  'urgency',
];

const createInitialAnswers = (): Partial<AssessmentAnswers> => ({
  email: '',
  property_type: '',
  building_construction: '',
  acquisition_type: '',
  all_owners_available: '',
  seller_residency: '',
  number_of_heirs: '',
  urgency: '',
  is_divorce_case: undefined,
});

const shouldShowStep = (stepId: QuestionStepId, answers: Partial<AssessmentAnswers>) => {
  switch (stepId) {
    case 'heirs':
      return answers.acquisition_type === 'inheritance';
    case 'divorce':
      return answers.acquisition_type === 'divorce';
    default:
      return true;
  }
};

const isQuestionStep = (stepId: StepId): stepId is QuestionStepId => stepId !== 'results';

const isValidStepId = (value: unknown): value is StepId =>
  typeof value === 'string' && (value === 'results' || QUESTION_STEPS.includes(value as QuestionStepId));

const legacyStepToId = (stepNumber: number): StepId | null => {
  if (stepNumber === 0) {
    return 'results';
  }
  const index = stepNumber - 1;
  if (index >= 0 && index < QUESTION_STEPS.length) {
    return QUESTION_STEPS[index];
  }
  return null;
};

const PERSONA_COPY: Record<string, { nameKey: string; descriptionKey: string }> = {
  urban_resident: {
    nameKey: 'doccheck.persona.urban_resident.name',
    descriptionKey: 'doccheck.persona.urban_resident.description',
  },
  non_resident: {
    nameKey: 'doccheck.persona.non_resident.name',
    descriptionKey: 'doccheck.persona.non_resident.description',
  },
  heir: {
    nameKey: 'doccheck.persona.heir.name',
    descriptionKey: 'doccheck.persona.heir.description',
  },
  divorce: {
    nameKey: 'doccheck.persona.divorce.name',
    descriptionKey: 'doccheck.persona.divorce.description',
  },
  rural: {
    nameKey: 'doccheck.persona.rural.name',
    descriptionKey: 'doccheck.persona.rural.description',
  },
};

const TIER_LABELS: Record<string, string> = {
  free: 'doccheck.enhanced.results.freeTier',
  standard: 'pricing.standard',
  premium: 'pricing.premium',
  express: 'pricing.docexpress',
};

const DOCUMENT_LABELS: Record<string, string> = {
  caderneta_predial: 'doccheck.documents.caderneta_predial',
  certidao_permanente: 'doccheck.documents.certidao_permanente',
  licenca_utilizacao: 'doccheck.documents.licenca_utilizacao',
  ficha_tecnica_habitacao: 'doccheck.documents.ficha_tecnica_habitacao',
  certificado_energetico: 'doccheck.documents.certificado_energetico',
  declaracao_condominio: 'doccheck.documents.declaracao_condominio',
  distrate_hipoteca: 'doccheck.documents.distrate_hipoteca',
  habilitacao_herdeiros: 'doccheck.documents.habilitacao_herdeiros',
};

interface RiskFlagCopy {
  messageKey: string;
  recommendationKey: string;
  placeholderToken?: string;
}

const RISK_FLAG_COPY: Record<string, RiskFlagCopy> = {
  old_property: {
    messageKey: 'doccheck.risk.old_property.message',
    recommendationKey: 'doccheck.risk.old_property.recommendation',
  },
  low_energy_rating: {
    messageKey: 'doccheck.risk.low_energy_rating.message',
    recommendationKey: 'doccheck.risk.low_energy_rating.recommendation',
    placeholderToken: '{{value}}',
  },
  inheritance_complexity: {
    messageKey: 'doccheck.risk.inheritance_complexity.message',
    recommendationKey: 'doccheck.risk.inheritance_complexity.recommendation',
  },
  disputed_ownership: {
    messageKey: 'doccheck.risk.disputed_ownership.message',
    recommendationKey: 'doccheck.risk.disputed_ownership.recommendation',
  },
  overseas_owner: {
    messageKey: 'doccheck.risk.overseas_owner.message',
    recommendationKey: 'doccheck.risk.overseas_owner.recommendation',
  },
};

const humanizeSlug = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char: string) => char.toUpperCase());

export default function DocCheckEnhancedPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const { fetchWithAuth } = useFetch();
  const [currentStepId, setCurrentStepId] = useState<StepId>(QUESTION_STEPS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [answers, setAnswers] = useState<Partial<AssessmentAnswers>>(() => createInitialAnswers());
  const [hasLoadedProgress, setHasLoadedProgress] = useState(false);

  const visibleSteps = useMemo(
    () => QUESTION_STEPS.filter((stepId) => shouldShowStep(stepId, answers)),
    [answers],
  );
  const totalSteps = visibleSteps.length;
  const isResultsView = currentStepId === 'results';
  const currentStepIndex = isResultsView ? -1 : visibleSteps.indexOf(currentStepId);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.answers) {
          setAnswers({ ...createInitialAnswers(), ...saved.answers });
        }
        if (saved.result) {
          setResult(saved.result);
        }
        if (isValidStepId(saved.currentStepId)) {
          setCurrentStepId(saved.currentStepId);
        } else if (typeof saved.currentStep === 'number') {
          const legacyId = legacyStepToId(saved.currentStep);
          if (legacyId) {
            setCurrentStepId(legacyId);
          }
        }
      }
    } catch (error) {
      console.warn('[DocCheckEnhanced] Failed to load saved progress', error);
    } finally {
      setHasLoadedProgress(true);
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedProgress) {
      return;
    }
    try {
      const payload = JSON.stringify({
        answers,
        currentStepId,
        result,
      });
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (error) {
      console.warn('[DocCheckEnhanced] Failed to persist progress', error);
    }
  }, [answers, currentStepId, result, hasLoadedProgress]);

  useEffect(() => {
    if (currentStepId === 'results') {
      return;
    }
    if (!visibleSteps.includes(currentStepId)) {
      const fallbackStep = visibleSteps[visibleSteps.length - 1] || QUESTION_STEPS[0];
      setCurrentStepId(fallbackStep);
    }
  }, [visibleSteps, currentStepId]);

  const acquisitionType = answers.acquisition_type;
  const numberOfHeirs = answers.number_of_heirs;
  const divorceCase = answers.is_divorce_case;

  useEffect(() => {
    if (acquisitionType === 'inheritance') {
      if (numberOfHeirs === '1') {
        setAnswers((prev) => ({ ...prev, number_of_heirs: '' }));
      }
    } else if (numberOfHeirs !== '1') {
      setAnswers((prev) => ({ ...prev, number_of_heirs: '1' }));
    } else if (!numberOfHeirs) {
      setAnswers((prev) => ({ ...prev, number_of_heirs: '1' }));
    }
  }, [acquisitionType, numberOfHeirs]);

  useEffect(() => {
    if (acquisitionType === 'divorce') {
      if (typeof divorceCase !== 'boolean') {
        setAnswers((prev) => ({ ...prev, is_divorce_case: undefined }));
      }
    } else if (divorceCase !== false) {
      setAnswers((prev) => ({ ...prev, is_divorce_case: false }));
    }
  }, [acquisitionType, divorceCase]);

  // Translation helpers
  const tQuestion = (key: string) => t(`doccheck.enhanced.questions.${key}`);
  const tOption = (key: string) => t(`doccheck.enhanced.options.${key}`);
  const tResult = (key: string) => t(`doccheck.enhanced.results.${key}`);

  const isBool = (value: unknown): value is boolean => typeof value === 'boolean';

  const handleAnswer = (field: keyof AssessmentAnswers, value: any) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrevious = () => {
    if (isResultsView) {
      if (visibleSteps.length) {
        setCurrentStepId(visibleSteps[visibleSteps.length - 1]);
      }
      return;
    }
    if (currentStepIndex > 0) {
      setCurrentStepId(visibleSteps[currentStepIndex - 1]);
    }
  };

  const resetProgress = () => {
    setAnswers(createInitialAnswers());
    setCurrentStepId(QUESTION_STEPS[0]);
    setResult(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.warn('[DocCheckEnhanced] Failed to clear saved progress', error);
    }
  };

  const isStepComplete = (stepId: QuestionStepId) => {
    switch (stepId) {
      case 'email':
        return Boolean(answers.email);
      case 'propertyType':
        return Boolean(answers.property_type);
      case 'condominium':
        return isBool(answers.has_condominium);
      case 'buildingAge':
        return Boolean(answers.building_construction);
      case 'mortgage':
        return isBool(answers.has_mortgage);
      case 'acquisition':
        return Boolean(answers.acquisition_type);
      case 'primaryResidence':
        return isBool(answers.is_primary_residence);
      case 'owners':
        return Boolean(answers.all_owners_available) && isBool(answers.has_valid_energy_cert);
      case 'sellerResidency':
        return Boolean(answers.seller_residency);
      case 'heirs':
        return Boolean(answers.number_of_heirs);
      case 'divorce':
        return isBool(answers.is_divorce_case);
      case 'urgency':
        return Boolean(answers.urgency);
      default:
        return false;
    }
  };

  const currentQuestionStep = isQuestionStep(currentStepId) ? currentStepId : null;
  const isCurrentStepValid = currentQuestionStep ? isStepComplete(currentQuestionStep) : false;
  const isLastStep = currentQuestionStep ? currentQuestionStep === visibleSteps[visibleSteps.length - 1] : false;
  const safeStepPosition = currentStepIndex >= 0 ? currentStepIndex + 1 : 1;
  const progressPercent = currentStepIndex >= 0 && totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;

  const handleNext = () => {
    if (isResultsView) {
      return;
    }
    if (currentStepIndex === -1) {
      if (visibleSteps[0]) {
        setCurrentStepId(visibleSteps[0]);
      }
      return;
    }
    const stepId = visibleSteps[currentStepIndex];
    if (!stepId || !isStepComplete(stepId)) {
      alert(t('doccheck.enhanced.errors.missingFields'));
      return;
    }
    if (currentStepIndex < visibleSteps.length - 1) {
      setCurrentStepId(visibleSteps[currentStepIndex + 1]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const incompleteStep = visibleSteps.find((stepId) => !isStepComplete(stepId));
      if (incompleteStep) {
        alert(t('common.error') + ': ' + t('doccheck.enhanced.errors.missingFields'));
        setLoading(false);
        return;
      }

      const normalizedAnswers = {
        ...answers,
        number_of_heirs: answers.number_of_heirs || '1',
        is_divorce_case: typeof answers.is_divorce_case === 'boolean' ? answers.is_divorce_case : false,
      } as AssessmentAnswers;

      console.log('[DocCheckEnhanced] Submitting assessment to microservice:', normalizedAnswers);

      // Call microservice instead of monolith - use environment-based API URL
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8001/api';
      const res = await fetchWithAuth(`${apiUrl}/cases/`, {
        method: 'POST',
        body: JSON.stringify({
          rezerva_reference_id: `assessment-${Date.now()}`,
          seller_info: {
            email: normalizedAnswers.email || 'unknown@example.com',
            name: 'Seller',
            nif: 'unknown',
          },
          required_documents: [], // Will be computed by backend based on assessment_data
          assessment_data: normalizedAnswers,
        }),
      });

      console.log('[DocCheckEnhanced] Response status:', res.status);

      if (res.ok) {
        const data = await res.json();
        console.log('[DocCheckEnhanced] Success - Case created:', data);
        // Store case ID for document upload phase
        localStorage.setItem('current_case_id', data.provider_case_id);
        localStorage.setItem('upload_token', data.upload_token || '');
        setResult(data);
        setCurrentStepId('results');
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error('[DocCheckEnhanced] Error response:', errorData);
        alert(t('common.error') + ': ' + (errorData.message || errorData.detail || JSON.stringify(errorData) || t('doccheck.enhanced.errors.assessmentFailed')));
      }
    } catch (err) {
      console.error('[DocCheckEnhanced] Exception:', err);
      alert(t('common.error') + ': ' + (err instanceof Error ? err.message : t('doccheck.enhanced.errors.unknown')));
    } finally {
      setLoading(false);
    }
  };

  // Render current step
  const renderStep = () => {
    if (currentStepId === 'results') {
      return renderResults();
    }

    switch (currentStepId) {
      case 'email':
        return renderStep1();
      case 'propertyType':
        return renderStep2();
      case 'condominium':
        return renderStep3();
      case 'buildingAge':
        return renderStep4();
      case 'mortgage':
        return renderStep5();
      case 'acquisition':
        return renderStep6();
      case 'primaryResidence':
        return renderStep7();
      case 'owners':
        return renderStep8();
      case 'sellerResidency':
        return renderStep9();
      case 'heirs':
        return renderStep10();
      case 'divorce':
        return renderStep11();
      case 'urgency':
        return renderStep12();
      default:
        return null;
    }
  };

  const renderStep1 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('email')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.emailHint')}
      </p>
      <input
        type="email"
        value={answers.email || ''}
        onChange={(e) => handleAnswer('email', e.target.value)}
        placeholder={t('doccheck.emailPlaceholder')}
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
  );

  const renderStep2 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('propertyType')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.propertyTypeHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {['apartment', 'house', 'land', 'other'].map((type) => (
          <label key={type} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="property_type"
              value={type}
              checked={answers.property_type === type}
              onChange={(e) => handleAnswer('property_type', e.target.value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>
              {tOption(`propertyType.${type}`)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('condominium')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.condominiumHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {[
          { value: true, label: tOption('yes') },
          { value: false, label: tOption('no') },
        ].map(({ value, label }) => (
          <label key={String(value)} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="has_condominium"
              checked={answers.has_condominium === value}
              onChange={() => handleAnswer('has_condominium', value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('buildingAge')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.buildingAgeHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {['pre_1951', '1951_1990', '1991_2007', 'post_2007'].map((age) => (
          <label key={age} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="building_construction"
              value={age}
              checked={answers.building_construction === age}
              onChange={(e) => handleAnswer('building_construction', e.target.value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>
              {tOption(`buildingAge.${age}`)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('mortgage')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.mortgageHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {[
          { value: true, label: tOption('yes') },
          { value: false, label: tOption('no') },
        ].map(({ value, label }) => (
          <label key={String(value)} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="has_mortgage"
              checked={answers.has_mortgage === value}
              onChange={() => handleAnswer('has_mortgage', value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep6 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('acquisition')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.acquisitionHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {['purchase', 'inheritance', 'divorce', 'gift', 'other'].map((type) => (
          <label key={type} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="acquisition_type"
              value={type}
              checked={answers.acquisition_type === type}
              onChange={(e) => handleAnswer('acquisition_type', e.target.value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>
              {tOption(`acquisition.${type}`)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep7 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('primaryResidence')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.primaryResidenceHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {[
          { value: true, label: tOption('yes') },
          { value: false, label: tOption('no') },
        ].map(({ value, label }) => (
          <label key={String(value)} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="is_primary_residence"
              checked={answers.is_primary_residence === value}
              onChange={() => handleAnswer('is_primary_residence', value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>{label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep8 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('owners')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.ownersHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {['yes', 'one_abroad', 'one_deceased', 'disputed'].map((status) => (
          <label key={status} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="all_owners_available"
              value={status}
              checked={answers.all_owners_available === status}
              onChange={(e) => handleAnswer('all_owners_available', e.target.value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>
              {tOption(`owners.${status}`)}
            </span>
          </label>
        ))}
      </div>

      {/* Energy certificate question */}
      <div style={{ marginTop: SPACING.lg, paddingTop: SPACING.lg, borderTop: `1px solid ${BRAND_COLORS.lightGray}` }}>
        <h4 style={{ fontSize: FONT_SIZES.base, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.md }}>
          {tQuestion('energyCert')}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
          {[
            { value: true, label: tOption('yes') },
            { value: false, label: tOption('no') },
          ].map(({ value, label }) => (
            <label key={String(value)} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
              <input
                type="radio"
                name="has_valid_energy_cert"
                checked={answers.has_valid_energy_cert === value}
                onChange={() => handleAnswer('has_valid_energy_cert', value)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep9 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('sellerResidency')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.sellerResidencyHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {['portugal_resident', 'non_resident_eu', 'non_resident_other'].map((residency) => (
          <label key={residency} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="seller_residency"
              value={residency}
              checked={answers.seller_residency === residency}
              onChange={(e) => handleAnswer('seller_residency', e.target.value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>
              {tOption(`residency.${residency}`)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep10 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('numberOfHeirs')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.numberOfHeirsHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {['1', '2_3', '4_or_more', 'disputed'].map((count) => (
          <label key={count} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="number_of_heirs"
              value={count}
              checked={answers.number_of_heirs === count}
              onChange={(e) => handleAnswer('number_of_heirs', e.target.value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>
              {tOption(`heirs.${count}`)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep11 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('divorceCase')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.divorceHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {[
          { value: false, label: tOption('no') },
          { value: true, label: tOption('yes_amicable') },
          { value: true, label: tOption('yes_contested') },
        ].map((option, idx) => (
          <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="is_divorce_case"
              value={String(option.value)}
              checked={answers.is_divorce_case === option.value}
              onChange={() => handleAnswer('is_divorce_case', option.value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderStep12 = () => (
    <div>
      <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.textDark, marginBottom: SPACING.lg }}>
        {tQuestion('urgency')}
      </h3>
      <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, marginBottom: SPACING.md }}>
        {t('doccheck.enhanced.urgencyHint')}
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {['flexible', '3_months', '1_month', 'urgent'].map((urgency) => (
          <label key={urgency} style={{ display: 'flex', alignItems: 'center', gap: SPACING.md, cursor: 'pointer' }}>
            <input
              type="radio"
              name="urgency"
              value={urgency}
              checked={answers.urgency === urgency}
              onChange={(e) => handleAnswer('urgency', e.target.value)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <span style={{ fontSize: FONT_SIZES.base, color: BRAND_COLORS.textDark }}>
              {tOption(`urgency.${urgency}`)}
            </span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderResults = () => {
    if (!result) return null;

    const severityColors: Record<string, string> = {
      critical: '#D32F2F',
      high: '#F57C00',
      medium: '#FBC02D',
      low: '#7CB342',
    };

    // Safely access persona with null check
    const personaCopy = result.persona ? PERSONA_COPY[result.persona.slug] : undefined;
    const personaName = personaCopy ? t(personaCopy.nameKey) : result.persona?.name || 'Unknown Persona';
    const personaDescription = personaCopy ? t(personaCopy.descriptionKey) : result.persona?.description || '';

    // Safely access recommended_tier with null check
    const tierKey = result.recommended_tier ? TIER_LABELS[result.recommended_tier.slug] : undefined;
    const tierName = tierKey ? t(tierKey) : result.recommended_tier?.name || 'Unknown Tier';

    const formatDocumentLabel = (slug: string) => {
      const translationKey = DOCUMENT_LABELS[slug];
      if (translationKey) {
        return t(translationKey);
      }
      return humanizeSlug(slug);
    };

    const translateRiskFlag = (flag: AssessmentResult['risk_flags'][number]) => {
      const riskCopy = RISK_FLAG_COPY[flag.key];
      if (!riskCopy) {
        return {
          message: flag.message,
          recommendation: flag.recommendation,
        };
      }

      let localizedMessage = t(riskCopy.messageKey);
      if (riskCopy.placeholderToken) {
        const match = flag.message.match(/class\s([A-G])/i);
        const energyValue = match ? match[1] : '';
        localizedMessage = localizedMessage.replace(riskCopy.placeholderToken, energyValue);
      }

      return {
        message: localizedMessage,
        recommendation: t(riskCopy.recommendationKey),
      };
    };

    return (
      <div>
        <button
          onClick={resetProgress}
          style={{
            padding: `${SPACING.sm} ${SPACING.md}`,
            marginBottom: SPACING.lg,
            backgroundColor: BRAND_COLORS.lightGray,
            border: 'none',
            borderRadius: BORDER_RADIUS.sm,
            fontSize: FONT_SIZES.sm,
            cursor: 'pointer',
            color: BRAND_COLORS.textDark,
          }}
        >
          ← {t('common.restart')}
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.lg }}>
          {/* Persona Card */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.lg,
            border: `2px solid ${BRAND_COLORS.primary}`,
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}>
            <h3 style={{ fontSize: FONT_SIZES.xl, fontWeight: 700, color: BRAND_COLORS.primary, margin: 0 }}>
            {personaName}
            </h3>
            <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 ${SPACING.md} 0` }}>
            {personaDescription}
            </p>
            <div style={{
              backgroundColor: BRAND_COLORS.background,
              padding: SPACING.md,
              borderRadius: BORDER_RADIUS.sm,
              marginTop: SPACING.md,
            }}>
              <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                {t('doccheck.enhanced.results.recommendedTier')}
              </p>
              <p style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.primary, margin: `${SPACING.sm} 0 0 0` }}>
                {tierName}
              </p>
            </div>
          </div>

          {/* Tier Details */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.lg,
            border: `1px solid ${BRAND_COLORS.lightGray}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}>
            <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0 }}>
              {tResult('tierSummary')}
            </h3>
            
            <div style={{ marginTop: SPACING.lg, display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
              <div>
                <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                  {tResult('price')}
                </p>
                <p style={{ fontSize: FONT_SIZES['2xl'], fontWeight: 700, color: BRAND_COLORS.gold, margin: `${SPACING.sm} 0 0 0` }}>
                  €{result.recommended_tier?.price || '0'}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.md }}>
                <div>
                  <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                    {tResult('missingDocs')}
                  </p>
                  <p style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: `${SPACING.sm} 0 0 0` }}>
                    {result.missing_document_count}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                    {tResult('riskFlags')}
                  </p>
                  <p style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: result.has_risk_flags ? '#F57C00' : BRAND_COLORS.success, margin: `${SPACING.sm} 0 0 0` }}>
                    {result.summary?.risk_flag_count || 0}
                  </p>
                </div>
              </div>

              {result.summary?.is_free_tier && (
                <button
                  onClick={() => router.push('/dashboard')}
                  style={{
                    padding: `${SPACING.md} ${SPACING.lg}`,
                    borderRadius: BORDER_RADIUS.md,
                    backgroundColor: BRAND_COLORS.primary,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: FONT_SIZES.base,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {t('doccheck.enhanced.results.viewSmartCMA')}
                </button>
              )}

              {!result.summary?.is_free_tier && (
                <button
                  onClick={() => router.push('/orders/create')}
                  style={{
                    padding: `${SPACING.md} ${SPACING.lg}`,
                    borderRadius: BORDER_RADIUS.md,
                    backgroundColor: BRAND_COLORS.primary,
                    color: 'white',
                    fontWeight: 700,
                    fontSize: FONT_SIZES.base,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {t('doccheck.enhanced.results.selectTier')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Missing Documents */}
        {result.missing_document_count > 0 && result.missing_documents && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.lg,
            marginTop: SPACING.lg,
            border: `1px solid ${BRAND_COLORS.lightGray}`,
          }}>
            <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0 }}>
              {tResult('missingDocuments')}
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: `${SPACING.md} 0 0 0`, display: 'flex', flexDirection: 'column', gap: SPACING.sm }}>
              {result.missing_documents.map((doc, i) => (
                <li key={i} style={{
                  padding: `${SPACING.md} ${SPACING.md}`,
                  backgroundColor: '#FFF3E0',
                  borderLeft: `3px solid #F57C00`,
                  borderRadius: BORDER_RADIUS.sm,
                  fontSize: FONT_SIZES.sm,
                  color: BRAND_COLORS.textDark,
                }}>
                  ⚠ {formatDocumentLabel(doc)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risk Flags */}
        {result.has_risk_flags && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.md,
            padding: SPACING.lg,
            marginTop: SPACING.lg,
            border: `1px solid ${BRAND_COLORS.lightGray}`,
          }}>
            <h3 style={{ fontSize: FONT_SIZES.lg, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0 }}>
              {tResult('riskFlags')}
            </h3>
            <div style={{ marginTop: SPACING.md, display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
              {result.risk_flags.map((flag, i) => {
                const localizedFlag = translateRiskFlag(flag);
                return (
                <div key={i} style={{
                  padding: SPACING.md,
                  backgroundColor: `${severityColors[flag.severity] || BRAND_COLORS.mediumGray}20`,
                  borderLeft: `3px solid ${severityColors[flag.severity] || BRAND_COLORS.mediumGray}`,
                  borderRadius: BORDER_RADIUS.sm,
                }}>
                  <p style={{ fontSize: FONT_SIZES.sm, fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0 }}>
                    {localizedFlag.message}
                  </p>
                  <p style={{ fontSize: FONT_SIZES.xs, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 0 0` }}>
                    💡 {localizedFlag.recommendation}
                  </p>
                </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#FAFAF8', padding: SPACING.xl }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.xl }}>
          <div>
            <h1 style={{ fontSize: FONT_SIZES['3xl'], fontWeight: 700, color: BRAND_COLORS.textDark, margin: 0 }}>
              {t('doccheck.title')}
            </h1>
            <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: `${SPACING.sm} 0 0 0` }}>
              {t('doccheck.subtitle')}
            </p>
          </div>
          <div style={{ transform: 'scale(0.8)', transformOrigin: 'right' }}>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Progress */}
        {!isResultsView && totalSteps > 0 && (
          <div style={{ marginBottom: SPACING.lg }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.md }}>
              <p style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.mediumGray, margin: 0 }}>
                {t('doccheck.enhanced.step')} {safeStepPosition} / {totalSteps}
              </p>
              <div style={{ width: '60%', height: '4px', backgroundColor: BRAND_COLORS.lightGray, borderRadius: BORDER_RADIUS.full }}>
                <div style={{
                  width: `${progressPercent}%`,
                  height: '100%',
                  backgroundColor: BRAND_COLORS.primary,
                  borderRadius: BORDER_RADIUS.full,
                  transition: 'width 0.3s ease',
                }}></div>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          backgroundColor: 'white',
          borderRadius: BORDER_RADIUS.lg,
          padding: SPACING.xl,
          border: `1px solid ${BRAND_COLORS.lightGray}`,
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          {renderStep()}

          {/* Navigation Buttons */}
          {!isResultsView && totalSteps > 0 && (
            <div style={{ display: 'flex', gap: SPACING.md, marginTop: SPACING.xl, justifyContent: 'space-between' }}>
              <button
                type="button"
                onClick={handlePrevious}
                disabled={currentStepIndex <= 0}
                style={{
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  borderRadius: BORDER_RADIUS.md,
                  backgroundColor: BRAND_COLORS.lightGray,
                  border: 'none',
                  fontSize: FONT_SIZES.base,
                  cursor: currentStepIndex > 0 ? 'pointer' : 'not-allowed',
                  opacity: currentStepIndex > 0 ? 1 : 0.5,
                  color: BRAND_COLORS.textDark,
                  fontWeight: 600,
                }}
              >
                ← {t('common.previous')}
              </button>

              {!isLastStep ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!isCurrentStepValid}
                  style={{
                    padding: `${SPACING.md} ${SPACING.lg}`,
                    borderRadius: BORDER_RADIUS.md,
                    backgroundColor: isCurrentStepValid ? BRAND_COLORS.primary : BRAND_COLORS.lightGray,
                    color: isCurrentStepValid ? 'white' : BRAND_COLORS.mediumGray,
                    fontWeight: 700,
                    fontSize: FONT_SIZES.base,
                    border: 'none',
                    cursor: isCurrentStepValid ? 'pointer' : 'not-allowed',
                    opacity: isCurrentStepValid ? 1 : 0.6,
                  }}
                >
                  {t('common.next')} →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading || !isCurrentStepValid}
                  style={{
                    padding: `${SPACING.md} ${SPACING.lg}`,
                    borderRadius: BORDER_RADIUS.md,
                    backgroundColor: !isCurrentStepValid ? BRAND_COLORS.lightGray : BRAND_COLORS.primary,
                    color: !isCurrentStepValid ? BRAND_COLORS.mediumGray : 'white',
                    fontWeight: 700,
                    fontSize: FONT_SIZES.base,
                    border: 'none',
                    cursor: !isCurrentStepValid || loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.6 : 1,
                  }}
                >
                  {loading ? t('common.loading') : t('doccheck.enhanced.submit')}
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
