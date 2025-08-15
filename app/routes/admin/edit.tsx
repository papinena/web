import { FormProvider, useForm } from "react-hook-form";
import { InputWithLabel } from "~/components/input-with-label";
import { NameInput } from "~/components/register/name-input";
import { SectionTitle } from "~/components/section-title";
import { SectionContainer } from "~/components/section-container";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getAdminEditInfo } from "~/services/get-admin-edit-info";
import { useEffect, useState } from "react";
import { Spinner } from "~/components/ui/spinner";
import { BasicInformation } from "~/components/admin-form/basic-information";
import { CondominiumInformation } from "~/components/admin-form/condominium-information";
import { EmployeesInformation } from "~/components/admin-form/employees-information";
import { Item } from "~/components/register/item";
import { Textarea } from "~/components/text-area";
import {
  UpdateAdminSchema,
  type UpdateAdminType,
} from "~/parsers/update-admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "~/components/error-message";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";

function useAdminEdit() {
  const query = useQuery({
    queryKey: ["admin-edit-info"],
    queryFn: getAdminEditInfo,
  });

  const mutation = useMutation({
    mutationKey: ["UPDATE_ADMIN"],
  });

  return {
    query,
    mutation,
  };
}

export default function EditAdmin() {
  const { query, mutation } = useAdminEdit();
  const [file, setFile] = useState<File | null>(null);
  const methods = useForm<UpdateAdminType>({
    resolver: zodResolver(UpdateAdminSchema),
  });

  useEffect(() => {
    if (query.isSuccess) {
      const { employee, condominium, condominiumAdministrator, employees } =
        query.data;
      methods.reset({
        employee: {
          name: employee.name,
          lastName: employee.lastName,
          telephone: employee.telephone,
          position: employee.position,
          isResident: employee.isResident,
          email: employee.email,
          photo: employee.avatar,
          block: employee.block,
          apartment: employee.apartment,
        },
        condominium: {
          name: condominium?.name,
        },
        condominiumAdministrator: {
          name: condominiumAdministrator?.name,
          contact: condominiumAdministrator?.contact,
          address: condominiumAdministrator?.address,
          telephone: condominiumAdministrator?.telephone,
          counsil: condominiumAdministrator?.counsil,
          doorKeeperChief: condominiumAdministrator?.doorKeeperChief,
          receptionTelephone: condominiumAdministrator?.receptionTelephone,
          email: condominiumAdministrator?.email,
        },
        employees: employees
          ?.filter((e) => e.id !== employee.id)
          .map((e) => ({
            name: e.name,
            email: e.email,
          })),
      });
    }
  }, [query.isSuccess, methods.reset, query.data]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const newFile = e.target.files[0];
      setFile(newFile);
    } else {
      setFile(null);
    }
  };

  const onSave = (data: UpdateAdminType) => {
    console.log(data);
    // mutation.mutate(data);
  };

  if (query.isLoading) {
    return (
      <Box className="flex flex-1 items-center justify-center h-full">
        <Spinner />
      </Box>
    );
  }

  const employee = query.data?.employee;
  const condominium = query.data?.condominium;
  const hasErrors = Object.keys(methods.formState.errors).length > 0;
  const isSyndic = employee?.permission === "ADMIN";

  return (
    <FormProvider {...methods}>
      <Box className="flex-1 flex-col w-full">
        <Box className="flex-col px-2 pb-9 pt-1.5 flex-1 bg-white rounded-lg border-green-primary border-2">
          <Box className="flex-col gap-5 mx-auto">
            <Box className="flex-col gap-5">
              <Text variant="title">Cadastro Administração</Text>
              <Box className="gap-5">
                <Box className="flex-col rounded-2xl">
                  <UploadPhotoInput
                    preview={employee?.avatar ?? null}
                    handleFileChange={handleFileChange}
                  />
                </Box>
                <Box className="flex-col max-w-64 flex-1">
                  <Text className="text-2xl font-bold">{employee?.name}</Text>
                  {isSyndic ? (
                    <Text className="text-green-primary">
                      Síndico com Condomínio {condominium?.name}
                    </Text>
                  ) : (
                    <Text className="text-green-primary">
                      Condomínio {condominium?.name}
                    </Text>
                  )}
                </Box>
              </Box>
            </Box>
            <BasicInformation isEditing />
            {isSyndic && (
              <>
                <CondominiumInformation />
                <EmployeesInformation />
                <SectionContainer>
                  <SectionTitle>
                    Inclua informações úteis para o condomínio
                  </SectionTitle>
                  <Item className="w-full">
                    <Textarea
                      className="min-h-20"
                      {...methods.register("condominium.usefulInformation")}
                    />
                  </Item>
                </SectionContainer>
              </>
            )}
            {hasErrors && (
              <Box className="border-red-400 text-center p-3 border rounded-lg">
                <Text className="text-red-400">
                  Os campos em vermelho são de preenchimento obrigatório.
                </Text>
              </Box>
            )}
            <ErrorMessage className="mx-auto" show={mutation.isError}>
              {(mutation.error as Error)?.message}
            </ErrorMessage>
            <ButtonWithSpinner
              loading={mutation.isPending}
              onClick={methods.handleSubmit(onSave)}
            >
              Salvar Alterações
            </ButtonWithSpinner>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
