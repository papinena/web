import { useNavigate } from "react-router";
import { useAuth } from "./useAuth";

export function useHamburguerMenu() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return { handleLogout };
}
