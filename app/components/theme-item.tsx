import type { ReactNode } from "react";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";

export function ThemeItem({
  children,
  onClick,
  isSelected,
}: {
  isSelected: boolean;
  onClick(): void;
  children: ReactNode;
}) {
  return (
    <Box
      onClick={onClick}
      className={cn(
        "border cursor-pointer justify-center items-center basis-[calc((100%-1rem)/3)] p-2 text-center border-gray-200 rounded-lg",
        isSelected ? "bg-gray-300" : ""
      )}
    >
      <Text>{children}</Text>
    </Box>
  );
}
