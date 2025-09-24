import { RouteContainer } from "~/components/route-container";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";

export default function Contact() {
  return (
    <RouteContainer>
      <Box className="flex-col bg-white rounded-2xl p-3 gap-3">
        <Text variant="title">Fale com o Vizis</Text>
        <Text>
          Ficou com alguma dúvida ou tem sugestões?
          <br />É só entrar em contato:
        </Text>
        <Text>
          📱 WhatsApp:{" "}
          <a href="https://tinyurl.com/contatovizis" className="underline">
            https://tinyurl.com/contatovizis
          </a>
          <br />
          📧 E-mail:{" "}
          <a href="mailto:contato@vizis.com.br" className="underline">
            contato@vizis.co
          </a>
          <br /> Será um prazer te ajudar 💚
        </Text>
        <Text>
          Quer indicar o Vizis para outro condomínio?
          <br /> Compartilhe nosso site:{" "}
          <a href="https://www.vizis.co" className="underline">
            www.vizis.co
          </a>
        </Text>
      </Box>
    </RouteContainer>
  );
}
