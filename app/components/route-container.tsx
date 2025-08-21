import { Box } from "./ui/box";
import { type ComponentProps, type ReactNode } from "react";
import { cn } from "~/lib/utils";

interface RouteContainerProps extends ComponentProps<typeof Box> {
  children: ReactNode;
}

export function RouteContainer({
  className,
  children,
  ...props
}: RouteContainerProps) {
  return (
    <Box
      className={cn(
        "bg-gray-200 flex-1 flex flex-col h-full w-full p-3 px-5 py-3 gap-3",
        className
      )}
      {...props}
    >
      {children}
    </Box>
  );
}
