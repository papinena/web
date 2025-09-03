import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";
import { Box } from "./ui/box";
import { cn } from "~/lib/utils";
import { Text } from "./ui/text";
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
import { Button } from "./ui/button";

export function Terms({
  value,
  onChange,
  error,
}: {
  onChange(b: boolean): void;
  value?: boolean;
  error?: string;
}) {
  const _label = "Termos de uso";
  return (
    <Dialog>
      <Box className="flex-col">
        {error && <Text className="text-red-500">{error}</Text>}
        <Box className="gap-3 items-center">
          <Checkbox
            id="terms"
            className="h-7 w-7"
            checked={value === true}
            onCheckedChange={() => onChange(!value)}
          />
          <DialogTrigger asChild>
            <Text
              className={cn(
                "flex-1 underline cursor-pointer",
                error ? "text-red-400" : ""
              )}
            >
              {_label}
            </Text>
          </DialogTrigger>
        </Box>
      </Box>
      <DialogContent className="max-h-[80dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Termos de Uso</DialogTitle>
          <DialogDescription asChild>
            <Box className="flex flex-col gap-2 text-justify">
              <Text>
                Bem-vindo ao Vizis! Ao utilizar nosso aplicativo, você concorda
                com os seguintes termos e condições.
              </Text>
              <Text variant={"subtitle"}>1. Uso do Aplicativo</Text>
              <Text>
                O Vizis é uma plataforma para facilitar a comunicação e o
                gerenciamento em condomínios. Você concorda em usar o aplicativo
                apenas para fins legais e de maneira que não infrinja os
                direitos de, restrinja ou iniba o uso e gozo do aplicativo por
                qualquer outro usuário.
              </Text>
              <Text variant={"subtitle"}>2. Conteúdo do Usuário</Text>
              <Text>
                Você é o único responsável por todo o conteúdo que postar. Ao
                postar conteúdo, você nos concede uma licença mundial, não
                exclusiva, isenta de royalties para usar, reproduzir e exibir
                esse conteúdo em conexão com o serviço.
              </Text>
              <Text variant={"subtitle"}>3. Privacidade</Text>
              <Text>
                Nossa Política de Privacidade, que estabelece como usamos suas
                informações, pode ser encontrada em nosso site. Ao usar este
                aplicativo, você concorda com o processamento descrito e garante
                que todos os dados fornecidos por você são precisos.
              </Text>
              <Text variant={"subtitle"}>4. Modificações nos Termos</Text>
              <Text>
                Reservamo-nos o direito de modificar estes termos a qualquer
                momento. Notificaremos sobre quaisquer alterações, publicando os
                novos termos no aplicativo.
              </Text>
            </Box>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => onChange(true)}>Aceitar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
