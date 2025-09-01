import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";

export function useHamburguerMenu() {
  const { logout, authData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    if (authData?.userType === "user") return navigate("/user/login");
    return navigate("/admin/login");
  };

  return { handleLogout };
}
