import type z from "zod";
import type { EmployeeSchema } from "~/parsers/login";
import { FIRST_ACCESS_KEY, STORAGE_KEYS } from "./constants";

export interface AuthData {
  token: string;
  tokenId: string;
  userType: "user" | "employee";
  user?: any;
  employee?: z.infer<typeof EmployeeSchema> & { avatar?: string };
}

export const authUtils = {
  /**
   * Check if window is defined (client-side)
   */
  isClient: (): boolean => {
    return typeof window !== "undefined";
  },

  /**
   * Store authentication data in localStorage
   */
  storeAuth: (authData: AuthData): void => {
    if (!authUtils.isClient()) return;

    localStorage.setItem(STORAGE_KEYS.TOKEN, authData.token);
    localStorage.setItem(STORAGE_KEYS.TOKEN_ID, authData.tokenId);
    localStorage.setItem(STORAGE_KEYS.USER_TYPE, authData.userType);
    if (authData.user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(authData.user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
    if (authData.employee) {
      localStorage.setItem(
        STORAGE_KEYS.EMPLOYEE,
        JSON.stringify(authData.employee)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.EMPLOYEE);
    }
  },

  /**
   * Store just the user info in localStorage
   */
  storeUser: (user: any): void => {
    if (!authUtils.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  /**
   * Store just the employee info in localStorage
   */
  storeEmployee: (employee: any): void => {
    if (!authUtils.isClient()) return;
    localStorage.setItem(STORAGE_KEYS.EMPLOYEE, JSON.stringify(employee));
  },

  /**
   * Get authentication token from localStorage
   */
  getToken: (): string | null => {
    if (!authUtils.isClient()) return null;

    return localStorage.getItem(STORAGE_KEYS.TOKEN);
  },

  /**
   * Get token ID from localStorage
   */
  getTokenId: (): string | null => {
    if (!authUtils.isClient()) return null;

    return localStorage.getItem(STORAGE_KEYS.TOKEN_ID);
  },

  /**
   * Get user type from localStorage
   */
  getUserType: (): "user" | "employee" | null => {
    if (!authUtils.isClient()) return null;

    const userType = localStorage.getItem(STORAGE_KEYS.USER_TYPE);
    return userType as "user" | "employee" | null;
  },

  /**
   * Get user info from localStorage
   */
  getUser: (): any | null => {
    if (!authUtils.isClient()) return null;
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get employee info from localStorage
   */
  getEmployee: (): any | null => {
    if (!authUtils.isClient()) return null;
    const employee = localStorage.getItem(STORAGE_KEYS.EMPLOYEE);
    return employee ? JSON.parse(employee) : null;
  },

  /**
   * Get all authentication data from localStorage
   */
  getAuthData: (): AuthData | null => {
    if (!authUtils.isClient()) return null;

    const token = authUtils.getToken();
    const tokenId = authUtils.getTokenId();
    const userType = authUtils.getUserType();
    const user = authUtils.getUser();
    const employee = authUtils.getEmployee();

    if (!token || !tokenId || !userType) {
      return null;
    }

    return {
      token,
      tokenId,
      userType,
      user,
      employee,
    };
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    if (!authUtils.isClient()) return false;

    return authUtils.getToken() !== null;
  },

  /**
   * Clear all authentication data from localStorage
   */
  clearAuth: (): void => {
    if (!authUtils.isClient()) return;

    const firstAccess = localStorage.getItem(FIRST_ACCESS_KEY);

    localStorage.clear();

    if (firstAccess) {
      localStorage.setItem(FIRST_ACCESS_KEY, firstAccess);
    }
  },

  /**
   * Get authorization header for API requests
   */
  getAuthHeader: (): string | null => {
    if (!authUtils.isClient()) return null;

    const token = authUtils.getToken();
    return token ? `Bearer ${token}` : null;
  },
};
