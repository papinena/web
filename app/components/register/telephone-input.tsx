import { Box } from "~/components/ui/box";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { forwardRef, type InputHTMLAttributes } from "react";
import { Text } from "../ui/text";
import { cn } from "~/lib/utils";

const formatTelephone = (value: string) => {
  if (!value) return "";
  // 1. Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, "");

  // 2. Apply the mask (XX) XXXXX-XXXX
  if (digitsOnly.length <= 2) {
    return `(${digitsOnly}`;
  }
  if (digitsOnly.length <= 7) {
    return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(2)}`;
  }
  // 3. Ensure the input doesn't exceed the max length
  return `(${digitsOnly.slice(0, 2)}) ${digitsOnly.slice(
    2,
    7
  )}-${digitsOnly.slice(7, 11)}`;
};

export const TelephoneInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
>(({ label, error, onChange, ...props }, ref) => {
  const _label = `${label ?? "Telefone"}${error ? "*" : ""}`;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Format the input value
    const formatted = formatTelephone(event.target.value);
    // Update the input's value in the DOM
    event.target.value = formatted;

    // Pass the modified event to react-hook-form's onChange
    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Box className="flex-col gap-1.5 flex-1">
      <Label className={cn("flex-1", error ? "text-red-400" : "")}>
        {_label}
      </Label>
      <Input {...props} onChange={handleInputChange} ref={ref} />
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </Box>
  );
});

TelephoneInput.displayName = "TelephoneInput";
