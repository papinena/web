import { useHamburguerMenu } from "~/hooks/useHamburguerMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MenuItemText } from "./menu-item-text";
import { HamburguerMenuIcon } from "./hamburguer-menu-icon";
import { LogoImage } from "./logo-image";
import { TextMenuItem } from "./text-menu-item";
import { IconMenuItem } from "./icon-menu-item";
import { MenuLink } from "./menu-link";
import { PlusIcon } from "lucide-react";
import { Box } from "../ui/box";
import { BulletPoint } from "./bullet-point";

interface HamburgerMenuProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function AdminHamburguerMenu({
  className = "",
  ariaLabel = "Open menu",
}: HamburgerMenuProps) {
  const { handleLogout } = useHamburguerMenu();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <HamburguerMenuIcon className={className} ariaLabel={ariaLabel} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-3 min-w-66">
        <DropdownMenuLabel className="p-1.5">
          <LogoImage />
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <MenuLink
            to="/post/admin/create"
            className="w-full flex items-center"
          >
            <PlusIcon
              color={"#94C56F"}
              className="size-6 border rounded-full border-gray-300"
            />
            <MenuItemText>Nova Publicação</MenuItemText>
          </MenuLink>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <IconMenuItem to="/" iconSrc="/image 120.svg">
            Home
          </IconMenuItem>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <IconMenuItem to="/admin/dashboard" iconSrc="/image 136.svg">
              Gestão do condomínio
            </IconMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Box>
              <BulletPoint />
              <TextMenuItem to="/admin/edit">
                Cadastro do condomínio
              </TextMenuItem>
            </Box>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Box>
              <BulletPoint />
              <TextMenuItem to="/post/admin/my-publications">
                Publicações do Condomínio
              </TextMenuItem>
            </Box>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Box>
              <BulletPoint />
              <TextMenuItem to="/post/admin/my-publications">
                Gerenciar Moradores
              </TextMenuItem>
            </Box>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <IconMenuItem to="/posts/condominium" iconSrc="/image 119.svg">
              Mural do condomínio
            </IconMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <IconMenuItem to="/help" iconSrc="/image 129.svg">
              Ajuda
            </IconMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <TextMenuItem to="/faq">FAQ</TextMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <TextMenuItem to="/vizis/contact">Fale com o Vizis</TextMenuItem>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="text-red-600 focus:bg-red-50"
        >
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
