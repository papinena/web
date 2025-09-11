import { Text } from "~/components/ui/text";
import { Box } from "~/components/ui/box";
import { Controller, FormProvider } from "react-hook-form";
import { InputWithLabel } from "~/components/input-with-label";
import { NameInput } from "~/components/register/name-input";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";
import { EmailInput } from "~/components/register/email-input";
import { PasswordInput } from "~/components/register/password-input";
import { TelephoneInput } from "~/components/register/telephone-input";
import { useRegisterUser } from "~/hooks/useRegisterUser";
import { Item } from "~/components/register/item";
import { SectionTitle } from "~/components/section-title";
import { SectionContainer } from "~/components/section-container";
import { useUserRegisterData } from "~/hooks/useUserRegisterData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { BirthDateInput } from "~/components/birth-date-input";
import type { Condominium } from "~/interfaces/condominium";
import type { Tag } from "~/interfaces/tag";
import { ThemeItem } from "~/components/theme-item";
import { Form, useNavigate } from "react-router";
import { ErrorMessage } from "~/components/error-message";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { useEffect, useRef, useState } from "react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function UserForm() {
  const navigate = useNavigate();
  const {
    methods,
    onSave,
    error,
    isError,
    isPending,
    preview,
    handleFileChange,
    resetLocalStorageFields,
  } = useRegisterUser({
    onSuccess: () => {
      navigate("/register/user/submitted");
      resetLocalStorageFields();
    },
  });
  const { data, isSuccess } = useUserRegisterData();
  const [tags, setTags] = useState(data?.tags ?? []);
  const ref = useRef<HTMLInputElement>(null);

  const condominiums = data?.condominiums;

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  useEffect(() => {
    if (isSuccess && data) setTags(data.tags);
  }, [isSuccess, data]);

  function onAddCustomTag() {
    const label = ref.current?.value.toLowerCase();

    if (!label) return;

    setTags((s) => {
      const i = s.findIndex((i) => i.label.toLowerCase() === label);

      if (i > -1) return s;

      const id = s.length;

      return [...s, { id, label }];
    });

    if (!ref.current) return;

    ref.current.value = "";
  }

  return (
    <FormProvider {...methods}>
      <Form id="user-register-form" onSubmit={onSave}>
        <Box className="flex-1 flex-col w-full">
          <Box className="flex-col px-2 pb-9 pt-1.5 flex-1 bg-white rounded-lg">
            <Box className="flex-col gap-5 mx-auto">
              <Box className="flex-col gap-5">
                <Text variant="title">Seu cadastro</Text>
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
                      label="Sobrenome*"
                      error={methods.formState.errors.lastName?.message}
                      {...methods.register("lastName", { required: true })}
                    />
                  </Box>
                </Box>
              </Box>
              <SectionContainer>
                <SectionTitle>Informações básicas</SectionTitle>
                <Box className="flex-col gap-3">
                  <Item className="flex-col gap-2">
                    <Label>Condomínio</Label>
                    <ErrorMessage
                      className="mr-auto"
                      textVariant="legend"
                      show={Boolean(methods.formState.errors.condominiumId)}
                    >
                      {methods.formState.errors.condominiumId?.message}
                    </ErrorMessage>
                    <Controller
                      name="condominiumId"
                      control={methods.control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={String(field.value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecione o condomínio" />
                          </SelectTrigger>
                          <SelectContent
                            container={
                              document.getElementById("user-register-form") ??
                              undefined
                            }
                          >
                            {condominiums?.map((condo: Condominium) => (
                              <SelectItem
                                key={condo.id}
                                value={String(condo.id)}
                              >
                                {condo.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
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
                      label="Telefone / Whatsapp*"
                      {...methods.register("telephone")}
                      error={methods.formState.errors.telephone?.message}
                    />
                  </Item>
                  <Item>
                    <EmailInput
                      label="Email*"
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
                      label="Crie uma senha*"
                      {...methods.register("password")}
                      error={methods.formState.errors.password?.message}
                    />
                    <PasswordInput
                      label="Confirme sua senha*"
                      {...methods.register("confirmPassword")}
                      error={methods.formState.errors.confirmPassword?.message}
                    />
                  </Item>
                </Box>
              </SectionContainer>
              <SectionContainer>
                <Box className="flex-col gap-1.5">
                  <SectionTitle>
                    Selecione temas do seu interesse*:
                  </SectionTitle>
                  {methods.formState.errors.tags?.message && (
                    <Text className="text-red-500 text-sm">
                      {methods.formState.errors.tags.message}
                    </Text>
                  )}
                </Box>
                {tags && (
                  <Controller
                    name="tags"
                    control={methods.control}
                    render={({ field }) => (
                      <Box className="w-full flex flex-wrap gap-2">
                        {tags.map((t: Tag, i) => (
                          <ThemeItem
                            key={i}
                            isSelected={field.value.some(
                              (st) => st.id === t.id
                            )}
                            onClick={() => {
                              const arr = field.value ?? [];
                              const index = arr.findIndex((i) => i.id === t.id);
                              if (index > -1) arr.splice(index, 1);
                              else arr.push(t);
                              return field.onChange(arr);
                            }}
                          >
                            {t.label}
                          </ThemeItem>
                        ))}
                        <Item className="gap-3 w-full">
                          <Label>Outro:</Label>
                          <Input
                            onKeyDownCapture={(e) => {
                              if (e.code === "Enter") {
                                e.preventDefault();
                                e.stopPropagation();
                                onAddCustomTag();
                              }
                            }}
                            ref={ref}
                          />
                          <Button type="button" onClick={onAddCustomTag}>
                            Adicionar
                          </Button>
                        </Item>
                      </Box>
                    )}
                  />
                )}
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
