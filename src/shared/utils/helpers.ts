/**
 * Frontend Utility Functions
 */

export const formatCurrency = (amount: number, currency: string = "EUR"): string => {
  return new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pt-PT");
};

export const validateEmail = (email: string): boolean => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const regex = /^(\+351|0)?9[1-9]\d{7}$/;
  return regex.test(phone.replace(/[\s-]/g, ""));
};

export const sanitizeString = (value: string, maxLength?: number): string => {
  let sanitized = value.trim();
  if (maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  return sanitized;
};

export const generateOrderId = (): string => {
  const timestamp = new Date().toISOString().replace(/[:-]/g, "").slice(0, 14);
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `FIZ-${timestamp}-${random}`;
};

export const getDaysUntilExpiry = (expiryDate: Date | string): number => {
  const expiry = typeof expiryDate === "string" ? new Date(expiryDate) : expiryDate;
  const today = new Date();
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

export const isExpired = (expiryDate: Date | string): boolean => {
  return getDaysUntilExpiry(expiryDate) === 0;
};

export const formatStatusDisplay = (status: string): string => {
  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
