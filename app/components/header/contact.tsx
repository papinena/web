import { DropdownMenuItem } from "../ui/dropdown-menu";
import { BulletPoint } from "./bullet-point";
import { TextMenuItem } from "./text-menu-item";

export function Contact({ setOpen }: { setOpen: any }) {
  return (
    <DropdownMenuItem>
      <BulletPoint />
      <TextMenuItem setOpen={setOpen} to="/contact">
        Fale com o Vizis
      </TextMenuItem>
    </DropdownMenuItem>
  );
}
