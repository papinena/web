import { Text } from "../ui/text";
import { MenuLink } from "./menu-link";

interface TextMenuItemProps {
  to: string;
  children: React.ReactNode;
}

export function TextMenuItem({ to, children }: TextMenuItemProps) {
  return (
    <MenuLink to={to}>
      <Text>{children}</Text>
    </MenuLink>
  );
}
