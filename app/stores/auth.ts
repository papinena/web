import { create } from "zustand";
import { authUtils, type AuthData } from "~/utils/auth";

interface AuthState {
  authData: AuthData | null;
  login: (data: AuthData) => void;
  logout: () => void;
  setAuthData: (data: AuthData | null) => void;
  setAuthUserData: (userData: any) => void;
  setAuthEmployeeData: (employeeData: any) => void;
  isAuthenticated: () => boolean;
  isUser: () => boolean;
  isEmployeeAdmin: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  authData: authUtils.getAuthData(),
  login: (data) => {
    authUtils.storeAuth(data);
    set({ authData: data });
  },
  logout: () => {
    authUtils.clearAuth();
    set({ authData: null });
  },
  setAuthData: (data) => {
    set({ authData: data });
  },
  setAuthUserData: (userData) => {
    const currentAuth = get().authData;
    if (currentAuth) {
      const newAuthData = { ...currentAuth, user: userData };
      authUtils.storeUser(userData);
      set({ authData: newAuthData });
    }
  },
  setAuthEmployeeData: (employeeData: any) => {
    const currentAuth = get().authData;
    if (currentAuth) {
      const newAuthData = { ...currentAuth, employee: employeeData };
      authUtils.storeEmployee(employeeData);
      set({ authData: newAuthData });
    }
  },
  isAuthenticated: () => {
    return get().authData !== null;
  },
  isUser: () => {
    return get().authData?.userType === "user";
  },
  isEmployeeAdmin: () => {
    return get().authData?.employee?.permission === "ADMIN";
  },
}));
