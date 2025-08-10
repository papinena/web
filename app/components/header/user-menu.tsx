import { useHamburguerMenu } from "~/hooks/useHamburguerMenu";
import { IconMenuItem } from "./icon-menu-item";
import { TextMenuItem } from "./text-menu-item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MenuItemText } from "./menu-item-text";
import { HamburguerMenuIcon } from "./hamburguer-menu-icon";
import { LogoImage } from "./logo-image";
import {
  DropdownMenuGroup,
  DropdownMenuLabel,
} from "@radix-ui/react-dropdown-menu";

interface HamburgerMenuProps {
  onClick?: () => void;
  className?: string;
  ariaLabel?: string;
}

export function UserHamburguerMenu({
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
        <DropdownMenuItem>
          <IconMenuItem to="/" iconSrc="/image 120.svg">
            Home
          </IconMenuItem>
        </DropdownMenuItem>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconMenuItem to="/user/dashboard" iconSrc="/image 118.svg">
              Meu painel
            </IconMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <TextMenuItem to="/register/user/form">Meu Cadastro</TextMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <TextMenuItem to="/post/my-publications">
              Minhas publicações
            </TextMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <TextMenuItem to="/my-condominium">Meu condomínio</TextMenuItem>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconMenuItem to="/help" iconSrc="/image 129.svg">
              Ajudar
            </IconMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <TextMenuItem to="/faq">FAQ</TextMenuItem>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <TextMenuItem to="/contact">Fale com o Vizis</TextMenuItem>
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
