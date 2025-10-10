import { Text } from "~/components/ui/text";
import { Box } from "~/components/ui/box";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { InputWithLabel } from "~/components/input-with-label";
import { NameInput } from "~/components/register/name-input";
import { Item } from "~/components/register/item";
import { SectionTitle } from "~/components/section-title";
import { SectionContainer } from "~/components/section-container";
import { Form, useLocation, useNavigate } from "react-router";
import { ErrorMessage } from "~/components/error-message";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { firebaseService } from "~/lib/firebase";
import { saveUnauthenticatedFcmToken } from "~/services/save-unauthenticated-fcm-token";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  type CreateSocialAdminType,
  CreateSocialAdminSchema,
} from "~/parsers/create-social-admin";
import { Terms } from "~/components/terms-of-use";
import { BasicInformation } from "~/components/admin-form/basic-information.v2";
import { CondominiumInformation } from "~/components/admin-form/condominium-information.v2";
import { EmployeesInformation } from "~/components/admin-form/employees-information.v2";
import { Textarea } from "~/components/text-area";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";
import { usePhoto } from "~/hooks/use-photo";
import { useEmployee } from "~/hooks/use-employee";

export default function AdminSocialForm() {
  const location = useLocation();
  const socialUser = location.state;

  const methods = useForm<CreateSocialAdminType>({
    resolver: zodResolver(CreateSocialAdminSchema),
    defaultValues: {
      employee: {
        name: socialUser?.name,
        email: socialUser?.email,
      },
      providerId: socialUser.providerId,
      provider: socialUser.provider,
    },
  });
  const { handleFileChange, preview } = usePhoto({
    onFileChange: (f) => methods.setValue("employee.photo", f),
  });
  const { createSocialAdminMutation } = useEmployee();

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  function onSave(data: CreateSocialAdminType) {
    createSocialAdminMutation.mutate(data);
  }

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
                      handleRemoveImage={() =>
                        methods.setValue("employee.photo", undefined)
                      }
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
              <BasicInformation.Container>
                <BasicInformation.Item>
                  <BasicInformation.BirthDate />
                  <BasicInformation.Telephone />
                </BasicInformation.Item>
                <BasicInformation.Item>
                  <BasicInformation.Position />
                  <BasicInformation.IsResident />
                </BasicInformation.Item>
                <BasicInformation.BlockAndApartment />
                <BasicInformation.Email disabled />
              </BasicInformation.Container>

              <CondominiumInformation.Container>
                <CondominiumInformation.Item className="flex-1">
                  <CondominiumInformation.Name />
                </CondominiumInformation.Item>
                <CondominiumInformation.Item>
                  <CondominiumInformation.AdministratorName />
                  <CondominiumInformation.AdministratorContact />
                </CondominiumInformation.Item>
                <CondominiumInformation.Item className="w-full">
                  <CondominiumInformation.AdministratorAddress />
                </CondominiumInformation.Item>
                <CondominiumInformation.Item>
                  <CondominiumInformation.AdministratorTelephone />
                  <CondominiumInformation.AdministratorEmail />
                </CondominiumInformation.Item>
                <CondominiumInformation.Item className="w-full">
                  <CondominiumInformation.Council />
                </CondominiumInformation.Item>
                <CondominiumInformation.Item>
                  <CondominiumInformation.DoorkeeperChief />
                  <CondominiumInformation.ReceptionTelephone />
                </CondominiumInformation.Item>
              </CondominiumInformation.Container>

              <EmployeesInformation.Container>
                <EmployeesInformation.Fields />
              </EmployeesInformation.Container>

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
              <ErrorMessage
                className="mx-auto"
                show={createSocialAdminMutation.isError}
              >
                {(createSocialAdminMutation.error as Error)?.message}
              </ErrorMessage>
              <ButtonWithSpinner
                className="bg-blue-primary hover:bg-blue-primary/90"
                type="submit"
                loading={createSocialAdminMutation.isPending}
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
