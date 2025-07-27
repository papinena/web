import type { ReactNode } from "react";
import { useNavigate } from "react-router";
import { Box } from "../ui/box";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Image } from "../ui/image";
import { Text } from "../ui/text";
import { useAuth } from "~/hooks/useAuth";

interface HamburgerMenuProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

function MenuItemText({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <Text className={`text-lg text-primary font-semibold ${className}`}>{children}</Text>
  );
}

export function HamburgerMenu({
  className = "",
  ariaLabel = "Open menu",
}: HamburgerMenuProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Box
          className={`flex flex-col justify-center items-center w-10 h-10 rounded hover:bg-gray-200 transition ${className}`}
          aria-label={ariaLabel}
        >
          <Box className="w-5 h-0.5 bg-[#AEB3B8] mb-1 rounded" />
          <Box className="w-5 h-0.5 bg-[#AEB3B8] mb-1 rounded" />
          <Box className="w-5 h-0.5 bg-[#AEB3B8] rounded" />
        </Box>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-3">
        <DropdownMenuItem>
          <Image src="/image 115.svg" />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Image src="/image 120.svg" />
          <MenuItemText>Home</MenuItemText>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Image src="/image 118.svg" />
            <MenuItemText>Meu painel</MenuItemText>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Meu cadastro</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Minhas publicações</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Meu condomínio</Text>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem>
          <Image src="/image 119.svg" />
          <MenuItemText>Mural do condomínio</MenuItemText>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Image src="/image 129.svg" />
            <MenuItemText>Ajuda</MenuItemText>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>FAQ</Text>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Text>Fale com o Vizis</Text>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Image src="/image 136.svg" />
          <MenuItemText>Gestão do condomínio</MenuItemText>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:bg-red-50">
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="mr-2 text-red-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
            />
          </svg>
          <MenuItemText className="text-red-600">Sair</MenuItemText>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
