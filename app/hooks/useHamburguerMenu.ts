import { useAuth } from "./useAuth";

export function useHamburguerMenu() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return { handleLogout };
}
