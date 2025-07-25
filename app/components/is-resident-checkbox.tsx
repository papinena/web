import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { cn } from "~/lib/utils";
import { Box } from "./ui/box";
import { Text } from "./ui/text";

export function IsResidentCheckbox({
  value,
  onChange,
  error,
}: {
  onChange(b: boolean): void;
  value?: boolean;
  error?: string;
}) {
  const _label = `É morador?${error ? "*" : ""}`;
  return (
    <>
      <Label className={cn("flex-1", error ? "text-red-400" : "")}>
        {_label}
      </Label>
      <Box className="w-full gap-3">
        <Box className="gap-1.5 flex-1">
          <Checkbox
            className="h-7 w-7"
            checked={value === true}
            onCheckedChange={() => onChange(true)}
          />
          <Label>Sim</Label>
        </Box>
        <Box className="gap-1.5 flex-1">
          <Checkbox
            className="h-7 w-7"
            checked={value === false}
            onCheckedChange={() => onChange(false)}
          />
          <Label>Não</Label>
        </Box>
      </Box>
      {error && <Text className="text-red-500 text-sm">{error}</Text>}
    </>
  );
}
