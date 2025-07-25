import { Link, useSearchParams } from "react-router";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";

export default function Error() {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  return (
    <Box className="flex-1 h-full w-full">
      <Box className="flex  flex-1 flex-col">
        <Box className="relative items-start w-full z-1">
          <Image className="w-full" src="/Group 55.svg" />
        </Box>
        <Box className="p-5 text-center flex-col gap-5 flex rounded-2xl -mt-16 flex-1 z-1 bg-white h-full w-full">
          <Text className="text-[#C2596F] font-bold">
            OPS :-( Tente o cadastro novamente
          </Text>
          <Link
            className={`rounded-lg flex p-2 mx-5 justify-center ${
              type === "admin" ? "bg-green-primary" : "bg-blue-primary"
            }`}
            to={`/register/${type === "admin" ? "admin" : "user"}/form`}
          >
            <Text className="font-normal text-white">Cadastre-se já!</Text>
          </Link>
          <Box className="flex-col mt-12 text-start">
            <Text>📱 WhatsApp: (21) 98742-5005</Text>
            <Text> 📧 E-mail: atendimento@vizis.com.br</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
