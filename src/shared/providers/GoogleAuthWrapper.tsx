'use client';

import { ReactNode } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleAuthWrapper({ children }: { children: ReactNode }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID;

  if (!clientId) {
    console.warn('NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID is not set');
  }

  return (
    <GoogleOAuthProvider clientId={clientId || ''}>
      {children}
    </GoogleOAuthProvider>
  );
}
