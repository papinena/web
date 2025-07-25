import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function Image({ className, ...props }: ComponentProps<"img">) {
  return <img className={cn("", className)} {...props} />;
}
