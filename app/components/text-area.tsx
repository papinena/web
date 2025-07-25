import type { TextareaHTMLAttributes } from "react";
import { cn } from "~/lib/utils";
import { Text } from "./ui/text";
import { Box } from "./ui/box";

export function Textarea({
  className,
  error,
  ...props
}: { error?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <Box className="flex-col gap-1.5 flex-1">
      <textarea
        {...props}
        className={cn(
          "appearance-none resize-none w-full rounded-lg flex-1 border border-gray-200",
          className
        )}
      />
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </Box>
  );
}
