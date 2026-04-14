import { create } from 'zustand';
import { api } from './api';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profile?: any;
}

interface AppStore {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;

  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; firstName: string; lastName: string }) => Promise<void>;
  logout: () => void;
  loadUser: () => Promise<void>;
}

export const useStore = create<AppStore>((set) => ({
  user: null,
  isLoading: true,

  setUser: (user) => set({ user }),

  login: async (email, password) => {
    const result = await api.login({ email, password });
    api.setToken(result.token);
    set({ user: result.user });
  },

  register: async (data) => {
    const result = await api.register(data);
    api.setToken(result.token);
    set({ user: result.user });
  },

  logout: () => {
    api.clearToken();
    set({ user: null });
  },

  loadUser: async () => {
    try {
      const user = await api.getMe();
      set({ user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
}));
