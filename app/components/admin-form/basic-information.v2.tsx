import { Controller, useFormContext, type FieldValues } from "react-hook-form";
import { BirthDateInput } from "~/components/birth-date-input";
import { Box } from "~/components/ui/box";
import { InputWithLabel } from "~/components/input-with-label";
import { IsResidentCheckbox } from "~/components/is-resident-checkbox";
import { Item } from "~/components/register/item";
import { SectionContainer } from "~/components/section-container";
import { SectionTitle } from "~/components/section-title";
import { TelephoneInput } from "~/components/register/telephone-input";
import { EmailInput } from "~/components/register/email-input";
import { PasswordInput } from "~/components/register/password-input";
import { Text } from "~/components/ui/text";
import React from "react";

type BasicInformationFields = {
  employee: {
    birthDate: string;
    telephone: string;
    position: string;
    isResident: boolean;
    block: string;
    apartment: string;
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
  };
} & FieldValues;

export function BasicInformation() {
  return null;
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <SectionContainer>
      <SectionTitle>Informações básicas</SectionTitle>
      <Box className="flex-col gap-3">{children}</Box>
    </SectionContainer>
  );
}

function BirthDateField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BasicInformationFields>();
  return (
    <BirthDateInput
      label="Data de nascimento"
      error={errors.employee?.birthDate?.message}
      {...register("employee.birthDate")}
    />
  );
}

function TelephoneField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BasicInformationFields>();
  return (
    <TelephoneInput
      label="Telefone / Whatsapp*"
      error={errors.employee?.telephone?.message}
      {...register("employee.telephone")}
    />
  );
}

function PositionField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<BasicInformationFields>();
  return (
    <InputWithLabel
      label="Cargo no condomínio*"
      {...register("employee.position")}
      error={errors.employee?.position?.message}
    />
  );
}

function IsResidentField() {
  const {
    control,
    formState: { errors },
  } = useFormContext<BasicInformationFields>();
  return (
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
  );
}

function BlockAndApartmentFields() {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<BasicInformationFields>();
  const isResident = watch("employee.isResident");

  if (typeof isResident !== "boolean" || !isResident) {
    return null;
  }

  return (
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
  );
}

function EmailField({
  isEditing = false,
  ...props
}: {
  disabled?: boolean;
  value?: string;
  isEditing?: boolean;
}) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BasicInformationFields>();

  if (isEditing) {
    return null;
  }

  return (
    <EmailInput
      label="Email*"
      error={errors.employee?.email?.message}
      {...register("employee.email")}
      {...props}
    />
  );
}

function ConfirmEmailField({ isEditing = false }: { isEditing?: boolean }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BasicInformationFields>();

  if (isEditing) {
    return null;
  }

  return (
    <EmailInput
      label="Confirme seu email*"
      {...register("employee.confirmEmail")}
      error={errors.employee?.confirmEmail?.message}
    />
  );
}

function PasswordFields({ isEditing = false }: { isEditing?: boolean }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<BasicInformationFields>();

  if (isEditing) {
    return null;
  }

  return (
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
          <Text className="text-sm text-gray-400">Pelo menos 1 numeral</Text>
        </Box>
      </Box>
    </Item>
  );
}

BasicInformation.Container = Container;
BasicInformation.BirthDate = BirthDateField;
BasicInformation.Telephone = TelephoneField;
BasicInformation.Position = PositionField;
BasicInformation.IsResident = IsResidentField;
BasicInformation.BlockAndApartment = BlockAndApartmentFields;
BasicInformation.Email = EmailField;
BasicInformation.ConfirmEmail = ConfirmEmailField;
BasicInformation.Password = PasswordFields;
BasicInformation.Item = Item;
