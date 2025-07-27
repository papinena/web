import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Image } from "~/components/ui/image";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";
import { cn } from "~/lib/utils";

function Widget({ children }: { children: ReactNode }) {
  return (
    <Box className="border-2 rounded-xl gap-2 px-2 pb-5 pt-2 min-h-28 flex-col border-green-primary">
      {children}
    </Box>
  );
}
function WidgetTitle({
  children,
  className = "",
  icon,
}: {
  className?: string;
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Box className="gap-1.5 items-center ">
      {icon} <Text className={cn("text-lg", className)}>{children}</Text>
    </Box>
  );
}

function Resident({
  name,
  block,
  apartment,
  avatar,
}: {
  avatar?: string;
  name: string;
  block: string;
  apartment: string;
}) {
  return (
    <Box>
      <Checkbox className="size-8" />
      <Image className="size-20" src={avatar} />
      <Box className="flex-col gap-2">
        <Text>{name}</Text>
        <Box className="text-center gap-2">
          <Box className="gap-1.5">
            <Text className="text-sm">Bloco</Text>
            <Text className="text-sm">{block}</Text>
          </Box>
          <Box className="pt-2.5">
            <Box className="bg-gray-500 w-2 h-[1px]" />
          </Box>
          <Box className="gap-1.5">
            <Text className="text-sm">Apartamento</Text>
            <Text className="text-sm">{apartment}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default function Dashboard() {
  return (
    <Box className="flex-1">
      <Box className="bg-white w-full gap-5 flex-col p-1.5 rounded-lg">
        <Text className="text-lg font-semibold">
          Gerenciamento de moradores
        </Text>
        <Box className="flex-col">
          <Resident name="Pedro Salgado" block="A" apartment="320 A" />
          <Separator className="my-4" />
        </Box>
        <Box className="flex-col">
          <Resident name="Pedro Salgado" block="A" apartment="320 A" />
          <Separator className="my-4" />
        </Box>
        <Box className="flex-col">
          <Resident name="Pedro Salgado" block="A" apartment="320 A" />
          <Separator className="my-4" />
        </Box>
        <Box className="w-full gap-12 mt-5 space-between">
          <Button
            className={cn("flex-1 bg-green-primary hover:bg-green-primary/90")}
          >
            <Text className="text-white">Excluir</Text>
          </Button>
          <Button
            className={cn("flex-1 bg-green-primary hover:bg-green-primary/90")}
          >
            <Text className="text-white">Aprovar</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
