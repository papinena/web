import { useState, useEffect } from "react";
import { authUtils, type AuthData } from "~/utils/auth";

export function useAuth() {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth data on mount
    const data = authUtils.getAuthData();
    setAuthData(data);
    setIsLoading(false);
  }, []);

  const login = (data: AuthData) => {
    authUtils.storeAuth(data);
    setAuthData(data);
  };

  const logout = () => {
    authUtils.clearAuth();
    setAuthData(null);
  };

  const isAuthenticated = () => {
    return authUtils.isAuthenticated();
  };

  return {
    authData,
    isLoading,
    login,
    logout,
    isAuthenticated,
  };
} 