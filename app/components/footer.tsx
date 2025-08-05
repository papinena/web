import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";
import { Button } from "./ui/button";
import { PlusIcon } from "lucide-react";
import { cn } from "~/lib/utils";

export function Footer({ className }: { className?: string }) {
  const { isAuthenticated } = useAuth();
  const isAuth = isAuthenticated();

  console.log(isAuth);
  return (
    <Box className={cn("relative w-full flex justify-center", className)}>
      <Button
        variant={"outline"}
        className="absolute size-18 rounded-full bottom-6"
      >
        <PlusIcon color={"#94C56F"} className="size-14" />
      </Button>
      <Box className="flex-col justify-center ml-auto items-center">
        <Text className="font-medium text-sm text-gray-400">Dúvida?</Text>
        <Box className="flex flex-row gap-1">
          <Text className="text-sm">Fale com o </Text>
          <Text className="text-sm font-medium text-gray-400">vizis?</Text>
        </Box>
      </Box>
      <Image className="w-10 h-10" src="/footer-logo.svg" />
    </Box>
  );
}
