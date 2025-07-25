import { Text } from "~/components/ui/text";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { useForm, FormProvider } from "react-hook-form";
import { InputWithLabel } from "~/components/input-with-label";
import { BasicInformation } from "~/components/user-form/basic-information";
import { CreateAdminSchema } from "~/parsers/create-admin";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { Input } from "~/components/ui/input";
import { NameInput } from "~/components/register/name-input";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";
import { cn } from "~/lib/utils";

const themes = [
  "Alimento",
  "Eletrônico",
  "Musica",
  "Artesanato",
  "Esporte",
  "Pet",
  "Aula coletiva",
  "Festa",
  "Reciclagem",
  "Brinquedo",
  "Imóvel",
  "Roupa",
  "Costura",
  "Infantil",
  "Serviço",
  "Decoração",
  "Livro",
  "Transporte",
];

function ThemeItem({
  children,
  setSelectedTheme,
  isSelected,
}: {
  isSelected: boolean;
  setSelectedTheme(): void;
  children: ReactNode;
}) {
  return (
    <Box
      onClick={setSelectedTheme}
      className={cn(
        "border cursor-pointer justify-center basis-[calc((100%-1rem)/3)] p-2 text-center border-gray-200 rounded-lg",
        isSelected ? "bg-gray-300" : ""
      )}
    >
      <Text>{children}</Text>
    </Box>
  );
}

export default function AdminForm() {
  const [selectedTheme, setSelectedTheme] = useState([""]);
  const methods = useForm({
    defaultValues: {
      adminName: "",
      adminLastName: "",
      telephone: "",
      position: "",
      isResident: undefined,
      blockAndApartment: "",
      email: "",
      confirmEmail: "",
      password: "",
      confirmPassword: "",
      administer: "",
      contact: "",
      administerAddress: "",
      administerTelephone: "",
      administerEmail: "",
      observations: "",
      doorKeeperChief: "",
      receptionTelephone: "",
      condominiumUsefulInformation: "",
      employeeName1: "",
      employeeEmail1: "",
      employeeName2: "",
      employeeEmail2: "",
      employeeName3: "",
      employeeEmail3: "",
      photo: undefined,
    },
    resolver: zodResolver(CreateAdminSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSave = (data: any) => {
    console.log("Form submitted:", data);
  };

  const hasErrors = Object.keys(methods.formState.errors).length > 0;
  function handleSelectedTheme(t: string) {
    setSelectedTheme((s) => {
      const i = s.findIndex((v) => v === t);
      console.log(i);
      if (i > -1) return s.filter((v) => v !== t);
      return s.concat([t]);
    });
  }

  return (
    <FormProvider {...methods}>
      <Box className="flex-1 flex-col w-full">
        <Box className="flex-col  px-2 pb-9 pt-1.5 flex-1 bg-white rounded-lg border-blue-primary border-2">
          <Box className="flex-col gap-5 mx-auto">
            <Box className="flex-col gap-5">
              <Text variant="title">Seu cadastro</Text>
              <Box className="gap-5">
                <Box className="flex-col rounded-2xl">
                  <UploadPhotoInput
                    preview={preview}
                    handleFileChange={handleFileChange}
                    register={methods.register}
                  />
                </Box>
                <Box className="flex-col max-w-64 flex-1 gap-3">
                  <NameInput
                    label="Nome"
                    {...methods.register("adminName", { required: true })}
                    error={methods.formState.errors.adminName?.message}
                  />
                  <InputWithLabel
                    label="Sobrenome"
                    error={methods.formState.errors.adminLastName?.message}
                    {...methods.register("adminLastName", { required: true })}
                  />
                </Box>
              </Box>
            </Box>
            <BasicInformation />
            <Box className="flex-col w-full">
              <Text className="text-[#4B4C4D]">
                Selecione temas do seu interesse*:
              </Text>
              <Box className="w-full flex flex-wrap gap-2">
                {themes.map((t) => (
                  <ThemeItem
                    isSelected={selectedTheme.includes(t)}
                    setSelectedTheme={() => handleSelectedTheme(t)}
                    key={t}
                  >
                    {t}
                  </ThemeItem>
                ))}
                <Box className="w-full items-center gap-3">
                  <Text>Outro</Text>
                  <Input />
                </Box>
              </Box>
            </Box>
            {hasErrors && (
              <Box className="border-red-400 text-center p-3 border rounded-lg">
                <Text className="text-red-400">
                  Os campos em vermelho são de preenchimento obrigatório.
                </Text>
              </Box>
            )}
            <Button
              onClick={methods.handleSubmit(onSave)}
              className="mx-20 bg-blue-primary hover:bg-green-primary/90"
              size={"lg"}
            >
              Enviar
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
