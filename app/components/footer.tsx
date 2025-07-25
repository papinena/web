import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";

export function Footer({ className }: { className?: string }) {
  return (
    <Box className={className}>
      <Box className="flex-col justify-center">
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
