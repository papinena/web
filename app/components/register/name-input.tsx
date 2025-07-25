import type { InputHTMLAttributes } from "react";
import { Box } from "../ui/box";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

export function NameInput({
  label,
  error,
  ...props
}: {
  label?: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>) {
  const _label = `${label ?? "Nome"}${error ? "*" : ""}`;
  return (
    <Box className="flex-col gap-1.5 flex-1">
      <Label className={cn("flex-1", error ? "text-red-400" : "")}>
        {_label}
      </Label>
      <Input {...props} />
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </Box>
  );
}
