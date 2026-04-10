import { create } from 'zustand';
import apiClient from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'seller' | 'buyer' | 'agent' | 'lawyer' | 'admin';
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,

  login: async (username, password) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await apiClient.post('accounts/login/', { username, password });
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      set({
        user: data.user,
        accessToken: data.access,
        refreshToken: data.refresh,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Login failed',
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (username, email, password, role) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.post('accounts/register/', {
        username,
        email,
        password,
        role,
      });
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Full error object:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || JSON.stringify(error.response?.data) || 'Registration failed';
      console.error('Registration error:', errorMessage);
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      error: null,
    });
  },

  updateProfile: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { data: updatedUser } = await apiClient.put('accounts/profile/', data);
      set({
        user: updatedUser,
        isLoading: false,
      });
    } catch (error: any) {
      set({
        error: error.response?.data?.detail || 'Update failed',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
