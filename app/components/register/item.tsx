import type { ReactNode } from "react";
import { Box } from "../ui/box";
import { cn } from "~/lib/utils";

export function Item({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Box className={cn("gap-9", className)}>{children}</Box>;
}
