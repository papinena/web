import { useAuthStore } from "~/stores/auth";

export function useAuth() {
  const {
    authData,
    login,
    logout,
    isAuthenticated,
    isUser,
    isEmployeeAdmin,
    setAuthUserData,
  } = useAuthStore();

  return {
    authData,
    setAuthUserData,
    login,
    logout,
    isAuthenticated,
    isUser,
    isEmployeeAdmin,
  };
}
