/**
 * TypeScript Types
 */

// Theme
export type ColorKey = "primary" | "accent" | "gold" | "background" | "textDark" | "textLight";

// Service Tiers
export type ServiceTierSlug = "standard" | "premium" | "express" | "heritage";

export interface ServiceTier {
  name: string;
  price: number | null;
  currency: string;
  slug: ServiceTierSlug;
  description: string;
  includedDocuments: number | string;
  turnaroundDays: number | string;
  badge?: string | null;
}

// Document
export type DocumentType = "caderneta" | "certidao" | "licenca" | "energyCert";

export interface Document {
  id: string;
  orderId: string;
  documentType: DocumentType;
  documentTypeName: string;
  status: DocumentStatus;
  filePath?: string;
  issueDate?: Date;
  expiryDate?: Date;
  isExpired: boolean;
  daysToExpiry?: number;
  verificationStatus: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Order
export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "payment_confirmed"
  | "processing"
  | "awaiting_seller"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Order {
  id: string;
  sellerEmail: string;
  sellerName: string;
  sellerPhone?: string;
  serviceTier: ServiceTierSlug;
  serviceTierName: string;
  status: OrderStatus;
  totalDocuments: number;
  documentsCompleted: number;
  assignedOperator?: string;
  createdAt: Date;
  completedAt?: Date;
}

// Payment
export interface Payment {
  id: string;
  orderId: string;
  stripeCheckoutSessionId: string;
  sellerEmail: string;
  amountEUR: number;
  currency: string;
  serviceTier: ServiceTierSlug;
  status: "pending" | "processing" | "succeeded" | "failed" | "refunded";
  createdAt: Date;
  completedAt?: Date;
}

// CMA Report
export interface CMAReport {
  id: string;
  orderId: string;
  propertyAddress: string;
  propertyType: string;
  areaSqm?: number;
  bedrooms?: number;
  bathrooms?: number;
  estimatedPrice?: number;
  priceRangeMin?: number;
  priceRangeMax?: number;
  comparables: any[];
  marketAnalysis: Record<string, any>;
  reportPdfPath?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Seller Persona
export interface SellerPersona {
  slug: string;
  name: string;
  description: string;
  painPoints: string[];
  recommendedTier: ServiceTierSlug;
}

// API Response
export interface APIResponse<T = any> {
  status: "success" | "error";
  code: number;
  message: string;
  data?: T;
  error_code?: string;
  details?: Record<string, any>;
}

// Document Status
export type DocumentStatus = "pending" | "in_progress" | "uploaded" | "verified" | "complete" | "expired" | "error";
