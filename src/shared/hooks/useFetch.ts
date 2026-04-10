import { useAuth } from '@/shared/context/AuthContext';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

/**
 * Custom hook for making authenticated API requests with automatic token refresh
 * Handles 401 errors by refreshing the token and retrying the request
 */
export const useFetch = () => {
  const { accessToken, refreshAccessToken } = useAuth();

  const fetchWithAuth = async (
    url: string,
    options: FetchOptions = {}
  ): Promise<Response> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> || {}),
    };

    // Get token from context OR localStorage as fallback
    const token = accessToken || localStorage.getItem('access_token');
    
    // Add authorization header if token exists
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      console.log('[useFetch] Using token for request:', url);
    } else {
      console.warn('[useFetch] No token available for request:', url);
    }

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If 401 and we have a token, try to refresh and retry
    if (response.status === 401 && token) {
      console.log('[useFetch] Token expired, attempting to refresh...');
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        console.log('[useFetch] Token refreshed, retrying request...');
        // Get the new token from localStorage (it was updated by refreshAccessToken)
        const newToken = localStorage.getItem('access_token');
        if (newToken) {
          headers['Authorization'] = `Bearer ${newToken}`;

          // Retry the request with new token
          response = await fetch(url, {
            ...options,
            headers,
          });
        }
      }
    }

    return response;
  };

  return { fetchWithAuth };
};
