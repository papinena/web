import { Text } from "~/components/ui/text";
import { Box } from "~/components/ui/box";
import { FormProvider } from "react-hook-form";
import { InputWithLabel } from "~/components/input-with-label";
import { NameInput } from "~/components/register/name-input";
import { TelephoneInput } from "~/components/register/telephone-input";
import { Item } from "~/components/register/item";
import { SectionTitle } from "~/components/section-title";
import { SectionContainer } from "~/components/section-container";
import { BirthDateInput } from "~/components/birth-date-input";
import { Form, useLocation, useNavigate, useSearchParams } from "react-router";
import { ErrorMessage } from "~/components/error-message";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { EmailInput } from "~/components/register/email-input";
import { firebaseService } from "~/lib/firebase";
import { saveUnauthenticatedFcmToken } from "~/services/save-unauthenticated-fcm-token";
import type { EmployeeUIProps } from "~/interfaces/employee";
import { useEmployee } from "~/hooks/use-employee";
import type { FulFillEmployeeType } from "~/parsers/update-employee";
import { PasswordInput } from "~/components/register/password-input";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";
import { usePhoto } from "~/hooks/use-photo";

export default function AdminFulfillForm() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const state = location.state as {
    token: string;
    tokenId: string;
    userType: "employee";
    employee: EmployeeUIProps;
    avatar?: string;
  };

  console.log(state.avatar);
  const employee =
    state.employee ?? JSON.parse(searchParams.get("employee") ?? "");

  const { file, handleFileChange, preview } = usePhoto({
    defaultValues: {
      preview: state.employee?.avatar ?? employee.avatar,
    },
  });
  const { useUpdateForm, fulFillEmployeeMutation: update } = useEmployee({
    onFulFillSuccess: async (data) => {
      if (data?.email) {
        try {
          const fcmToken = await firebaseService.setupForUnauthenticatedUser();
          if (fcmToken) {
            await saveUnauthenticatedFcmToken(fcmToken, data.email);
          }
        } catch (error) {
          console.error(
            "Failed to setup or save FCM token on registration:",
            error
          );
        }
      }
      return navigate("/admin/login");
    },
  });
  const methods = useUpdateForm({
    defaultValues: {
      ...employee,
      birthDate: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();
  const { error, isError, isPending, mutate } = update;

  function onSave(form: FulFillEmployeeType) {
    mutate({ form, file, token: state.token });
  }

  const { errors } = methods.formState;
  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  return (
    <FormProvider {...methods}>
      <Form onSubmit={methods.handleSubmit(onSave)}>
        <Box className="flex-1 flex-col w-full">
          <Box className="flex-col px-2 pb-9 pt-1.5 flex-1 bg-white rounded-lg">
            <Box className="flex-col gap-5 mx-auto">
              <Box className="flex-col gap-5">
                <Text variant="title">Complete seu cadastro</Text>
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
                      {...methods.register("name", { required: true })}
                      error={methods.formState.errors.name?.message}
                    />
                    <InputWithLabel
                      label="Sobrenome"
                      error={methods.formState.errors.lastName?.message}
                      {...methods.register("lastName", { required: true })}
                    />
                  </Box>
                </Box>
              </Box>
              <SectionContainer>
                <SectionTitle>Informações básicas</SectionTitle>
                <Box className="flex-col gap-3">
                  <Item>
                    <InputWithLabel
                      label="Apartamento (ex: 702)"
                      {...methods.register("apartment")}
                      error={methods.formState.errors.apartment?.message}
                    />
                    <InputWithLabel
                      label="Bloco (se houver)"
                      {...methods.register("block")}
                      error={methods.formState.errors.block?.message}
                    />
                  </Item>
                  <Item>
                    <BirthDateInput
                      label="Data Nasc. (xx/xx/xxxx)"
                      {...methods.register("birthDate")}
                      error={methods.formState.errors.birthDate?.message}
                    />
                    <TelephoneInput
                      label="Telefone / Whatsapp*"
                      {...methods.register("telephone")}
                      error={methods.formState.errors.telephone?.message}
                    />
                  </Item>
                  <Item>
                    <EmailInput
                      label="Email*"
                      disabled
                      error={methods.formState.errors.email?.message}
                      {...methods.register("email")}
                    />
                  </Item>
                  <Item>
                    <Box className="flex-col w-full gap-3">
                      <Item>
                        <PasswordInput
                          label="Crie uma senha*"
                          {...methods.register("password")}
                          error={errors.password?.message}
                        />
                        <PasswordInput
                          label="Confirme sua senha*"
                          {...methods.register("confirmPassword")}
                          error={errors.confirmPassword?.message}
                        />
                      </Item>
                      <Box className="flex-col">
                        <Text className="text-sm text-gray-400">
                          8 caracteres
                        </Text>
                        <Text className="text-sm text-gray-400">
                          Pelo menos 1 caracter especial
                        </Text>
                        <Text className="text-sm text-gray-400">
                          Pelo menos 1 numeral
                        </Text>
                      </Box>
                    </Box>
                  </Item>
                </Box>
              </SectionContainer>
              {hasErrors && (
                <Box className="border-red-400 text-center p-3 border rounded-lg">
                  <Text className="text-red-400">
                    Os campos em vermelho são de preenchimento obrigatório.
                  </Text>
                </Box>
              )}
              <ErrorMessage className="mx-auto" show={isError}>
                {(error as Error)?.message}
              </ErrorMessage>
              <ButtonWithSpinner
                className="bg-blue-primary hover:bg-blue-primary/90"
                loading={isPending}
                type="submit"
              >
                {isPending ? "Enviando..." : "Enviar"}
              </ButtonWithSpinner>
            </Box>
          </Box>
        </Box>
      </Form>
    </FormProvider>
  );
}
