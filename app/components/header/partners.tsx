import { DropdownMenuItem } from "../ui/dropdown-menu";
import { IconMenuItem } from "./icon-menu-item";

export function Partners() {
  return (
    <DropdownMenuItem asChild>
      <IconMenuItem to="/search?term=Benefícios Vizis" iconSrc="/image 140.svg">
        Benefícios Vizis
      </IconMenuItem>
    </DropdownMenuItem>
  );
}
