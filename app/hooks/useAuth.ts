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
    setAuthEmployeeData,
  } = useAuthStore();

  return {
    authData,
    setAuthUserData,
    setAuthEmployeeData,
    login,
    logout,
    isAuthenticated,
    isUser,
    isEmployeeAdmin,
  };
}
