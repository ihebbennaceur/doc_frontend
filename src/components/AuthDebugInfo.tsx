'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/shared/context/AuthContext';
import { useAuthReady } from '@/shared/hooks/useAuthReady';

/**
 * Composant de débogage pour vérifier l'état de l'authentification
 * À utiliser temporairement pour diagnostiquer les problèmes d'auth
 */
export const AuthDebugInfo: React.FC = () => {
  const auth = useAuth();
  const { isReady } = useAuthReady();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        backgroundColor: '#333',
        color: '#0f0',
        padding: '10px 15px',
        borderRadius: '5px',
        fontSize: '11px',
        fontFamily: 'monospace',
        maxWidth: '300px',
        zIndex: 9999,
        border: '1px solid #0f0',
        maxHeight: '200px',
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>Auth Debug:</div>
      <div>isReady: {String(isReady)}</div>
      <div>isLoading: {String(auth.isLoading)}</div>
      <div>isAuthenticated: {String(auth.isAuthenticated)}</div>
      <div>user: {auth.user ? auth.user.email : 'null'}</div>
      <div>token: {auth.accessToken ? auth.accessToken.substring(0, 20) + '...' : 'null'}</div>
      <div style={{ marginTop: '10px', fontSize: '10px', opacity: 0.7 }}>
        <div>localStorage.access_token: {localStorage.getItem('access_token') ? 'YES' : 'NO'}</div>
        <div>localStorage.user: {localStorage.getItem('user') ? 'YES' : 'NO'}</div>
      </div>
    </div>
  );
};
