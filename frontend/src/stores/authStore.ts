import User from '@/models/userModel';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useGlobalStore from './globalStore';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const API_URL = useGlobalStore.getState().API_URL;

const useAuthStore = create(
  persist<AuthState>(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(API_URL + '/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({ isLoading: false, error: data.error || 'Login failed' });
            return false;
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
          });

          return true;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message || 'Login failed'
                : 'An unknown error occurred',
          });
          return false;
        }
      },

      register: async (name, email, password) => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch(API_URL + '/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            set({
              isLoading: false,
              error: data.message || 'Registration failed',
            });
            return false;
          }

          set({ isLoading: false });
          return true;
        } catch (error) {
          set({
            isLoading: false,
            error:
              error instanceof Error
                ? error.message || 'Registration failed'
                : 'An unknown error occurred',
          });
          return false;
        }
      },

      logout: () => {
        set({ user: null, token: null, error: null });
      },

      clearError: () => set({ error: null }),

      authFetch: async (url, options = {}) => {
        const token = get().token;

        if (!token) {
          throw new Error('No authentication token');
        }

        const authOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        };

        try {
          const response = await fetch(API_URL + url, authOptions);

          if (response.status === 401) {
            get().logout();
            throw new Error('Your session has expired. Please login again.');
          }

          return response;
        } catch (error) {
          set({
            error:
              error instanceof Error
                ? error.message
                : 'An unknown error occurred',
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-store',
    },
  ),
);

export default useAuthStore;
