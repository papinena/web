import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
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
  const navigate = useNavigate();

  function _logout(url?: string) {
    queryClient.removeQueries();
    logout();
    const redirectUrl = url ?? isUser() ? "/user/login" : "/admin/login";

    navigate(redirectUrl);
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
