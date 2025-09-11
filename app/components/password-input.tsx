import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Box } from "~/components/ui/box";
import { Button } from "./ui/button";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  placeholder?: string;
  className?: string;
}

export function PasswordInput({
  placeholder,
  className,
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Box className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        className={className}
        {...props}
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
  );
}
