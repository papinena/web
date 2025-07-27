import { useAuth } from "~/hooks/useAuth";
import { Box } from "../ui/box";
import { Image } from "../ui/image";
import { Avatar } from "./avatar";
import { HamburgerMenu } from "./hamburger-menu";

export function Header() {
  const { isAuthenticated } = useAuth();
  const isAuth = isAuthenticated();
  return (
    <Box className="w-full min-h-12 bg-white flex items-center justify-between">
      <Image src="/image 2.svg" />
      {isAuth && (
        <Box className="items-center justify-center">
          <Avatar
            size={32}
            className="ml-auto"
            name="John Doe"
            email="john.doe@example.com"
          />
          <HamburgerMenu />
        </Box>
      )}
    </Box>
  );
}
