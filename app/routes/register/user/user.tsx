import { Button } from "~/components/register/button";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";

export default function UserIndex() {
  return (
    <Box className="flex-1 h-full w-full">
      <Box className="flex  flex-1 flex-col">
        <Box className="relative items-start w-full z-1">
          <Image className="w-full" src="/register-admin-image-card.svg" />
          <Image
            className="absolute left-32 top-18 h-8 w-8"
            src="/Group 152.svg"
          />
        </Box>
        <Box className="p-5 flex-col gap-5 flex rounded-2xl text-center -mt-16 flex-1 z-1 bg-white h-full w-full">
          <Text className="text-blue-primary font-bold">
            Bem-vindo(a) ao Vizis do seu condomínio!
          </Text>
          <Text className="">
            A sua rede de apoio para resolver problemas de forma segura e
            eficiente.
          </Text>
          <Text>
            <strong className="mr-1">Gratuito</strong>e
            <strong className="ml-1">restrito ao seu condomínio</strong>, o
            Vizis é a solução para o seu dia a dia:
          </Text>
          <Text>
            <strong className="text-blue-primary mr-1">
              Comprar, vender, trocar, compartilhar
            </strong>
            e recomendar produtos e serviços na vizinhança.
          </Text>
          <Text>
            É sobre privilegiar as oportunidades ao redor e ainda contar com
            informações em tempo real sobre o que acontece em seu condominio.
          </Text>
          <Button className="bg-blue-primary" />
        </Box>
      </Box>
    </Box>
  );
}
