import type { ReactNode } from "react";
import { Text } from "../ui/text";

export function MenuItemText({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Text className={`text-lg text-primary font-semibold ${className}`}>
      {children}
    </Text>
  );
}
