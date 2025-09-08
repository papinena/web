import { Text } from "../ui/text";
import { MenuLink } from "./menu-link";
import React from "react";

interface TextMenuItemProps {
  to: string;
  children: React.ReactNode;
  setOpen?: (open: boolean) => void;
}

export const TextMenuItem = React.forwardRef<
  HTMLAnchorElement,
  TextMenuItemProps
>(({ to, children, setOpen, ...props }, ref) => {
  return (
    <MenuLink to={to} {...props} ref={ref} onClick={() => setOpen?.(false)}>
      <Text>{children}</Text>
    </MenuLink>
  );
});

TextMenuItem.displayName = "TextMenuItem";
