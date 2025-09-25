import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Checkbox } from "~/components/ui/checkbox";
import { MarkdownEditor } from "~/components/markdown-editor";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema, type CreatePostType } from "~/parsers/create-post";
import { useUserNewPost } from "~/hooks/useUserNewPost";
import { ThemeItem } from "~/components/theme-item";
import { ErrorMessage } from "~/components/error-message";
import { ButtonWithSpinner } from "~/components/button-with-spinner";

import { Item } from "~/components/post/item";
import { ItemLabel } from "~/components/post/item-label";
import { UploadPhotosInput } from "~/components/post/upload-photos-input";
import { SectionTitle } from "~/components/section-title";
import { PageTitle } from "~/components/page-title";
import { useMemo, useRef, useState } from "react";
import { Button } from "~/components/ui/button";

export function ExpireDateInput({
  onChange,
  isChecked,
  label,
  name,
  id,
}: {
  id?: string;
  name?: string;
  label: string;
  onChange(): void;
  isChecked: boolean;
}) {
  return (
    <Box className="gap-1.5">
      <Checkbox
        id={id}
        name={name}
        className="h-7 w-7"
        checked={isChecked}
        onCheckedChange={onChange}
      />
      <Label htmlFor={id}>{label}</Label>
    </Box>
  );
}

interface PostFormProps {
  onSave: (data: CreatePostType) => void;
  initialValues?: CreatePostType;
  isLoading?: boolean;
}

