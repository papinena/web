import { TextMenuItem } from "./text-menu-item";
import { BulletPoint } from "./bullet-point";
import { DropdownMenuItem } from "../ui/dropdown-menu";

export function Faq({ setOpen }: { setOpen: any }) {
  return (
    <DropdownMenuItem>
      <BulletPoint />
      <TextMenuItem setOpen={setOpen} to="/faq">
        FAQ
      </TextMenuItem>
    </DropdownMenuItem>
  );
}
