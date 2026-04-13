/**
 * Get the API base URL from environment variables
 * Falls back to production backend URL if not set
 */
export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || 'https://backenddoccheck-production.up.railway.app/api';
  }
  // Server-side
  return process.env.NEXT_PUBLIC_API_URL || 'https://backenddoccheck-production.up.railway.app/api';
};

/**
 * Build a full API URL from an endpoint
 * Example: buildApiUrl('/register/') => 'https://backenddoccheck-production.up.railway.app/api/register/'
 */
export const buildApiUrl = (endpoint: string): string => {
  const baseUrl = getApiBaseUrl();
  if (endpoint.startsWith('/')) {
    return `${baseUrl}${endpoint}`;
  }
  return `${baseUrl}/${endpoint}`;
};
