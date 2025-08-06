import type { ChangeEvent } from "react";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { useAuth } from "~/hooks/useAuth";
import type { ReactNode } from "react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { MarkdownEditor } from "~/components/markdown-editor";

export function ExpireDateInput({
  onChange,
  isChecked,
  label,
}: {
  label: string;
  onChange(): void;
  isChecked: boolean;
}) {
  return (
    <Box className="gap-1.5">
      <Checkbox
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
  preview,
  handleFileChange,
}: {
  preview: string | null;
  handleFileChange(e: ChangeEvent<HTMLInputElement>): void;
}) {
  return (
    <>
      <Label
        htmlFor="photo-upload-input"
        className="h-40 w-full rounded-2xl border border-gray-300 cursor-pointer  flex flex-col justify-center items-center"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className="max-w-full w-full h-full flex-1 rounded-2xl object-cover"
          />
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
        onChange={handleFileChange}
      />
    </>
  );
}

import { useUserNewPost } from "~/hooks/useUserNewPost";
import { ThemeItem } from "~/components/theme-item";
import { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface PostType {
  name: string;
  id: number;
}

export default function NewPost() {
  const { authData } = useAuth();
  const { categories, postTypes, isLoading } = useUserNewPost();
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [selectedPostTypes, setSelectedPostTypes] = useState<PostType[]>([]);

  const handleSelectedCategory = (category: Category) => {
    setSelectedCategories((prev) => {
      const isSelected = prev.some((t) => t.id === category.id);
      if (isSelected) {
        return prev.filter((t) => t.id !== category.id);
      }
      return [...prev, category];
    });
  };

  const handleSelectedPostType = (postType: PostType) => {
    setSelectedPostTypes((prev) => {
      const isSelected = prev.some((pt) => pt.id === postType.id);
      if (isSelected) {
        return prev.filter((pt) => pt.id !== postType.id);
      }
      return [...prev, postType];
    });
  };

  return (
    <Box className="bg-white flex-1 rounded-xl pt-3 px-3 pb-10 flex-col">
      <Text>Cadastre a sua publicação</Text>
      <Box className="flex-col gap-5">
        <Item>
          <ItemLabel>Fotos</ItemLabel>
          <UploadPhotosInput preview={null} handleFileChange={() => {}} />
        </Item>
        <Item>
          <ItemLabel>Título da publicação*</ItemLabel>
          <Input />
        </Item>
        <Item>
          <ItemLabel>
            Descrição*{" "}
            <strong className="text-xs font-medium">
              (informações mais importantes da publicação)
            </strong>
          </ItemLabel>
          <Input />
        </Item>
        <Item>
          <ItemLabel>Mais detalhes da publicação </ItemLabel>
          <MarkdownEditor />
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
                isSelected={selectedCategories.some(
                  (t) => t.id === category.id
                )}
                onClick={() => handleSelectedCategory(category)}
              >
                {category.name}
              </ThemeItem>
            ))}
          </Box>
        </Item>
        <Item>
          <ItemLabel className="text-lg font-bold">Selecione o tipo*</ItemLabel>
          <Box className="flex-wrap gap-2">
            {isLoading && <Text>Carregando tipos...</Text>}
            {postTypes.map((postType) => (
              <ThemeItem
                key={postType.id}
                isSelected={selectedPostTypes.some(
                  (pt) => pt.id === postType.id
                )}
                onClick={() => handleSelectedPostType(postType)}
              >
                {postType.name}
              </ThemeItem>
            ))}
          </Box>
        </Item>
        <Item>
          <Text className="text-lg font-bold">Prazo de validade*</Text>
          <Box className="w-full justify-between">
            <ExpireDateInput label="3 meses" />
            <ExpireDateInput label="6 meses" />
            <ExpireDateInput label="Indeterminado" />
          </Box>
        </Item>
        <Item>
          <Text className="text-lg font-bold">
            Redes Sociais relacionadas a publicação
          </Text>
          <Box className="w-full gap-20">
            <Box className="flex-col gap-1.5">
              <Image src="/instagram.svg" className="size-5" />
              <Input />
            </Box>
            <Box className="flex-col gap-1.5">
              <Image src="/facebook.svg" className="size-5" />
              <Input />
            </Box>
          </Box>
        </Item>
        <Button className="mx-20 mt-8 bg-blue-primary">
          Visualizar publicação
        </Button>
      </Box>
    </Box>
  );
}
