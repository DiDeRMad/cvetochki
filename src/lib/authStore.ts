import { create } from 'zustand';

export interface AuthUser {
  user_id: number;
  full_name: string;
  email: string;
  phone: string;
}

interface AuthState {
  token: string;
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  clear: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('token') || '',
  user: localStorage.getItem('auth_user')
    ? (JSON.parse(localStorage.getItem('auth_user') || 'null') as AuthUser)
    : null,
  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ token, user });
    window.dispatchEvent(new CustomEvent('userUpdated'));
  },
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth_user');
    set({ token: '', user: null });
    window.dispatchEvent(new CustomEvent('userUpdated'));
  },
}));







