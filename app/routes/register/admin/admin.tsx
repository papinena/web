import { Button } from "~/components/register/button";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";
import { BoxWithImage } from "~/components/register/box-with-image";
import { Link } from "react-router";

export default function AdminIndex() {
  return (
    <Box className="flex-1 h-full w-full">
      <BoxWithImage
        images={
          <>
            <Image className="w-full" src="/register-admin-image-card.svg" />
            <Image
              className="absolute left-32 top-18 h-8 w-8"
              src="/Group 152.svg"
            />
          </>
        }
      >
        <Text className="text-green-primary">
          Olá, administrador do condomínio. Seja bem-vindo(a) ao Vizis!
        </Text>
        <Text className="font-bold">
          O Vizis tem uma área exclusiva para você e seu time!
        </Text>
        <Text>
          Nela você pode fazer
          <strong className="text-green-primary  mx-1">
            a gestão dos moradores, compartilhar informações
          </strong>
          relevantes sobre o condomínio,
          <strong className="text-green-primary mx-1">
            divulgar benfeitorias
          </strong>
          realizadas e se aproximar dos moradores.
        </Text>
        <Text> Aproveite!</Text>
        <Button className="bg-green-primary" />
        <Link to="/register/user">
          <Text className="font-bold">
            Se você é morador do condomínio, cadastre-se no Vizis por aqui.
          </Text>
        </Link>
      </BoxWithImage>
    </Box>
  );
}
