import { Box } from "~/components/ui/box";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Checkbox } from "~/components/ui/checkbox";
import { MarkdownEditor } from "~/components/markdown-editor";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateAdminPostSchema,
  type CreateAdminPostType,
} from "~/parsers/create-admin-post";
import { ErrorMessage } from "~/components/error-message";
import { Button } from "~/components/ui/button";
import { SectionTitle } from "~/components/section-title";
import { Item } from "~/components/post/item";
import { ItemLabel } from "~/components/post/item-label";
import { UploadPhotosInput } from "~/components/post/upload-photos-input";
import type { UpdateAdminPostType } from "~/parsers/update-admin-post";

interface PostFormProps {
  onSave: (data: CreateAdminPostType | UpdateAdminPostType) => void;
  initialValues?: CreateAdminPostType;
  isLoading?: boolean;
  previews?: string[];
  files?: File[];
}

export function AdminPostForm({ onSave, initialValues }: PostFormProps) {
  const methods = useForm<CreateAdminPostType>({
    resolver: zodResolver(CreateAdminPostSchema),
    defaultValues: initialValues,
    values: initialValues,
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleSave = (data: CreateAdminPostType | UpdateAdminPostType) => {
    onSave({ ...data });
  };

  function onPhotoChange(files: File[]) {
    methods.setValue("photos", files);
  }

  const files = initialValues?.photos;
  const previews = files?.map((f) => URL.createObjectURL(f));

  return (
    <FormProvider {...methods}>
      <Box className="bg-white flex-1 rounded-xl pt-3 px-3 pb-10 flex-col">
        <SectionTitle>Publicação do condomínio</SectionTitle>
        <form
          onSubmit={handleSubmit(handleSave)}
          className="flex-col gap-5 flex mt-3"
        >
          <Item>
            <ItemLabel>Fotos</ItemLabel>
            <UploadPhotosInput
              onFilesChange={onPhotoChange}
              initialFiles={files}
              initialPreviews={previews}
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
            <Box className="gap-3 flex-col">
              <Label>
                <strong>Urgente?</strong> Merece notificação em Tempo Real?
              </Label>
              <Box className="gap-12">
                <Controller
                  name="priority"
                  control={control}
                  render={({ field }) => (
                    <Box className="flex gap-12">
                      <Box className="flex items-center gap-2">
                        <Checkbox
                          id="notify-sim"
                          checked={field.value === "HIGH"}
                          onCheckedChange={() => field.onChange("HIGH")}
                          className="h-7 w-7"
                        />
                        <Label htmlFor="notify-sim">Sim</Label>
                      </Box>
                      <Box className="flex items-center gap-2">
                        <Checkbox
                          id="notify-nao"
                          checked={field.value === "NORMAL"}
                          onCheckedChange={() => field.onChange("NORMAL")}
                          className="h-7 w-7"
                        />
                        <Label htmlFor="notify-nao">Não</Label>
                      </Box>
                    </Box>
                  )}
                ></Controller>
              </Box>
              <ErrorMessage show={!!errors.priority}>
                {errors.priority?.message}
              </ErrorMessage>
            </Box>
          </Item>

          <Button type="submit" className="mx-20 mt-8 bg-green-primary">
            Visualizar
          </Button>
        </form>
      </Box>
    </FormProvider>
  );
}
