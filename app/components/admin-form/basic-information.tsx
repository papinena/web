import { InputWithLabel } from "../input-with-label";
import { SectionContainer } from "../section-container";
import { SectionTitle } from "../section-title";
import { Box } from "../ui/box";
import { Controller, useFormContext } from "react-hook-form";
import { Text } from "../ui/text";
import { Item } from "../register/item";
import { TelephoneInput } from "../register/telephone-input";
import { EmailInput } from "../register/email-input";
import { PasswordInput } from "../register/password-input";
import { IsResidentCheckbox } from "~/components/is-resident-checkbox";
import { BirthDateInput } from "~/components/birth-date-input";
import { type CreateAdminType } from "~/parsers/create-admin";

export function BasicInformation() {
  const { register, control, watch, formState } =
    useFormContext<CreateAdminType>();
  const errors = formState.errors;

  const isResident = watch("employee.isResident");

  return (
    <SectionContainer>
      <SectionTitle>Informações básicas</SectionTitle>
      <Box className="flex-col gap-3">
        <Item>
          <BirthDateInput
            label="Data de nascimento"
            error={errors.employee?.birthDate?.message}
            {...register("employee.birthDate")}
          />
          <TelephoneInput
            label="Telefone / Whatsapp"
            error={errors.employee?.telephone?.message}
            {...register("employee.telephone")}
          />
        </Item>
        <Item>
          <InputWithLabel
            label="Cargo no condomínio"
            {...register("employee.position")}
            error={errors.employee?.position?.message}
          />
          <Box className="flex-1 flex-col gap-2">
            <Controller
              name="employee.isResident"
              control={control}
              render={({ field }) => (
                <IsResidentCheckbox
                  value={field.value}
                  onChange={field.onChange}
                  error={errors.employee?.isResident?.message}
                />
              )}
            />
          </Box>
        </Item>
        {typeof isResident === "boolean" && isResident && (
          <Item>
            <InputWithLabel
              label="Bloco"
              {...register("employee.block")}
              name="block"
              error={errors.employee?.block?.message}
            />
            <InputWithLabel
              label="Apartamento"
              {...register("employee.apartment")}
              name="block"
              error={errors.employee?.apartment?.message}
            />
          </Item>
        )}
        <Item>
          <EmailInput
            error={errors.employee?.email?.message}
            {...register("employee.email")}
          />
          <EmailInput
            label="Confirme seu email*"
            {...register("employee.confirmEmail")}
            error={errors.employee?.confirmEmail?.message}
          />
        </Item>
        <Item>
          <Box className="flex-col w-full gap-3">
            <Item>
              <PasswordInput
                label="Crie uma senha*"
                {...register("employee.password")}
                error={errors.employee?.password?.message}
              />
              <PasswordInput
                label="Confirme sua senha*"
                {...register("employee.confirmPassword")}
                error={errors.employee?.confirmPassword?.message}
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
