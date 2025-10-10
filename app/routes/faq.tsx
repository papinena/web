import { RouteContainer } from "~/components/route-container";
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import faq from "~/utils/faq.json";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useUser } from "~/hooks/useUser";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { useEmployee } from "~/hooks/use-employee";
import { useAuth } from "~/hooks/useAuth";

export function DeleteAccountButton() {
  const { deleteAccountMutation } = useUser();
  const { deleteEmployeeAccountMutation } = useEmployee();
  const { isUser } = useAuth();

  const mutation = isUser()
    ? deleteAccountMutation
    : deleteEmployeeAccountMutation;

  return (
    <Dialog>
      <div className="flex mx-auto">
        <DialogTrigger asChild>
          <Button className="w-fit mx-auto">Cancelar conta no Vizis</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogTitle hidden>Delete account dialog</DialogTitle>
          {mutation.isSuccess ? (
            <>
              <DialogDescription asChild>
                <Text className="text-red-400 text-md">
                  Conta cancelada com sucesso! Sua conta e seus conteúdos foram
                  apagados de nossa base de dados.
                </Text>
              </DialogDescription>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogDescription asChild>
                  <Text className="text-red-400 text-md">
                    Tem certeza que deseja cancelar permanentemente sua conta no
                    Vizis? Ao fazer isso todo seu conteúdo será apagado.
                  </Text>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="flex justify-center px-20 flex-row">
                <DialogClose asChild>
                  <Button className="flex-1">Desisti de cancelar</Button>
                </DialogClose>
                <ButtonWithSpinner
                  loading={mutation.isPending}
                  onClick={() => mutation.mutate()}
                  className="flex-1 mx-0"
                >
                  Sim
                </ButtonWithSpinner>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}

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
      <AccordionItem value={`item-remove-account`}>
        <Trigger>Como faço para cancelar minha conta no Vizis?</Trigger>
        <AccordionContent className="flex flex-col gap-4">
          <Text>Para cancelar sua conta no Vizis clique no botão abaixo:</Text>
          <DeleteAccountButton />
        </AccordionContent>
      </AccordionItem>
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
            📧 E-mail: contato@vizis.co Será um prazer ajudar você. 💚
          </Text>
        </Box>
        <FaqAccordion />
      </Box>
    </RouteContainer>
  );
}
