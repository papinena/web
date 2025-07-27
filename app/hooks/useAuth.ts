import { useCallback, useState } from "react";
import { authUtils, type AuthData } from "~/utils/auth";

export function useAuth() {
  const [authData, setAuthData] = useState<AuthData | null>(() => {
    // Initialize with auth data from localStorage
    return authUtils.getAuthData();
  });

  const login = (data: AuthData) => {
    authUtils.storeAuth(data);
    setAuthData(data);
  };

  const logout = () => {
    authUtils.clearAuth();
    setAuthData(null);
  };

  const isAuthenticated = useCallback(() => {
    if (typeof window === "undefined") return undefined;
    return authUtils.isAuthenticated();
  }, []);

  const isEmployeeAdmin = authData?.employee?.permission === "ADMIN";

  return {
    authData,
    login,
    logout,
    isAuthenticated,
    isEmployeeAdmin,
  };
}
