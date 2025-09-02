import { Separator } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { RouteContainer } from "~/components/route-container";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { Spinner } from "~/components/ui/spinner";
import { Text } from "~/components/ui/text";
import { UserAvatar } from "~/components/user-avatar";
import { useEmployee } from "~/hooks/use-employee";
import { useAuth } from "~/hooks/useAuth";

function Employee({
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
  block: string | null;
  apartment: string | null;
  onSelect: () => void;
  isSelected: boolean;
  is_approved: boolean;
}) {
  return (
    <Box className="flex items-center gap-4">
      <Checkbox
        className="size-8"
        onCheckedChange={onSelect}
        checked={isSelected}
      />
      <UserAvatar
        avatarUrl={avatar}
        fallbackText={name}
        fallbackProps={{ className: "rounded-lg" }}
        containerClassName="rounded-lg size-20"
        imageClassName={is_approved ? "" : "grayscale"}
      />
      <Box className="flex-col gap-1.5">
        {is_approved ? (
          <Text className="text-green-primary text-sm font-bold">Aprovado</Text>
        ) : (
          <Text className="text-sm">Reprovado</Text>
        )}
        <Text>{name}</Text>
        <Box className="text-center gap-2">
          {block && (
            <>
              <Box className="gap-1.5">
                <Text className="text-sm">Bloco</Text>
                <Text className="text-sm">{block}</Text>
              </Box>
              <Box className="pt-2.5">
                <Box className="bg-gray-500 w-2 h-[1px]" />
              </Box>
            </>
          )}
          {apartment && (
            <Box className="gap-1.5">
              <Text className="text-sm">Apartamento</Text>
              <Text className="text-sm">{apartment}</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function ManageEmployees() {
  const { authData } = useAuth();
  const {
    getCondominiumEmployeesQuery,
    handleInvalidateQuery,
    updateEmployeesMutation,
  } = useEmployee();
  const query = getCondominiumEmployeesQuery();
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
  const handleSelectEmployee = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((resId) => resId !== id) : [...prev, id]
    );
  };

  const handleUpdateStatus = (active: boolean) => {
    updateEmployeesMutation.mutate(
      {
        ids: selectedEmployees,
        data: { active },
      },
      {
        onSuccess() {
          handleInvalidateQuery(["CONDOMINIUM-EMPLOYEES"]);
        },
      }
    );
  };

  if (query.isPending) {
    return (
      <Box className="flex-1 items-center justify-center">
        <Spinner size={"lg"} />
      </Box>
    );
  }

  const employee = authData?.employee;
  const employees = query.data?.filter((e) => e.id !== employee?.id);

  return (
    <RouteContainer>
      <Box className="flex-col flex-1 bg-white rounded-2xl p-3 gap-3">
        <Text variant="title">Gerenciamento de funcionários</Text>
        <Box className="flex-col pb-12">
          {employees?.map((employee) => (
            <Box className="flex-col" key={employee.id}>
              <Employee
                avatar={employee.avatar ?? undefined}
                name={`${employee.name} ${employee.last_name}`}
                block={employee.block}
                apartment={employee.apartment}
                onSelect={() => handleSelectEmployee(employee.id)}
                isSelected={selectedEmployees.includes(employee.id)}
                is_approved={employee.active}
              />
              <Separator className="my-4" />
            </Box>
          ))}
          <Box className="w-full justify-center gap-12 mt-3 space-between">
            <Button
              variant={"admin"}
              onClick={() => handleUpdateStatus(false)}
              disabled={updateEmployeesMutation.isPending}
            >
              <Text className="text-white">Reprovar</Text>
            </Button>
            <Button
              variant={"admin"}
              onClick={() => handleUpdateStatus(true)}
              disabled={updateEmployeesMutation.isPending}
            >
              <Text className="text-white">Aprovar</Text>
            </Button>
          </Box>
        </Box>
      </Box>
    </RouteContainer>
  );
}
