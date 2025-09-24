import { useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  function _logout() {
    queryClient.removeQueries();
    logout();
  }

  return {
    authData,
    setAuthUserData,
    setAuthEmployeeData,
    login,
    logout: _logout,
    isAuthenticated,
    isUser,
    isEmployeeAdmin,
  };
}
