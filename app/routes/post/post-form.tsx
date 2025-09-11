import type { ChangeEvent } from "react";
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
import { useState } from "react";
import { ErrorMessage } from "~/components/error-message";
import { ButtonWithSpinner } from "~/components/button-with-spinner";

import { Item } from "~/components/post/item";
import { ItemLabel } from "~/components/post/item-label";
import { UploadPhotosInput } from "~/components/post/upload-photos-input";
import { SectionTitle } from "~/components/section-title";
import { PageTitle } from "~/components/page-title";

interface Category {
  id: number;
  name: string;
}

interface PostType {
  id: number;
  name: string;
}

export function ExpireDateInput({
  onChange,
  isChecked,
  label,
  name,
}: {
  name?: string;
  label: string;
  onChange(): void;
  isChecked: boolean;
}) {
  return (
    <Box className="gap-1.5">
      <Checkbox
        name={name}
        className="h-7 w-7"
        checked={isChecked}
        onCheckedChange={onChange}
      />
      <Label>{label}</Label>
    </Box>
  );
}

interface PostFormProps {
  onSave: (data: CreatePostType, files: File[]) => void;
  initialValues?: CreatePostType;
  isLoading?: boolean;
  previews?: string[];
}

export function PostForm({
  onSave,
  initialValues,
  previews: initialPreviews = [],
}: PostFormProps) {
  const {
    categories,
    postTypes,
    isLoading: isLoadingCategories,
  } = useUserNewPost();
  const [previews, setPreviews] = useState<string[]>(initialPreviews);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedExpire, setSelectedExpire] = useState<string | null>(``);

  const methods = useForm<CreatePostType>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  const selectedCategories = watch("categories");
  const selectedPostTypes = watch("postTypes");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).slice(0, 5);
      setFiles(newFiles);
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviews(newPreviews);
  };

  const handleSelectedCategory = (category: Category) => {
    const currentCategories = selectedCategories || [];
    const isSelected = currentCategories.some((c) => c === category.id);
    if (isSelected) {
      setValue(
        "categories",
        currentCategories.filter((c) => c !== category.id)
      );
    } else {
      setValue("categories", [...currentCategories, category.id]);
    }
  };

  const handleSelectedPostType = (postType: PostType) => {
    const currentPostTypes = selectedPostTypes || [];
    const isSelected = currentPostTypes.some((p) => p === postType.id);
    if (isSelected) {
      setValue(
        "postTypes",
        currentPostTypes.filter((p) => p !== postType.id)
      );
    } else {
      setValue("postTypes", [...currentPostTypes, postType.id]);
    }
  };

  const handleExpiresOnChange = (label: string) => {
    setSelectedExpire(label);
    const date = new Date();
    if (label === "3 meses") {
      date.setMonth(date.getMonth() + 3);
      setValue("expiresOn", date);
    } else if (label === "6 meses") {
      date.setMonth(date.getMonth() + 6);
      setValue("expiresOn", date);
    } else if (label === "Indeterminado") {
      setValue("expiresOn", new Date("9999-12-31T00:00:00.000Z"));
    }
  };

  const handleSave = (data: CreatePostType) => {
    onSave(data, files);
  };

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
              previews={previews}
              handleFileChange={handleFileChange}
              handleRemoveImage={handleRemoveImage}
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
            <Box className="flex-wrap gap-2">
              {isLoadingCategories && <Text>Carregando categories...</Text>}
              {categories.map((category) => (
                <ThemeItem
                  key={category.id}
                  isSelected={(selectedCategories || []).some(
                    (c) => c === category.id
                  )}
                  onClick={() => handleSelectedCategory(category)}
                >
                  {category.name}
                </ThemeItem>
              ))}
            </Box>
          </Item>
          <Item>
            <SectionTitle>Selecione o tipo*</SectionTitle>
            <ErrorMessage textVariant="legend" show={!!errors.postTypes}>
              {errors.postTypes?.message}
            </ErrorMessage>
            <Box className="flex-wrap gap-2">
              {isLoadingCategories && <Text>Carregando tipos...</Text>}
              {postTypes.map((postType) => (
                <ThemeItem
                  key={postType.id}
                  isSelected={(selectedPostTypes || []).some(
                    (p) => p === postType.id
                  )}
                  onClick={() => handleSelectedPostType(postType)}
                >
                  {postType.name}
                </ThemeItem>
              ))}
            </Box>
          </Item>
          <Item>
            <SectionTitle>Prazo de validade*</SectionTitle>
            <ErrorMessage textVariant="legend" show={!!errors.expiresOn}>
              {errors.expiresOn?.message}
            </ErrorMessage>
            <Box className="w-full justify-between">
              <ExpireDateInput
                label="3 meses"
                isChecked={selectedExpire === "3 meses"}
                onChange={() => handleExpiresOnChange("3 meses")}
              />
              <ExpireDateInput
                label="6 meses"
                isChecked={selectedExpire === "6 meses"}
                onChange={() => handleExpiresOnChange("6 meses")}
              />
              <ExpireDateInput
                label="Indeterminado"
                isChecked={selectedExpire === "Indeterminado"}
                onChange={() => handleExpiresOnChange("Indeterminado")}
              />
            </Box>
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
