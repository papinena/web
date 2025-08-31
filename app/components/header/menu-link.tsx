import { Link, type LinkProps } from "react-router";
import React from "react";

interface MenuLinkProps extends LinkProps {
  children: React.ReactNode;
  className?: string;
}

export const MenuLink = React.forwardRef<HTMLAnchorElement, MenuLinkProps>(
  ({ children, ...props }, ref) => {
    return (
      <Link {...props} ref={ref}>
        {children}
      </Link>
    );
  }
);

MenuLink.displayName = "MenuLink";
