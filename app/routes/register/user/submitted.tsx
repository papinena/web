import { BoxWithImage } from "~/components/register/box-with-image";
import { Image } from "~/components/ui/image";
import { Text } from "~/components/ui/text";

export default function Submitted() {
  return (
    <BoxWithImage
      imageContainerClassName="-mt-18"
      images={<Image className="w-full" src="/Group 55.svg" />}
    >
      <Text className="text-blue-primary font-bold">
        Cadastro realizado com sucesso!
      </Text>
      <Text>
        Para garantir sua segurança, o acesso será aprovado pela Administração
        do Condomínio. Assim que liberado, você passa a contar com uma rede de
        apoio para chamar de sua :-)
      </Text>
    </BoxWithImage>
  );
}
