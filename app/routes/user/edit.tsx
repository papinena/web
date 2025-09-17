import { Text } from "~/components/ui/text";
import { Box } from "~/components/ui/box";
import { Controller, FormProvider } from "react-hook-form";
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
import { useEffect, useMemo, useRef, useState } from "react";
import { DateFormatter } from "~/utils/date-formatter";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";
import { RouteContainer } from "~/components/route-container";
import { useToastStore } from "~/stores/toast";
import { Form } from "react-router";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function EditUser() {
  const { buildUrl } = useImageReadToken();
  const addToast = useToastStore((s) => s.addToast);
  const {
    handleFileChange,
    handleRemoveImage,
    updateUserForm,
    useUserEditInfo,
    updateUserMutation,
  } = useUser({
    onSuccess: () => {
      addToast({
        title: "Sucesso!",
        description: "Informações salvas",
        position: "bottom-center",
        variant: "success",
      });
    },
  });
  const query = useUserEditInfo();

  const defaultValues = useMemo(() => {
    if (!query.data) return undefined;
    return {
      ...query.data.user,
      birthDate: DateFormatter.format(query.data.user.birthDate),
      tags: query.data.userTags,
    };
  }, [query.data]);

  const methods = updateUserForm({ values: defaultValues });
  const ref = useRef<HTMLInputElement>(null);
  const [customTags, setCustomTags] = useState<Tag[]>([]);

  const allTags = useMemo(
    () => [...(query.data?.tags ?? []), ...customTags],
    [query.data?.tags, customTags]
  );

  function onAddCustomTag() {
    const label = ref.current?.value.trim().toLowerCase();

    if (!label || !ref.current) return;

    const tagExists = allTags.some((t) => t.label.toLowerCase() === label);
    if (tagExists) {
      ref.current.value = "";
      return;
    }

    const newTag = { id: Date.now(), label };

    setCustomTags((s) => [...s, newTag]);

    const currentSelectedTags = methods.getValues("tags") ?? [];
    methods.setValue("tags", [...currentSelectedTags, newTag], {
      shouldValidate: true,
    });

    ref.current.value = "";
  }

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  function onSave(data: any) {
    updateUserMutation.mutate({
      ...data,
    });
  }

  if (query.isLoading) {
    return (
      <RouteContainer>
        <Box className="flex flex-1 items-center justify-center h-full">
          <Spinner />
        </Box>
      </RouteContainer>
    );
  }

  const user = query.data?.user;
  const condominium = query.data?.condominium;
  const preview = buildUrl(user?.avatar) ?? null;

  return (
    <RouteContainer>
      <FormProvider {...methods}>
        <Form onSubmit={methods.handleSubmit(onSave)}>
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
                  </Box>
                </SectionContainer>
                <SectionContainer>
                  <SectionTitle>
                    Selecione temas do seu interesse*:
                  </SectionTitle>
                  {methods.formState.errors.tags?.message && (
                    <Text className="text-red-500 text-sm">
                      {methods.formState.errors.tags.message}
                    </Text>
                  )}
                  <Box className="w-full flex flex-wrap gap-2">
                    {allTags && (
                      <Controller
                        name="tags"
                        control={methods.control}
                        render={({ field }) => (
                          <Box className="w-full flex flex-wrap gap-2">
                            {allTags.map((t: Tag) => (
                              <ThemeItem
                                key={t.id}
                                isSelected={(field.value || []).some(
                                  (st) => st.id === t.id
                                )}
                                onClick={() => {
                                  const arr = field.value ?? [];
                                  const index = arr.findIndex(
                                    (i) => i.id === t.id
                                  );
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
                  type="submit"
                  loading={updateUserMutation.isPending}
                  className="mx-20 bg-blue-primary cursor-pointer hover:bg-blue-primary/90"
                >
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
