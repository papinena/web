import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Box } from "../ui/box";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({
  label,
  error,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const _label = `${label ?? "Senha"}${error ? "*" : ""}`;

  return (
    <Box className="flex-col gap-1.5 flex-1">
      <Label className={cn("flex-1", error ? "text-red-400" : "")}>
        {_label}
      </Label>
      <Box className="relative flex items-center">
        <Input
          type={showPassword ? "text" : "password"}
          {...props}
          className="pr-10" // Add padding to prevent text from overlapping with the icon
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 h-full px-3"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </Box>
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </Box>
  );
}
