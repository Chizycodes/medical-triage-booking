import { create } from "zustand";

interface AuthState {
  user: string | null;
}

interface AuthActions {
  login: (email: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,

  login: (email) => set({ user: email }),

  logout: () => set({ user: null }),
}));