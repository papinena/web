import { useQuery } from "@tanstack/react-query";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { Spinner } from "~/components/ui/spinner";
import { getUserCondominium } from "~/services/get-user-condominium";
import { SectionTitle } from "~/components/section-title";
import { SectionContainer } from "~/components/section-container";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import type { CondominiumEmployee } from "~/interfaces/condominium-details";

export default function Condominium() {
  const { buildUrl } = useImageReadToken();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-condominium"],
    queryFn: getUserCondominium,
  });

  if (isLoading) {
    return (
      <Box className="flex-1 flex-col bg-white rounded-lg p-5 items-center justify-center">
        <Spinner />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Box className="flex-1 flex-col bg-white rounded-lg p-5 items-center justify-center">
        <Text className="text-red-500">
          Erro ao carregar dados do condomínio.
        </Text>
        <Text className="text-red-500">{error?.message}</Text>
      </Box>
    );
  }

  const admin = data.condominiumAdministrator;
  const employees = data.employees.filter((e) => e.permission !== "ADMIN");
  const syndic = data.employees.find((e) => e.permission === "ADMIN");

  return (
    <Box className="flex-1 flex-col bg-white rounded-lg p-5 space-y-6">
      <Text variant="title">Meu Condomínio</Text>

      <SectionContainer>
        <SectionTitle>Administração</SectionTitle>
        <Box className="flex flex-col gap-2 text-gray-700">
          <Text>
            <span className="font-semibold">Síndico:</span> {syndic?.name}
          </Text>
          <Text>
            <span className="font-semibold">Telefone / whatsapp:</span>{" "}
            {syndic?.telephone}
          </Text>
          <Text>
            <span className="font-semibold">Email:</span> {syndic?.email}
          </Text>
        </Box>
      </SectionContainer>

      <SectionContainer>
        <SectionTitle>Equipe</SectionTitle>
        <Box className="flex flex-col gap-4">
          {employees.map((employee: CondominiumEmployee) => (
            <Box
              key={employee.id}
              className="flex items-center gap-4 p-2 border-b"
            >
              <Avatar>
                <AvatarImage
                  src={buildUrl(employee.avatar)}
                  alt={employee.name}
                />
                <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Box className="gap-3 items-center">
                <Text className="font-bold">
                  {employee.name} {employee.last_name}
                </Text>
                <Text className="text-sm text-gray-600">
                  {employee.position}
                </Text>
              </Box>
            </Box>
          ))}
          {admin.reception_telephone && (
            <Text>
              <span className="font-semibold">Recepção:</span>{" "}
              {admin.reception_telephone}
            </Text>
          )}
          {admin.door_keeper_chief && (
            <Text>
              <span className="font-semibold">Porteiro Chefe:</span>{" "}
              {admin.door_keeper_chief}
            </Text>
          )}
        </Box>
      </SectionContainer>
      <SectionContainer>
        <SectionTitle>Administradora</SectionTitle>
        <Text>
          <span className="font-semibold">Nome:</span> {admin.name}
        </Text>
        <Text>
          <span className="font-semibold">Nosso contato:</span> {admin.contact}
        </Text>
        <Text>
          <span className="font-semibold">Telefone:</span> {admin.telephone}
        </Text>
        <Text>
          <span className="font-semibold">Email:</span> {admin.contact}
        </Text>
        <Text>
          <span className="font-semibold">Endereço:</span> {admin.address}
        </Text>
      </SectionContainer>
    </Box>
  );
}
