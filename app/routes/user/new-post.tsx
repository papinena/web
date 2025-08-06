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
import { InstagramIcon, List, ListOrderedIcon } from "lucide-react";
import { Checkbox } from "~/components/ui/checkbox";

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

function TextBoxButton({
  className,
  children,
}: {
  children: string;
  className: string;
}) {
  return (
    <Button variant={"ghost"} className="size-8">
      <Text className={className}>{children}</Text>
    </Button>
  );
}

function TextBox() {
  return (
    <Box className="w-full border flex-col border-gray-300">
      <Box className="border-b border-gray-300 w-full">
        <TextBoxButton className="font-bold">B</TextBoxButton>
        <TextBoxButton className="italic">I</TextBoxButton>
        <TextBoxButton className="underline">U</TextBoxButton>
        <Button variant={"ghost"} className="size-8">
          <ListOrderedIcon />
        </Button>
        <Button variant={"ghost"} className="size-8">
          <List />
        </Button>
      </Box>
      <Box className="min-h-40 w-full">
        {/* TODO TEXTAREA WITH TEXT FORMAT OPTIONS IN MARKDOWN STYLE*/}
      </Box>
    </Box>
  );
}

export default function NewPost() {
  const { authData } = useAuth();

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
          <TextBox />
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
