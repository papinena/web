import { Image } from "../ui/image";
import { MenuItemText } from "./menu-item-text";
import { MenuLink } from "./menu-link";

interface IconMenuItemProps {
  to: string;
  iconSrc: string;
  children: React.ReactNode;
}

export function IconMenuItem({ to, iconSrc, children }: IconMenuItemProps) {
  return (
    <MenuLink to={to} className="flex items-center">
      <Image src={iconSrc} className="mr-2" />
      <MenuItemText>{children}</MenuItemText>
    </MenuLink>
  );
}
