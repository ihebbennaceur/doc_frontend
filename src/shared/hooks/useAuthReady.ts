'use client';

import { useAuth } from '@/shared/context/AuthContext';
import { useEffect, useState } from 'react';

/**
 * Hook personnalisé pour attendre que l'authentification soit chargée
 * avant de continuer
 */
export const useAuthReady = () => {
  const { isLoading, isAuthenticated, accessToken } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  return {
    isReady,
    isAuthenticated,
    accessToken,
    isLoading,
  };
};
