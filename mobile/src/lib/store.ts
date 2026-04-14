import { create } from 'zustand';
import { api } from './api';

interface AppStore {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  init: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => Promise<void>;
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  init: async () => {
    await api.init();
    try {
      const user = await api.getMe();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  login: async (email, password) => {
    const result = await api.login({ email, password });
    await api.setToken(result.token);
    set({ user: result.user, isAuthenticated: true });
  },

  register: async (data) => {
    const result = await api.register(data);
    await api.setToken(result.token);
    set({ user: result.user, isAuthenticated: true });
  },

  logout: async () => {
    await api.clearToken();
    set({ user: null, isAuthenticated: false });
  },
}));
