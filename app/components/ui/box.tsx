import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function Box({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div className={cn("flex", className)} {...props}>
      {children}
    </div>
  );
}
