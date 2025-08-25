import { FormProvider, useForm } from "react-hook-form";
import { SectionTitle } from "~/components/section-title";
import { SectionContainer } from "~/components/section-container";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminEditInfo } from "~/services/get-admin-edit-info";
import { useEffect, useState } from "react";
import { Spinner } from "~/components/ui/spinner";
import { BasicInformation } from "~/components/admin-form/basic-information";
import { CondominiumInformation } from "~/components/admin-form/condominium-information";
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
import { updateAdmin, type UpdateAdminPayload } from "~/services/update-admin";
import { EmployeeMapper } from "~/mappers/employee";
import { CondominiumAdministratorMapper } from "~/mappers/condominium-administrator";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";
import { DateFormatter } from "~/utils/date-formatter";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { RouteContainer } from "~/components/route-container";

import { useAuth } from "~/hooks/useAuth";
import { useToastStore } from "~/stores/toast";
import { Form } from "react-router";

function useAdminEdit() {
  const { setAuthEmployeeData } = useAuth();
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ["admin-edit-info"],
    queryFn: getAdminEditInfo,
  });
  const addToast = useToastStore((s) => s.addToast);

  const mutation = useMutation({
    mutationKey: ["UPDATE_ADMIN"],
    mutationFn: async ({
      form,
      file,
    }: {
      form: UpdateAdminType;
      file: File | null;
    }) => {
      let avatarFilename: string | undefined | null = undefined;
      let tokenData: { containerUri: string; sasToken: string } | undefined,
        tokenError: { status: string; message: string } | undefined;

      try {
        if (file) {
          const sasTokenData = await getSasToken();
          tokenData = sasTokenData.data;
          tokenError = sasTokenData.error;

          if (tokenError) throw new Error(tokenError.message);
          if (!tokenData) throw new Error("Token data is undefined");

          avatarFilename = await uploadImage(
            tokenData.containerUri,
            tokenData.sasToken,
            file
          );
        } else if (form.employee.photo === null) {
          avatarFilename = null;
        }

        const payload: UpdateAdminPayload = {
          employee: EmployeeMapper.toAPI({
            ...form.employee,
            avatar: avatarFilename,
            birthDate: DateFormatter.parse(form.employee.birthDate),
          }),
        };

        if (form.condominium) {
          payload.condominium = form.condominium;
        }

        if (form.condominiumAdministrator) {
          payload.condominiumAdministrator =
            CondominiumAdministratorMapper.toAPI(form.condominiumAdministrator);
        }
        /*
        if (form.employees) {
          payload.employees = form.employees;
        }*/

        return await updateAdmin(payload);
      } catch (error) {
        if (tokenData && avatarFilename) {
          await deleteImage(
            tokenData.containerUri,
            tokenData.sasToken,
            avatarFilename
          );
        }
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["admin-edit-info"] });
      setAuthEmployeeData(data.data.employee.data);
      addToast({ title: "Sucesso!", description: "Informações salvas" });
    },
  });

  return {
    query,
    mutation,
  };
}

export default function EditAdmin() {
  const { query, mutation } = useAdminEdit();
  const { buildUrl } = useImageReadToken();
  const [file, setFile] = useState<File | null>(null);
  const methods = useForm<UpdateAdminType>({
    resolver: zodResolver(UpdateAdminSchema),
  });

  useEffect(() => {
    if (query.isSuccess) {
      const { employee, condominium, condominiumAdministrator } = query.data;
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
          birthDate: DateFormatter.format(employee.birthDate),
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
        } /*
        employees: employees
          ?.filter((e) => e.id !== employee.id)
          .map((e) => ({
            name: e.name,
            email: e.email,
          })),*/,
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
    mutation.mutate({ form: data, file });
  };

  if (query.isLoading) {
    return (
      <RouteContainer>
        <Box className="flex flex-1 items-center justify-center h-full">
          <Spinner />
        </Box>
      </RouteContainer>
    );
  }

  const employee = query.data?.employee;
  const condominium = query.data?.condominium;
  const hasErrors = Object.keys(methods.formState.errors).length > 0;
  const isSyndic = employee?.permission === "ADMIN";
  const preview = buildUrl(employee?.avatar ?? "");

  return (
    <RouteContainer>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSave)}>
          <Box className="flex-1 flex-col w-full">
            <Box className="flex-col px-2 pb-9 pt-1.5 flex-1 bg-white rounded-lg border-green-primary border-2">
              <Box className="flex-col gap-5 mx-auto">
                <Box className="flex-col gap-5">
                  <Text variant="title">Cadastro Administração</Text>
                  <Box className="gap-5">
                    <Box className="flex-col rounded-2xl">
                      <UploadPhotoInput
                        preview={preview}
                        handleFileChange={handleFileChange}
                      />
                    </Box>
                    <Box className="flex-col max-w-64 flex-1">
                      <Text className="text-2xl font-bold">
                        {employee?.name}
                      </Text>
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
                <ButtonWithSpinner type="submit" loading={mutation.isPending}>
                  Salvar Alterações
                </ButtonWithSpinner>
              </Box>
            </Box>
          </Box>
        </Form>
      </FormProvider>
    </RouteContainer>
  );
}
