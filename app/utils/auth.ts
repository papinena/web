export interface AuthData {
  token: string;
  tokenId: string;
  userType: "user" | "employee";
}

export const AUTH_KEYS = {
  TOKEN: "authToken",
  TOKEN_ID: "tokenId",
  USER_TYPE: "userType",
} as const;

export const authUtils = {
  /**
   * Check if window is defined (client-side)
   */
  isClient: (): boolean => {
    return typeof window !== 'undefined';
  },

  /**
   * Store authentication data in localStorage
   */
  storeAuth: (authData: AuthData): void => {
    if (!authUtils.isClient()) return;
    
    localStorage.setItem(AUTH_KEYS.TOKEN, authData.token);
    localStorage.setItem(AUTH_KEYS.TOKEN_ID, authData.tokenId);
    localStorage.setItem(AUTH_KEYS.USER_TYPE, authData.userType);
  },

  /**
   * Get authentication token from localStorage
   */
  getToken: (): string | null => {
    if (!authUtils.isClient()) return null;
    
    return localStorage.getItem(AUTH_KEYS.TOKEN);
  },

  /**
   * Get token ID from localStorage
   */
  getTokenId: (): string | null => {
    if (!authUtils.isClient()) return null;
    
    return localStorage.getItem(AUTH_KEYS.TOKEN_ID);
  },

  /**
   * Get user type from localStorage
   */
  getUserType: (): "user" | "employee" | null => {
    if (!authUtils.isClient()) return null;
    
    const userType = localStorage.getItem(AUTH_KEYS.USER_TYPE);
    return userType as "user" | "employee" | null;
  },

  /**
   * Get all authentication data from localStorage
   */
  getAuthData: (): AuthData | null => {
    if (!authUtils.isClient()) return null;
    
    const token = authUtils.getToken();
    const tokenId = authUtils.getTokenId();
    const userType = authUtils.getUserType();

    if (!token || !tokenId || !userType) {
      return null;
    }

    return {
      token,
      tokenId,
      userType,
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
    
    localStorage.removeItem(AUTH_KEYS.TOKEN);
    localStorage.removeItem(AUTH_KEYS.TOKEN_ID);
    localStorage.removeItem(AUTH_KEYS.USER_TYPE);
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
