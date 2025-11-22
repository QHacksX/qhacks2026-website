import { create } from "zustand";

interface CaptchaState {
  isOpen: boolean;
  siteKey: string | null;
  resolve: ((token: string) => void) | null;
  reject: ((reason?: any) => void) | null;
  open: (
    siteKey: string,
    resolve: (token: string) => void,
    reject: (reason?: any) => void,
  ) => void;
  close: () => void;
  reset: () => void;
}

export const useCaptchaStore = create<CaptchaState>((set) => ({
  isOpen: false,
  siteKey: null,
  resolve: null,
  reject: null,
  open: (siteKey, resolve, reject) =>
    set({ isOpen: true, siteKey, resolve, reject }),
  close: () => set({ isOpen: false }),
  reset: () => set({ isOpen: false, siteKey: null, resolve: null, reject: null }),
}));
