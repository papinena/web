import type { ReactNode } from "react";
import { Text } from "./ui/text";
import { cn } from "~/lib/utils";

export function SectionTitle({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Text className={cn("text-[#4B4C4D] flex-1", className)}>{children}</Text>
  );
}
