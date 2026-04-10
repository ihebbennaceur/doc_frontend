/**
 * Fizbo Theme - Brand Colors and Design System
 * Centralized design tokens for entire platform
 */

export const BRAND_COLORS = {
  primary: "#2E5D4B", // Forest green
  accent: "#4A9B7F", // Mid green
  gold: "#C9A84C", // Warm gold
  background: "#F5F0E8", // Warm cream
  textDark: "#1A1A2E", // Dark text
  textLight: "#FFFFFF", // Light text
  error: "#D32F2F", // Error red
  warning: "#F57C00", // Warning orange
  success: "#388E3C", // Success green
  info: "#1976D2", // Info blue
  lightGray: "#E8E8E8",
  mediumGray: "#999999",
} as const;

export const FONTS = {
  heading: "Inter",
  body: "Source Serif 4",
} as const;

export const FONT_SIZES = {
  xs: "12px",
  sm: "14px",
  base: "16px",
  lg: "18px",
  xl: "20px",
  "2xl": "24px",
  "3xl": "30px",
} as const;

export const SPACING = {
  xs: "4px",
  sm: "8px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  "2xl": "48px",
} as const;

export const BORDER_RADIUS = {
  sm: "4px", // Inputs
  md: "8px", // Cards
  lg: "24px", // CTAs
  full: "9999px", // Fully rounded
} as const;

// Service Tiers
export const SERVICE_TIERS = {
  standard: {
    name: "DocComplete Standard",
    price: 399,
    currency: "EUR",
    slug: "standard",
    description: "Speed + simplicity for urban residents",
    includedDocuments: 8,
    turnaroundDays: 7,
    badge: null,
  },
  premium: {
    name: "DocComplete Premium",
    price: 899,
    currency: "EUR",
    slug: "premium",
    description: "Remote handling + fiscal rep for non-residents",
    includedDocuments: 12,
    turnaroundDays: 10,
    badge: "MOST_POPULAR",
  },
  express: {
    name: "DocExpress",
    price: 1499,
    currency: "EUR",
    slug: "express",
    description: "Speed + coordination for urgent sales",
    includedDocuments: 15,
    turnaroundDays: 5,
    badge: null,
  },
  heritage: {
    name: "DocComplete Heritage",
    price: null,
    currency: "EUR",
    slug: "heritage",
    description: "Expert guidance for rural & inherited properties",
    includedDocuments: "custom",
    turnaroundDays: "custom",
    badge: null,
  },
} as const;

// Document Types
export const DOCUMENT_TYPES = {
  caderneta: {
    name: "Caderneta Predial Urbana",
    slug: "caderneta",
    validityMonths: 12,
    cost: 0,
    issuer: "Finanças",
    required: true,
  },
  certidao: {
    name: "Certidão Permanente do Registo Predial",
    slug: "certidao",
    validityMonths: 6,
    cost: 15,
    issuer: "IRN",
    required: true,
  },
  licenca: {
    name: "Licença de Utilização",
    slug: "licenca",
    validityMonths: null,
    cost: 30,
    issuer: "Câmara Municipal",
    required: false,
  },
  energyCert: {
    name: "Energy Certificate (RECS)",
    slug: "energy_cert",
    validityMonths: 120,
    cost: 80,
    issuer: "Perito Qualificado",
    required: true,
  },
} as const;

// Seller Personas
export const SELLER_PERSONAS = {
  urbanResident: {
    slug: "urban_resident",
    name: "Urban Resident",
    description: "PT resident, city apartment, mortgage",
    painPoints: ["Speed", "Simplicity"],
    recommendedTier: "standard",
  },
  nonResident: {
    slug: "non_resident",
    name: "Non-Resident",
    description: "British/Dutch/other, villa, abroad",
    painPoints: ["Remote handling", "Fiscal representation"],
    recommendedTier: "premium",
  },
  heir: {
    slug: "heir",
    name: "Heir / Inherited",
    description: "Multiple heirs, possibly abroad",
    painPoints: ["Legal coordination", "Complexity"],
    recommendedTier: "premium",
  },
  divorce: {
    slug: "divorce",
    name: "Divorce / Urgent",
    description: "Joint ownership, time-sensitive",
    painPoints: ["Speed", "Coordination"],
    recommendedTier: "express",
  },
  rural: {
    slug: "rural",
    name: "Rural / Legacy",
    description: "Quinta, missing LU, elderly seller",
    painPoints: ["Expert guidance", "Realistic timelines"],
    recommendedTier: "heritage",
  },
} as const;

// Document Status
export const DOCUMENT_STATUS = {
  pending: "pending",
  inProgress: "in_progress",
  uploaded: "uploaded",
  verified: "verified",
  complete: "complete",
  expired: "expired",
  error: "error",
} as const;

// Order Status
export const ORDER_STATUS = {
  draft: "draft",
  pendingPayment: "pending_payment",
  paymentConfirmed: "payment_confirmed",
  processing: "processing",
  awaitingSeller: "awaiting_seller",
  inProgress: "in_progress",
  completed: "completed",
  cancelled: "cancelled",
} as const;

// Helper functions
export const getColor = (colorKey: keyof typeof BRAND_COLORS): string => {
  return BRAND_COLORS[colorKey] || BRAND_COLORS.primary;
};

export const getTierBySlug = (slug: string) => {
  return Object.values(SERVICE_TIERS).find((tier) => tier.slug === slug);
};

export const getDocumentBySlug = (slug: string) => {
  return Object.values(DOCUMENT_TYPES).find((doc) => doc.slug === slug);
};

export const getPersonaBySlug = (slug: string) => {
  return Object.values(SELLER_PERSONAS).find((persona) => persona.slug === slug);
};
