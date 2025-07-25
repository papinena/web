import { InputWithLabel } from "../input-with-label";
import { SectionContainer } from "../section-container";
import { SectionTitle } from "../section-title";
import { Box } from "../ui/box";
import { useFormContext } from "react-hook-form";
import { Text } from "../ui/text";
import { Item } from "../register/item";
import { TelephoneInput } from "../register/telephone-input";
import { EmailInput } from "../register/email-input";
import { PasswordInput } from "../register/password-input";

export function BasicInformation() {
  const { register, formState } = useFormContext();
  const errors = formState.errors;

  return (
    <SectionContainer>
      <SectionTitle>Informações básicas</SectionTitle>
      <Box className="flex-col gap-3">
        <Item>
          <InputWithLabel
            label="Apartamento (ex: 702)"
            error={errors.telephone?.message}
            {...register("telephone")}
          />
          <InputWithLabel
            label="Bloco (se houver)"
            {...register("position")}
            error={errors.position?.message}
          />
        </Item>
        <Item>
          <InputWithLabel
            label="Data Nasc. (xx/xx/xxxx)"
            error={errors.email?.message}
            {...register("email")}
          />
          <TelephoneInput
            label="Telefone / Whatsapp"
            {...register("confirmEmail")}
            error={errors.confirmEmail?.message}
          />
        </Item>
        <Item>
          <EmailInput error={errors.email?.message} {...register("email")} />
          <EmailInput
            label="Confirme seu email*"
            {...register("confirmEmail")}
            error={errors.confirmEmail?.message}
          />
        </Item>
        <Item>
          <Box className="flex-col w-full gap-3">
            <Item>
              <PasswordInput
                label="Crie uma senha*"
                {...register("password")}
                error={errors.password?.message}
              />
              <PasswordInput
                label="Confirme sua senha*"
                {...register("confirmPassword")}
                error={errors.confirmPassword?.message}
              />
            </Item>
            <Box className="flex-col">
              <Text className="text-sm text-gray-400">8 caracteres</Text>
              <Text className="text-sm text-gray-400">
                Pelo menos 1 caracter especial
              </Text>
              <Text className="text-sm text-gray-400">
                Pelo menos 1 numeral
              </Text>
            </Box>
          </Box>
        </Item>
      </Box>
    </SectionContainer>
  );
}
