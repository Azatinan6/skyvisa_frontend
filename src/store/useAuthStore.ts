import {create} from 'zustand'

interface AuthStore {
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  // Sayfa yenilendiğinde token kaybolmasın diye localStorage'dan okuyoruz
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  
  login: (token) => {
    localStorage.setItem('token', token);
    set({ token, isAuthenticated: true });
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, isAuthenticated: false });
  },
}));