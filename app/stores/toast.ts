import { create } from "zustand";
import type { ToastPosition } from "~/components/ui/toast";

export type ToastVariant = "default" | "destructive" | "success";

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  variant?: ToastVariant;
  position?: ToastPosition;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));