export function PostForm({ onSave, initialValues }: PostFormProps) {
  const {
    categories,
    postTypes,
    isLoading: isLoadingCategories,
  } = useUserNewPost();

  const methods = useForm<CreatePostType>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      ...initialValues,
      categories: initialValues?.categories ?? [],
      postTypes: initialValues?.postTypes ?? [],
    },
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const initialPreviews =
    initialValues?.files?.map((file) => URL.createObjectURL(file as any)) ?? [];
  const ref = useRef<HTMLInputElement>(null);
  const [customCategories, setCustomCategories] = useState<
    { id: number; label: string }[]
  >([]);

  const allCategories = useMemo(
    () => [...(categories ?? []), ...customCategories],
    [customCategories, categories]
  );

  const handleSave = (data: CreatePostType) => {
    onSave(data);
  };

  function onFilesChange(data: File[]) {
    methods.setValue("files", data);
  }

  function onAddCustomCategory() {
    const label = ref.current?.value.trim().toLowerCase();

    if (!label || !ref.current) return;

    const tagExists = categories.some((t) => t.name.toLowerCase() === label);
    if (tagExists) {
      ref.current.value = "";
      return;
    }

    const newCategory = { id: Date.now(), label };

    setCustomCategories((s) => [...s, newCategory]);

    const currentSelectedCategorys = methods.getValues("categories") ?? [];

    methods.setValue("categories", [...currentSelectedCategorys, newCategory]);

    ref.current.value = "";
  }

  return (
    <FormProvider {...methods}>
      <Box className="bg-white gap-5 flex-1 rounded-xl pt-3 px-3 pb-10 flex-col">
        <PageTitle>
          {initialValues ? "Atualizar" : "Cadastre a sua"} publicação
        </PageTitle>
        <form
          onSubmit={handleSubmit(handleSave)}
          className="flex-col gap-5 flex"
        >
          <Item>
            <ItemLabel>Fotos</ItemLabel>
            <UploadPhotosInput
              onFilesChange={onFilesChange}
              initialPreviews={initialPreviews}
              initialFiles={initialValues?.files}
            />
          </Item>
          <Item>
            <ItemLabel>Título da publicação*</ItemLabel>
            <ErrorMessage textVariant="legend" show={!!errors.title}>
              {errors.title?.message}
            </ErrorMessage>
            <Input {...register("title")} />
          </Item>
          <Item>
            <ItemLabel>
              Resumo*{" "}
              <strong className="text-xs font-medium">
                (informações mais importantes da publicação)
              </strong>
            </ItemLabel>
            <ErrorMessage textVariant="legend" show={!!errors.resume}>
              {errors.resume?.message}
            </ErrorMessage>
            <Input {...register("resume")} />
          </Item>
          <Item>
            <ItemLabel>Mais detalhes da publicação </ItemLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <MarkdownEditor
                  markdown={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </Item>
          <Item>
            <SectionTitle>Selecione a(s) categoria(s)*</SectionTitle>
            <ErrorMessage textVariant="legend" show={!!errors.categories}>
              {errors.categories?.message}
            </ErrorMessage>
            <Controller
              name="categories"
              render={({ field }) => (
                <Box className="flex-wrap gap-2">
                  {isLoadingCategories && <Text>Carregando categories...</Text>}
                  {allCategories.map((c) => (
                    <ThemeItem
                      key={c.id}
                      isSelected={field.value.some((v) => v.id === c.id)}
                      onClick={() => {
                        const arr = field.value ?? [];
                        const index = arr.findIndex((i) => i.id === c.id);
                        if (index > -1) arr.splice(index, 1);
                        else arr.push(c);
                        return field.onChange(arr);
                      }}
                    >
                      {c.label}
                    </ThemeItem>
                  ))}
                  <Item className="gap-3 flex-row justify-center items-center w-full">
                    <Label>Outro:</Label>
                    <Input
                      onKeyDownCapture={(e) => {
                        if (e.code === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          onAddCustomCategory();
                        }
                      }}
                      ref={ref}
                    />
                    <Button type="button" onClick={onAddCustomCategory}>
                      Adicionar
                    </Button>
                  </Item>
                </Box>
              )}
            />
          </Item>
          <Item>
            <SectionTitle>Selecione o tipo*</SectionTitle>
            <ErrorMessage textVariant="legend" show={!!errors.postTypes}>
              {errors.postTypes?.message}
            </ErrorMessage>
            <Controller
              name="postTypes"
              render={({ field }) => (
                <Box className="flex-wrap gap-2">
                  {isLoadingCategories && <Text>Carregando tipos...</Text>}
                  {postTypes.map((c) => (
                    <ThemeItem
                      key={c.id}
                      isSelected={field.value.some((v) => v.id === c.id)}
                      onClick={() => {
                        const arr = field.value ?? [];
                        const index = arr.findIndex((i) => i.id === c.id);
                        if (index > -1) arr.splice(index, 1);
                        else arr.push(c);
                        return field.onChange(arr);
                      }}
                    >
                      {c.label}
                    </ThemeItem>
                  ))}
                </Box>
              )}
            />
          </Item>
          <Item>
            <SectionTitle>Prazo de validade*</SectionTitle>
            <ErrorMessage textVariant="legend" show={!!errors.expiresOn}>
              {errors.expiresOn?.message}
            </ErrorMessage>
            <Controller
              name="expiresOn"
              control={methods.control}
              render={({ field }) => (
                <Box className="w-full justify-between">
                  <ExpireDateInput
                    id="3"
                    label="3 meses"
                    isChecked={field.value === 3}
                    onChange={() => field.onChange(3)}
                  />
                  <ExpireDateInput
                    id="6"
                    label="6 meses"
                    isChecked={field.value === 6}
                    onChange={() => field.onChange(6)}
                  />
                  <ExpireDateInput
                    id="Indeterminado"
                    label="Indeterminado"
                    isChecked={field.value === 9999}
                    onChange={() => field.onChange(9999)}
                  />
                </Box>
              )}
            />
          </Item>
          <Item>
            <SectionTitle>Redes Sociais relacionadas a publicação</SectionTitle>
            <Box className="w-full gap-20">
              <Box className="flex-col gap-1.5">
                <Image src="/instagram.svg" className="size-5" />
                <Input {...register("instagram")} />
              </Box>
              <Box className="flex-col gap-1.5">
                <Image src="/facebook.svg" className="size-5" />
                <Input {...register("facebook")} />
              </Box>
            </Box>
          </Item>
          <Item>
            <Controller
              name="includeTelephone"
              control={control}
              render={({ field }) => (
                <Box className="gap-1.5">
                  <Label>
                    <Checkbox
                      checked={!!field.value}
                      onCheckedChange={field.onChange}
                      className="h-7 w-7"
                      name="includeTelephone"
                    />
                    Deseja incluir o whatsapp na postagem?
                  </Label>
                </Box>
              )}
            />
          </Item>
          <ButtonWithSpinner
            type="submit"
            className="mx-20 mt-8 bg-blue-primary"
          >
            Visualizar
          </ButtonWithSpinner>
        </form>
      </Box>
    </FormProvider>
  );
}
