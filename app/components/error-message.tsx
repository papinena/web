import type { ComponentProps } from "react";
import { Text } from "./ui/text";
import { cn } from "~/lib/utils";

export function ErrorMessage({
  className,
  children,
  show,
  ...props
}: ComponentProps<"p"> & { show: boolean }) {
  return show ? (
    <Text className={cn("text-red-500", className)} {...props}>
      {children}
    </Text>
  ) : null;
}
