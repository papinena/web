import type { ReactNode } from "react";
import { Box } from "../ui/box";
import { cn } from "~/lib/utils";

export function BoxWithImage({
  images,
  children,
  imageContainerClassName,
}: {
  images: ReactNode;
  children: ReactNode;
  imageContainerClassName?: string;
}) {
  return (
    <Box className="flex flex-1 flex-col">
      <Box className="relative items-start w-full z-1">{images}</Box>
      <Box
        className={cn(
          "p-5 text-center flex-col gap-5 flex rounded-2xl -mt-32 flex-1 z-1 bg-white h-full w-full",
          imageContainerClassName
        )}
      >
        {children}
      </Box>
    </Box>
  );
}
