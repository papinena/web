import type { ChangeEvent } from "react";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Checkbox } from "~/components/ui/checkbox";
import { MarkdownEditor } from "~/components/markdown-editor";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreatePostSchema, type CreatePostType } from "~/parsers/create-post";
import { useUserNewPost } from "~/hooks/useUserNewPost";
import { ThemeItem } from "~/components/theme-item";
import { useState } from "react";
import { ErrorMessage } from "~/components/error-message";
import { XIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { createNewPost } from "~/services/create-new-post";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { useNavigate } from "react-router";
import { Button } from "~/components/ui/button";

interface Category {
  id: number;
  name: string;
}

interface PostType {
  id: number;
  name: string;
}

function useCreateNewPost({
  onSuccess,
}: {
  onSuccess?: (postId: string) => void;
}) {
  const mutation = useMutation({
    mutationKey: ["CREATE_NEW_POST"],
    mutationFn: async (data: { form: CreatePostType; files: File[] }) => {
      let filenames: { filename: string; type: "IMAGE" | "VIDEO" }[] = [];
      let tokenData: { containerUri: string; sasToken: string } | undefined,
        tokenError: { status: string; message: string } | undefined;

      if (data.files.length > 0) {
        const sasTokenData = await getSasToken();
        tokenData = sasTokenData.data;
        tokenError = sasTokenData.error;

        if (tokenError) throw new Error(tokenError.message);
        if (!tokenData) throw new Error("Token data is undefined");

        const uploadPromises = data.files.map((file) =>
          uploadImage(tokenData.containerUri, tokenData.sasToken, file)
        );
        const uploadedFilenames = await Promise.all(uploadPromises);
        filenames = uploadedFilenames.map((filename) => ({
          filename,
          type: "IMAGE",
        }));
      }

      const res = await createNewPost({
        ...data.form,
        description: data.form.description ?? null,
        media: filenames,
        social: `${data.form.instagram};${data.form.facebook}`,
      });

      if (res.status === "success") {
        return res.data?.id ?? "";
      }

      if (tokenData && filenames.length > 0) {
        const deletePromises = filenames.map(({ filename }) =>
          deleteImage(tokenData.containerUri, tokenData.sasToken, filename)
        );
        await Promise.all(deletePromises);
      }
      throw new Error(res.message + res.status);
    },
    onSuccess,
  });

  return { mutation };
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

export function Item({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <Box className={cn("gap-2 w-full flex-col", className)}>{children}</Box>
  );
}
export function ItemLabel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <Text className={cn("text-sm", className)}>{children}</Text>;
}

function UploadPhotosInput({
  previews,
  handleFileChange,
  handleRemoveImage,
}: {
  previews: string[];
  handleFileChange(e: ChangeEvent<HTMLInputElement>): void;
  handleRemoveImage(index: number): void;
}) {
  return (
    <>
      <Label
        htmlFor="photo-upload-input"
        className="h-40 w-full rounded-2xl border border-gray-300 cursor-pointer flex flex-wrap justify-center items-center gap-2 p-2"
      >
        {previews.length > 0 ? (
          previews.map((preview, index) => (
            <Box key={index} className="relative h-full flex-1">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-full w-full rounded-2xl object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute cursor-pointer top-1 right-1 rounded-full p-1 h-6 w-6 flex items-center justify-center"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </Box>
          ))
        ) : (
          <Box className="flex-col p-3 items-center">
            <Image className="h-full flex-1 ml-3 w-full" src="/image 27.svg" />
            <Text>+ foto</Text>
            <Text className="text-sm text-gray-300">até 5 fotos</Text>
          </Box>
        )}
      </Label>
      <Input
        id="photo-upload-input"
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
    </>
  );
}

export default function NewPost() {
  const navigate = useNavigate();
  const { categories, postTypes, isLoading } = useUserNewPost();
  const [previews, setPreviews] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [selectedExpire, setSelectedExpire] = useState<string | null>(null);

  const methods = useForm<CreatePostType>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      categories: [],
      postTypes: [],
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = methods;

  const { mutation } = useCreateNewPost({
    onSuccess: (postId: string) => navigate(`/post/${postId}`),
  });

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

  const onSave = (data: CreatePostType) => {
    mutation.mutate({ form: data, files });
  };

  return (
    <FormProvider {...methods}>
      <Box className="bg-white flex-1 rounded-xl pt-3 px-3 pb-10 flex-col">
        <Text>Cadastre a sua publicação</Text>
        <form onSubmit={handleSubmit(onSave)} className="flex-col gap-5 flex">
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
            <Input {...register("title")} />
            <ErrorMessage show={!!errors.title}>
              {errors.title?.message}
            </ErrorMessage>
          </Item>
          <Item>
            <ItemLabel>
              Resumo*{" "}
              <strong className="text-xs font-medium">
                (informações mais importantes da publicação)
              </strong>
            </ItemLabel>
            <Input {...register("resume")} />
            <ErrorMessage show={!!errors.resume}>
              {errors.resume?.message}
            </ErrorMessage>
          </Item>
          <Item>
            <ItemLabel>Mais detalhes da publicação </ItemLabel>
            <Controller
              name="description"
              control={control}
              render={({ field }) => <MarkdownEditor {...field} />}
            />
          </Item>
          <Item>
            <ItemLabel className="text-lg font-bold">
              Selecione a(s) categoria(s)*
            </ItemLabel>
            <Box className="flex-wrap gap-2">
              {isLoading && <Text>Carregando categories...</Text>}
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
            <ErrorMessage show={!!errors.categories}>
              {errors.categories?.message}
            </ErrorMessage>
          </Item>
          <Item>
            <ItemLabel className="text-lg font-bold">
              Selecione o tipo*
            </ItemLabel>
            <Box className="flex-wrap gap-2">
              {isLoading && <Text>Carregando tipos...</Text>}
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
            <ErrorMessage show={!!errors.postTypes}>
              {errors.postTypes?.message}
            </ErrorMessage>
          </Item>
          <Item>
            <Text className="text-lg font-bold">Prazo de validade*</Text>
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
            <ErrorMessage show={!!errors.expiresOn}>
              {errors.expiresOn?.message}
            </ErrorMessage>
          </Item>
          <Item>
            <Text className="text-lg font-bold">
              Redes Sociais relacionadas a publicação
            </Text>
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
          <ErrorMessage show={mutation.isError}>
            {(mutation.error as Error)?.message}
          </ErrorMessage>
          <ButtonWithSpinner
            loading={mutation.isPending}
            type="submit"
            className="mx-20 mt-8 bg-blue-primary"
          >
            Visualizar publicação
          </ButtonWithSpinner>
        </form>
      </Box>
    </FormProvider>
  );
}
