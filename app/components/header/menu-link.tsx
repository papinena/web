import { Link } from "react-router";

interface MenuLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

export function MenuLink({ to, children, className }: MenuLinkProps) {
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}
