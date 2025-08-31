import { Text } from "../ui/text";
import { MenuLink } from "./menu-link";
import React from "react";

interface TextMenuItemProps {
  to: string;
  children: React.ReactNode;
}

export const TextMenuItem = React.forwardRef<
  HTMLAnchorElement,
  TextMenuItemProps
>(({ to, children, ...props }, ref) => {
  return (
    <MenuLink to={to} {...props} ref={ref}>
      <Text>{children}</Text>
    </MenuLink>
  );
});

TextMenuItem.displayName = "TextMenuItem";
