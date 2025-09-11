import type { ComponentProps } from "react";
import { Text, type TextProps } from "./ui/text";
import { cn } from "~/lib/utils";

export function ErrorMessage({
  className,
  children,
  show,
  textVariant = "default",
  ...props
}: ComponentProps<"p"> & {
  textVariant?: TextProps["variant"];
  color?: TextProps["color"];
  show: boolean;
}) {
  return show ? (
    <Text
      variant={textVariant}
      className={cn("text-red-500", className)}
      {...props}
    >
      {children}
    </Text>
  ) : null;
}
