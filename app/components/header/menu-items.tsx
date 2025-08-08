import { DropdownMenuGroup, DropdownMenuItem } from "../ui/dropdown-menu";
import { IconMenuItem } from "./icon-menu-item";
import { TextMenuItem } from "./text-menu-item";

export function MenuItems() {
  return (
    <>
      <DropdownMenuItem>
        <IconMenuItem to="/home" iconSrc="/image 120.svg">
          Home
        </IconMenuItem>
      </DropdownMenuItem>
      <DropdownMenuGroup>
        <DropdownMenuItem>
          <IconMenuItem to="/" iconSrc="/image 118.svg">
            Meu painel
          </IconMenuItem>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <TextMenuItem to="/register/user/form">Meu Cadastro</TextMenuItem>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <TextMenuItem to="/post/my-publications">Minhas publicações</TextMenuItem>
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
    </>
  );
}
