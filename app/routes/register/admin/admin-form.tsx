import { Text } from "~/components/ui/text";
import { Box } from "~/components/ui/box";
import { useForm, FormProvider, Controller } from "react-hook-form";
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
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { ErrorMessage } from "~/components/error-message";
import { Form, useNavigate } from "react-router";
import { usePhoto } from "~/hooks/use-photo";
import { useEmployee } from "~/hooks/use-employee";
import { Terms } from "~/components/terms-of-use";

export default function AdminForm() {
  const navigate = useNavigate();
  const { fields, resetLocalStorageFields, setFields } = useAdminForm();
  const { createAdminMutation: mutation } = useEmployee({
    onCreateSuccess() {
      resetLocalStorageFields();
    },
  });

  const methods = useForm({
    defaultValues: {
      ...fields,
    },
    resolver: zodResolver(CreateAdminSchema),
  });
  const { file, handleFileChange, preview } = usePhoto();

  const onSave = async (data: CreateAdminType) => {
    setFields(data);
    mutation.mutate({ form: data, file });
  };

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSave)}>
        <Box className="flex-1 flex-col w-full">
          <Box className="flex-col px-2 pb-9 pt-1.5 flex-1 bg-white rounded-lg">
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
                      label="Nome*"
                      {...methods.register("employee.name", { required: true })}
                      error={methods.formState.errors.employee?.name?.message}
                    />
                    <InputWithLabel
                      label="Sobrenome*"
                      error={
                        methods.formState.errors.employee?.lastName?.message
                      }
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
                <Text className="text-sm text-gray-400">
                  Ex: bombeiro, polícia, eletricista do prédio, local para
                  descarte de pilhas/baterias e remédios, horário da adm, etc
                </Text>
              </SectionContainer>
              <Controller
                name="terms"
                control={methods.control}
                render={({ field }) => (
                  <Terms
                    value={Boolean(field.value)}
                    onChange={field.onChange}
                    error={methods.formState.errors.terms?.message}
                  />
                )}
              />
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
                className="bg-blue-primary hover:bg-blue-primary/90"
                type="submit"
                loading={mutation.isPending}
              >
                Enviar
              </ButtonWithSpinner>
            </Box>
          </Box>
        </Box>
      </Form>
    </FormProvider>
  );
}
