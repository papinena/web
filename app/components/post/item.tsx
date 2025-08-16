import type { ReactNode } from "react";
import { Box } from "~/components/ui/box";
import { cn } from "~/lib/utils";

export function Item({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Box className={cn("gap-2 w-full flex-col", className)}>{children}</Box>
  );
}
