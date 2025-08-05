import { Text } from "~/components/ui/text";
import { Box } from "~/components/ui/box";
import { useForm, FormProvider } from "react-hook-form";
import { InputWithLabel } from "~/components/input-with-label";
import { SectionTitle } from "~/components/section-title";
import { SectionContainer } from "~/components/section-container";
import { BasicInformation } from "~/components/admin-form/basic-information";
import { CondominiumInformation } from "~/components/admin-form/condominium-information";
import { EmployeesInformation } from "~/components/admin-form/employees-information";
import { Textarea } from "~/components/text-area";
import {
  CreateAdminSchema,
  type CreateAdminType,
} from "~/parsers/create-admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { NameInput } from "~/components/register/name-input";
import { Item } from "~/components/register/item";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";
import { useAdminForm } from "~/hooks/useAdminForm";
import { useMutation } from "@tanstack/react-query";
import { createAdmin } from "~/services/create-admin";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { ErrorMessage } from "~/components/error-message";
import { useNavigate } from "react-router";

function useRegisterAdmin({ onSuccess }: { onSuccess: () => void }) {
  const mutation = useMutation({
    mutationKey: ["CREATE-ADMIN"],
    mutationFn: async (data: { form: CreateAdminType; file: File | null }) => {
      let imageUrl = "";
      let tokenData,
        tokenError: { status: string; message: string } | undefined;

      if (data.file) {
        const sasTokenData = await getSasToken();
        tokenData = sasTokenData.data;
        tokenError = sasTokenData.error;

        if (tokenError) throw new Error(tokenError.message);

        if (tokenData) {
          imageUrl = await uploadImage(
            tokenData.containerUri,
            tokenData.sasToken,
            data.file
          );
        }
      }

      const dataToSave = {
        ...data.form,
        employee: {
          ...data.form.employee,
          photo: imageUrl,
        },
      };

      const res = await createAdmin(dataToSave);

      if (res?.error?.status === "error") {
        tokenData &&
          imageUrl &&
          (await deleteImage(
            tokenData.containerUri,
            tokenData.sasToken,
            imageUrl
          ));
        throw new Error(res?.error?.message);
      }
    },
    onSuccess,
  });

  return { mutation };
}

export default function AdminForm() {
  const navigate = useNavigate();
  const { mutation } = useRegisterAdmin({
    onSuccess: () => navigate("/register/admin/submitted"),
  });
  const { fields, setFields, preview, file, handleFileChange } = useAdminForm();
  const methods = useForm({
    defaultValues: {
      ...fields,
    },
    resolver: zodResolver(CreateAdminSchema),
  });

  const onSave = async (data: CreateAdminType) => {
    setFields(data);
    mutation.mutate({ form: data, file });
  };

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  return (
    <FormProvider {...methods}>
      <Box className="flex-1 flex-col w-full">
        <Box className="flex-col  px-2 pb-9 pt-1.5 flex-1 bg-white rounded-lg border-green-primary border-2">
          <Box className="flex-col gap-5 mx-auto">
            <Box className="flex-col gap-5">
              <Text variant="title">Cadastro da Administração</Text>
              <Box className="gap-5">
                <Box className="flex-col rounded-2xl">
                  <UploadPhotoInput
                    preview={preview}
                    handleFileChange={handleFileChange}
                  />
                </Box>
                <Box className="flex-col max-w-64 flex-1 gap-3">
                  <NameInput
                    label="Nome"
                    {...methods.register("employee.name", { required: true })}
                    error={methods.formState.errors.employee?.name?.message}
                  />
                  <InputWithLabel
                    label="Sobrenome"
                    error={methods.formState.errors.employee?.lastName?.message}
                    {...methods.register("employee.lastName", {
                      required: true,
                    })}
                  />
                </Box>
              </Box>
            </Box>
            <BasicInformation />
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
              Enviar
            </ButtonWithSpinner>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
