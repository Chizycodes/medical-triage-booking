import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: string | null;
}

interface AuthActions {
  login: (email: string) => void;
  logout: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,

      login: (email) => set({ user: email }),

      logout: () => set({ user: null }),
    }),
    {
      name: "auth",
    }
  )
);