import { Box } from "~/components/ui/box";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import type { InputHTMLAttributes } from "react";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

export function EmailInput({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  const _label = `${label ?? "Email"}`;

  return (
    <Box className="flex-col gap-1.5 flex-1">
      <Label className={cn("flex-1", error ? "text-red-400" : "")}>
        {_label}
      </Label>
      {error && (
        <Text variant="legend" className="text-red-500">
          {error}
        </Text>
      )}
      <Input type="email" {...props} />
    </Box>
  );
}
