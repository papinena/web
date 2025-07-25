import { forwardRef, type InputHTMLAttributes, type ChangeEvent } from "react";
import { cn } from "~/lib/utils";
import { Box } from "./ui/box";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Text } from "./ui/text";

export const BirthDateInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
>(({ label, error, onChange, ...props }, ref) => {
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    value = value.replace(/\D/g, "");

    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    event.target.value = value;

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Box className="flex-col gap-1.5 flex-1">
      <Label className={cn(error ? "text-red-400" : "")}>{label}</Label>
      <Input ref={ref} {...props} onChange={handleDateChange} />
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </Box>
  );
});
