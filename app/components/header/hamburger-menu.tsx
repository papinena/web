import type { ReactNode } from "react";
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

interface HamburgerMenuProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

function MenuItemText({ children }: { children: ReactNode }) {
  return (
    <Text className="text-lg text-primary  font-semibold">{children}</Text>
  );
}

export function HamburgerMenu({
  className = "",
  ariaLabel = "Open menu",
}: HamburgerMenuProps) {
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
