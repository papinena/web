import { Link } from "react-router";
import { BoxWithImage } from "~/components/register/box-with-image";
import { Button } from "~/components/ui/button";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";

export default function AdminIndex() {
  return (
    <BoxWithImage
      imageContainerClassName="-mt-18"
      images={<Image className="w-full" src="/Group 55.svg" />}
    >
      <Text className="text-green-primary font-bold">
        Cadastro realizado com sucesso!
      </Text>
      <Button
        className="bg-green-primary hover:bg-green-primary/90 font-bold"
        asChild
      >
        <Link to="/login">Ir para login</Link>
      </Button>
    </BoxWithImage>
  );
}
