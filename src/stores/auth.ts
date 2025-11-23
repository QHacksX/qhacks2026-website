import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi, type User } from "@/lib/api";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
  update: (user: User) => void;
  updateFlags: (flags: number) => void;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export async function logout() {
  await authApi.logout();
  useAuthStore.getState().logout();
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      login: (token) => set({ isAuthenticated: true, token }),
      logout: () => set({ isAuthenticated: false, token: null, user: null }),
      update: (user) => set({ user }),
      updateFlags: (flags: number) =>
        set((state) => ({
          user: state.user ? { ...state.user, flags } : null,
        })),
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: "auth-store",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
