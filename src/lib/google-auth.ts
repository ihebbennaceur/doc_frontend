import { buildApiUrl } from './api-url';

/**
 * Exchange Google token for JWT tokens from backend
 */
export const exchangeGoogleToken = async (googleToken: string) => {
  try {
    const response = await fetch(buildApiUrl('/auth/google/'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        access_token: googleToken,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      
      // Store tokens and user in localStorage
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      return {
        success: true,
        data,
        isNew: data.is_new, // True if new user was created
      };
    } else {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.error || 'Failed to authenticate with Google',
      };
    }
  } catch (error) {
    console.error('Google auth error:', error);
    return {
      success: false,
      error: 'An error occurred during Google authentication',
    };
  }
};
