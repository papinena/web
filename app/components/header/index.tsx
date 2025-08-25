import { useAuth } from "~/hooks/useAuth";
import { Box } from "../ui/box";
import { Image } from "../ui/image";
import { Avatar } from "./avatar";
import { SearchInput } from "./search-input";
import { AdminHamburguerMenu } from "./admin-menu";
import { UserHamburguerMenu } from "./user-menu";
import { Link, useNavigate } from "react-router";

export function Header() {
  const { isAuthenticated, isUser } = useAuth();
  const navigate = useNavigate();

  function onAvatarClick() {
    const url = isUser() ? "/user/edit" : "/admin/edit";
    navigate(url);
  }

  return (
    <Box className="w-full px-3 min-h-12 bg-white flex items-center justify-between">
      <Link to="/">
        <Image src="/image 2.svg" />
      </Link>

      {isAuthenticated() && (
        <>
          <Box className="py-3 mr-3">
            <SearchInput placeholder="Buscar..." />
          </Box>
          <Box className="items-center justify-center">
            <Avatar
              onClick={onAvatarClick}
              size={32}
              className="ml-auto cursor-pointer"
            />
            {isUser() ? <UserHamburguerMenu /> : <AdminHamburguerMenu />}
          </Box>
        </>
      )}
    </Box>
  );
}
