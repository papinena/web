import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";

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
      <Box
        className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={() => setShowPassword(!showPassword)}
      >
        <Text className="text-gray-500 text-sm">
          {showPassword ? "Ocultar" : "Mostrar"}
        </Text>
      </Box>
    </Box>
  );
}
