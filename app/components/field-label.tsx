import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Label } from "./ui/label";

export function FieldLabel({
  children,
  className,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <Label className={cn("text-[#4B4C4D] flex-1", className)}>{children}</Label>
  );
}
