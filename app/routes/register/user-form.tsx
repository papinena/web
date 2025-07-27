import { Text } from "~/components/ui/text";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { FormProvider } from "react-hook-form";
import { InputWithLabel } from "~/components/input-with-label";
import { useState, type ReactNode } from "react";
import { NameInput } from "~/components/register/name-input";
import { UploadPhotoInput } from "~/components/register/upload-photo-input";
import { EmailInput } from "~/components/register/email-input";
import { PasswordInput } from "~/components/register/password-input";
import { TelephoneInput } from "~/components/register/telephone-input";
import { useUserForm } from "~/hooks/useUserForm";
import { Item } from "~/components/register/item";
import { cn } from "~/lib/utils";
import { Input } from "~/components/ui/input";
import { SectionTitle } from "~/components/section-title";
import { SectionContainer } from "~/components/section-container";
import { useUserRegister } from "~/hooks/useCondominiums";
import { Select } from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { BirthDateInput } from "~/components/birth-date-input";

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

export default function UserForm() {
  const { methods, onSave, isPending } = useUserForm();
  const { data: condominiums, isLoading } = useUserRegister();
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedTheme, setSelectedTheme] = useState([""]);

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

  const hasErrors = Object.keys(methods.formState.errors).length > 0;

  function handleSelectedTheme(t: string) {
    setSelectedTheme((s) => {
      const i = s.findIndex((v) => v === t);
      if (i > -1) return s.filter((v) => v !== t);
      return s.concat([t]);
    });
  }

  return (
    <FormProvider {...methods}>
      <Box className="flex-1 flex-col w-full">
        <Box className="flex-col px-2 pb-9 pt-1.5 flex-1 bg-white rounded-lg border-blue-primary border-2">
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
                    label="Nome"
                    {...methods.register("name", { required: true })}
                    error={methods.formState.errors.name?.message}
                  />
                  <InputWithLabel
                    label="Sobrenome"
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
                  <Select {...methods.register("condominiumId")}>
                    {isLoading && <option>Carregando...</option>}
                    {condominiums?.map((condo: any) => (
                      <option
                        className="text-body"
                        key={condo.id}
                        value={condo.id}
                      >
                        {condo.name}
                      </option>
                    ))}
                  </Select>
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
                <Item>
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
              <SectionTitle>Selecione temas do seu interesse*:</SectionTitle>
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
            </SectionContainer>
            {hasErrors && (
              <Box className="border-red-400 text-center p-3 border rounded-lg">
                <Text className="text-red-400">
                  Os campos em vermelho são de preenchimento obrigatório.
                </Text>
              </Box>
            )}
            <Button
              onClick={onSave}
              className="mx-20 bg-blue-primary hover:bg-green-primary/90"
              size={"lg"}
              disabled={isPending}
            >
              {isPending ? "Enviando..." : "Enviar"}
            </Button>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  );
}
