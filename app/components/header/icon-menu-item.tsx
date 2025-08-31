import { Image } from "../ui/image";
import { MenuItemText } from "./menu-item-text";
import { MenuLink } from "./menu-link";
import React from "react";

interface IconMenuItemProps {
  to: string;
  iconSrc: string;
  children: React.ReactNode;
}

export const IconMenuItem = React.forwardRef<
  HTMLAnchorElement,
  IconMenuItemProps
>(({ to, iconSrc, children, ...props }, ref) => {
  return (
    <MenuLink to={to} className="flex items-center" {...props} ref={ref}>
      <Image src={iconSrc} className="size-6" />
      <MenuItemText>{children}</MenuItemText>
    </MenuLink>
  );
});

IconMenuItem.displayName = "IconMenuItem";
