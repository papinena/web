import { Link } from "react-router";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";

export default function AdminIndex() {
  return (
    <Box className="flex-1 h-full w-full">
      <Box className="flex  flex-1 flex-col">
        <Box className="relative items-start w-full z-1">
          <Image className="w-full" src="/Group 55.svg" />
        </Box>
        <Box className="p-5 text-center flex-col gap-5 flex rounded-2xl -mt-16 flex-1 z-1 bg-white h-full w-full">
          <Text className="text-green-primary font-bold">
            Cadastro realizado com sucesso!
          </Text>
          <Button
            className="bg-green-primary hover:bg-green-primary/90 font-bold"
            asChild
          >
            <Link to="login">Ir para login</Link>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
