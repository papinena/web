import {
  forwardRef,
  type InputHTMLAttributes,
  type ChangeEvent,
  useState,
} from "react";
import { cn } from "~/lib/utils";
import { Box } from "./ui/box";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Text } from "./ui/text";
import { DateFormatter } from "~/utils/date-formatter";

export const BirthDateInput = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string }
>(({ label, error, onChange, ...props }, ref) => {
  const [isValidDate, setIsValidDate] = useState(true);
  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    value = value.replace(/\D/g, "");

    if (value.length > 4) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
    } else if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }

    event.target.value = value;

    if (value.length === 10) {
      const parsedDate = DateFormatter.parse(value, "dd/MM/yyyy");
      setIsValidDate(DateFormatter.isValid(parsedDate));
    } else {
      setIsValidDate(true);
    }

    if (onChange) {
      onChange(event);
    }
  };

  return (
    <Box className="flex-col gap-1.5 flex-1">
      <Label className={cn(error || !isValidDate ? "text-red-400" : "")}>
        {label}
      </Label>
      {error && (
        <Text variant="legend" className="text-red-500">
          {error}
        </Text>
      )}
      {!isValidDate && (
        <Text variant="legend" className="text-red-500">
          Data inválida
        </Text>
      )}
      <Input ref={ref} {...props} onChange={handleDateChange} />
    </Box>
  );
});
