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
import type { Tag } from "~/interfaces/tag";
import { ThemeItem } from "~/components/theme-item";
import { useUser } from "~/hooks/useUser";
import { Spinner } from "~/components/ui/spinner";
import { useEffect } from "react";
import { DateFormatter } from "~/utils/date-formatter";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";

export default function EditUser() {
  const { buildUrl } = useImageReadToken();
  const {
    handleFileChange,
    handleRemoveImage,
    file,
    selectedTheme,
    setSelectedTheme,
    updateUserForm,
    useUserEditInfo,
    handleSelectedTheme,
    updateUserMutation,
  } = useUser({
    onSuccess: () => {
      /* Handle success */
    },
  });
  const query = useUserEditInfo();
  const methods = updateUserForm({});

  useEffect(() => {
    if (query.isSuccess) {
      methods.reset({
        ...query.data.user,
        birthDate: DateFormatter.format(query.data.user.birthDate),
      });
      setSelectedTheme(query.data.userTags);
    }
  }, [query.isSuccess, methods.reset]);

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  function onSave(data: any) {
    updateUserMutation.mutate({
      ...data,
      tags: selectedTheme.map((t) => t.id),
    });
  }

  if (query.isLoading) {
    return (
      <Box className="flex flex-1 items-center justify-center h-full">
        <Spinner />
      </Box>
    );
  }

  const tags = query.data?.tags;
  const user = query.data?.user;
  const condominium = query.data?.condominium;
  const preview = buildUrl(user?.avatar) ?? null;

  return (
    <FormProvider {...methods}>
      <Box className="flex-1 flex-col w-full">
        <Box className="flex-col px-2 pb-9 pt-1.5 flex-1 bg-white rounded-lg border-blue-primary border-2">
          <Box className="flex-col gap-5 mx-auto">
            <Box className="flex-col gap-5">
              <Text variant="title">Editar Cadastro</Text>
              <Box className="gap-5">
                <Box className="flex-col rounded-2xl">
                  <UploadPhotoInput
                    preview={preview}
                    handleFileChange={handleFileChange}
                    handleRemoveImage={handleRemoveImage}
                  />
                </Box>
                <Box className="flex-col">
                  <Text className="text-2xl font-bold">{user?.name}</Text>
                  <Text className="text-blue-primary">
                    Condomínio {condominium?.name}
                  </Text>
                  <Box>
                    <Text className="text-blue-primary">
                      Bloco {user?.block}, Apartamento {user?.apartment}
                    </Text>
                  </Box>
                </Box>
              </Box>
            </Box>
            <SectionContainer>
              <SectionTitle>Informações básicas</SectionTitle>
              <Box className="flex-col gap-3">
                <Item>
                  <NameInput
                    label="Nome"
                    {...methods.register("name", { required: true })}
                    error={methods.formState.errors.name?.message}
                  />
                  <InputWithLabel
                    label="Sobrenome"
                    error={methods.formState.errors.lastName?.message}
                    {...methods.register("lastName", { required: true })}
                  />
                </Item>
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
                    label="Telefone / Whatsapp"
                    {...methods.register("telephone")}
                    error={methods.formState.errors.telephone?.message}
                  />
                </Item>
                {/* <Item>
                  <EmailInput
                    error={methods.formState.errors.email?.message}
                    {...methods.register("email")}
                  />
                  <EmailInput
                    label="Confirme seu email*"
                    {...methods.register("confirmEmail")}
                    error={methods.formState.errors.confirmEmail?.message}
                  />
                </Item>
                <Item>
                  <PasswordInput
                    label="Nova senha"
                    {...methods.register("password")}
                    error={methods.formState.errors.password?.message}
                  />
                  <PasswordInput
                    label="Confirme a nova senha"
                    {...methods.register("confirmPassword")}
                    error={methods.formState.errors.confirmPassword?.message}
                  />
                </Item> */}
              </Box>
            </SectionContainer>
            <SectionContainer>
              <SectionTitle>Selecione temas do seu interesse*:</SectionTitle>
              <Box className="w-full flex flex-wrap gap-2">
                {tags?.map((t: Tag) => (
                  <ThemeItem
                    isSelected={selectedTheme.some((st) => st.id === t.id)}
                    onClick={() => handleSelectedTheme(t)}
                    key={t.id}
                  >
                    {t.label}
                  </ThemeItem>
                ))}
              </Box>
            </SectionContainer>
            {hasErrors && (
              <Box className="border-red-400 text-center p-3 border rounded-lg">
                <Text className="text-red-400">
                  Os campos em vermelho são de preenchimento obrigatório.
                </Text>
              </Box>
            )}
            <ButtonWithSpinner
              onClick={methods.handleSubmit(onSave)}
              loading={updateUserMutation.isPending}
              className="mx-20 bg-blue-primary cursor-pointer hover:bg-blue-primary/90"
            >
              Salvar Alterações
            </ButtonWithSpinner>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
