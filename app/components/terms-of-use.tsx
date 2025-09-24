import { Checkbox } from "./ui/checkbox";
import { Box } from "./ui/box";
import { cn } from "~/lib/utils";
import { Text } from "./ui/text";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "./ui/button";
import terms from "~/utils/terms-of-use.md?raw";
import { MarkdownEditor } from "./markdown-editor";

export function Terms({
  value,
  onChange,
  error,
}: {
  onChange(b: boolean): void;
  value?: boolean;
  error?: string;
}) {
  const _label = "Aceite os termos de uso";
  return (
    <Dialog>
      <Box className="flex-col">
        {error && (
          <Text variant="legend" className="text-red-500">
            {error}
          </Text>
        )}
        <Box className="gap-3 items-center">
          <Checkbox
            id="terms"
            className="h-7 w-7"
            checked={value === true}
            onCheckedChange={() => onChange(!value)}
          />
          <DialogTrigger asChild>
            <Text
              className={cn(
                "flex-1 underline cursor-pointer",
                error ? "text-red-400" : ""
              )}
            >
              {_label}
            </Text>
          </DialogTrigger>
        </Box>
      </Box>
      <DialogContent className="max-h-[80dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Termos de Uso</DialogTitle>
          <DialogDescription asChild>
            <Box className="flex flex-col gap-2 text-justify">
              <MarkdownEditor markdown={terms} readOnly />
            </Box>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => onChange(true)}>Aceitar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
