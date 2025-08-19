import { RouteContainer } from "~/components/route-container";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import faq from "~/utils/faq.json";

function Trigger({ children, ...props }: React.ComponentProps<"p">) {
  return (
    <AccordionTrigger>
      <Text className="font-bold" {...props}>
        {children}
      </Text>
    </AccordionTrigger>
  );
}

function Content({ children, ...props }: React.ComponentProps<"p">) {
  return (
    <AccordionContent className="flex flex-col gap-4">
      <Text {...props}>{children}</Text>
    </AccordionContent>
  );
}

function Item({
  children,
  value,
  ...props
}: React.ComponentProps<"p"> & { value: string }) {
  return (
    <AccordionItem value={value} className="flex flex-col gap-4">
      <Text {...props}>{children}</Text>
    </AccordionItem>
  );
}

export function FaqAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {faq.map((item, i) => {
        return (
          <Item key={item.title} value={`item-${i}`}>
            <Trigger>{item.title}</Trigger>
            <Content>{item.content}</Content>
          </Item>
        );
      })}
    </Accordion>
  );
}

export default function Faq() {
  return (
    <RouteContainer>
      <Box className="flex-1 flex-col bg-white rounded-2xl p-3 gap-3">
        <Text className="text-xl font-bold">Tire suas dúvidas</Text>
        <Box className="flex-col gap-3">
          <Text>
            Confira abaixo as perguntas mais comuns feitas pela comunidade
            Vizis.
          </Text>
          <Text>
            Se a sua dúvida não estiver por aqui, não tem problema, é só falar
            com a gente!
          </Text>
          <Text>
            📱 WhatsApp: (21) 98742-5005 📧 E-mail: atendimento@vizis.com.br
            Será um prazer ajudar você. 💚
          </Text>
        </Box>
        <FaqAccordion />
      </Box>
    </RouteContainer>
  );
}
