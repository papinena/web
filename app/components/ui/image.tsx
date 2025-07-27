import type { ComponentProps } from "react";
import { cn } from "~/lib/utils";

export function Image({ className, src, ...props }: ComponentProps<"img">) {
  return (
    <img
      src={src ?? "/image 113.svg"}
      className={cn("", className)}
      {...props}
    />
  );
}
