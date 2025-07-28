import { useState, type ReactNode } from "react";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Image } from "~/components/ui/image";
import { Separator } from "~/components/ui/separator";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminResidents } from "~/services/get-admin-residents";
import { Spinner } from "~/components/ui/spinner";
import { useAuth } from "~/hooks/useAuth";
import { updateResidentStatus } from "~/services/update-resident-status";

function Resident({
  name,
  block,
  apartment,
  avatar,
  onSelect,
  isSelected,
  is_approved,
}: {
  avatar?: string;
  name: string;
  block: string;
  apartment: string;
  onSelect: () => void;
  isSelected: boolean;
  is_approved: boolean;
}) {
  return (
    <Box>
      <Checkbox
        className="size-8"
        onCheckedChange={onSelect}
        checked={isSelected}
      />
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
        {is_approved && (
          <Text className="text-green-primary text-sm">Aprovado</Text>
        )}
      </Box>
    </Box>
  );
}

export default function Residents() {
  const { authData } = useAuth();
  const condominiumId = authData?.employee?.condominiumId;
  const [selectedResidents, setSelectedResidents] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const residentsQuery = useQuery({
    queryKey: ["admin-residents"],
    queryFn: () => getAdminResidents(condominiumId as number),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: updateResidentStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-residents"],
      });
      setSelectedResidents([]);
    },
  });

  const handleSelectResident = (id: string) => {
    setSelectedResidents((prev) =>
      prev.includes(id) ? prev.filter((resId) => resId !== id) : [...prev, id]
    );
  };

  const handleUpdateStatus = (is_approved: boolean) => {
    mutate({
      ids: selectedResidents,
      data: { is_approved },
    });
  };

  if (residentsQuery.isLoading) {
    return <Spinner />;
  }

  if (residentsQuery.isError) {
    return <Text>Ocorreu um erro ao buscar os dados</Text>;
  }

  const condominiumUsers = residentsQuery.data?.condominiumUsers.data;

  return (
    <Box className="flex-1">
      <Box className="bg-white w-full gap-5 flex-col p-1.5 rounded-lg">
        <Text className="text-lg font-semibold">
          Gerenciamento de moradores
        </Text>
        {condominiumUsers?.map((resident) => (
          <Box className="flex-col" key={resident.id}>
            <Resident
              name={`${resident.name} ${resident.last_name}`}
              block={resident.block}
              apartment={resident.apartment}
              onSelect={() => handleSelectResident(resident.id)}
              isSelected={selectedResidents.includes(resident.id)}
              is_approved={resident.is_approved}
            />
            <Separator className="my-4" />
          </Box>
        ))}
        <Box className="w-full gap-12 mt-5 space-between">
          <Button
            className={cn("flex-1 bg-red-500 hover:bg-red-500/90")}
            onClick={() => handleUpdateStatus(false)}
            disabled={isPending}
          >
            <Text className="text-white">Reprovar</Text>
          </Button>
          <Button
            className={cn("flex-1 bg-green-primary hover:bg-green-primary/90")}
            onClick={() => handleUpdateStatus(true)}
            disabled={isPending}
          >
            <Text className="text-white">Aprovar</Text>
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
