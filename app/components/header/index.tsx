import { useAuth } from "~/hooks/useAuth";
import { Box } from "../ui/box";
import { Image } from "../ui/image";
import { Avatar } from "./avatar";
import { SearchInput } from "./search-input";
import { AdminHamburguerMenu } from "./admin-menu";
import { UserHamburguerMenu } from "./user-menu";
import { Link } from "react-router";

export function Header() {
  const { isAuthenticated, isUser } = useAuth();

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
            <Avatar size={32} className="ml-auto" />
            {isUser() ? <UserHamburguerMenu /> : <AdminHamburguerMenu />}
          </Box>
        </>
      )}
    </Box>
  );
}
