import type { ReactNode } from "react";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

export function ItemLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Text className={cn("text-sm", className)}>{children}</Text>;
}
