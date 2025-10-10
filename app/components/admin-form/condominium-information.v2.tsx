import { useFormContext, type FieldValues } from "react-hook-form";
import { Box } from "~/components/ui/box";
import { InputWithLabel } from "~/components/input-with-label";
import { Item } from "~/components/register/item";
import { SectionContainer } from "~/components/section-container";
import { SectionTitle } from "~/components/section-title";
import { TelephoneInput } from "~/components/register/telephone-input";
import { EmailInput } from "~/components/register/email-input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/text-area";
import { Text } from "~/components/ui/text";
import React from "react";

type CondominiumInformationFields = {
  condominium: {
    name: string;
  };
  condominiumAdministrator: {
    name: string;
    contact: string;
    address: string;
    telephone: string;
    email: string;
    counsil: string;
    doorKeeperChief: string;
    receptionTelephone: string;
  };
} & FieldValues;

export function CondominiumInformation() {
  return null;
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <SectionContainer>
      <SectionTitle>Sobre o condomínio</SectionTitle>
      <Box className="w-full flex flex-wrap gap-3">{children}</Box>
    </SectionContainer>
  );
}

function NameField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CondominiumInformationFields>();
  return (
    <InputWithLabel
      label="Nome do condomínio"
      {...register("condominium.name")}
      error={errors.condominium?.name?.message}
    />
  );
}

function AdministratorNameField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CondominiumInformationFields>();
  return (
    <InputWithLabel
      label="Administradora"
      {...register("condominiumAdministrator.name")}
      error={errors.condominiumAdministrator?.name?.message}
    />
  );
}

function AdministratorContactField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CondominiumInformationFields>();
  return (
    <InputWithLabel
      label="Nome do contato"
      {...register("condominiumAdministrator.contact")}
      error={errors.condominiumAdministrator?.contact?.message}
    />
  );
}

function AdministratorAddressField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CondominiumInformationFields>();
  return (
    <InputWithLabel
      label="Endereço da Administradora"
      {...register("condominiumAdministrator.address")}
      error={errors.condominiumAdministrator?.address?.message}
    />
  );
}

function AdministratorTelephoneField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CondominiumInformationFields>();
  return (
    <TelephoneInput
      label="Telefone"
      {...register("condominiumAdministrator.telephone")}
      error={errors.condominiumAdministrator?.telephone?.message}
    />
  );
}

function AdministratorEmailField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CondominiumInformationFields>();
  return (
    <EmailInput
      label="Email"
      {...register("condominiumAdministrator.email")}
      error={errors.condominiumAdministrator?.email?.message}
    />
  );
}

function CouncilField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CondominiumInformationFields>();
  return (
    <Box className="flex flex-1 w-full flex-col gap-1.5">
      <Label>Sub-síndico e Conselheiros</Label>
      <Textarea
        className="min-h-20"
        {...register("condominiumAdministrator.counsil")}
        error={errors.condominiumAdministrator?.counsil?.message}
      />
      <Text className="text-sm text-gray-400">
        Inclua o nome dos membros do conselho e ao lado o apartamento de cada um
      </Text>
    </Box>
  );
}

function DoorkeeperChiefField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CondominiumInformationFields>();
  return (
    <InputWithLabel
      label="Porteiro Chefe"
      {...register("condominiumAdministrator.doorKeeperChief")}
      error={errors.condominiumAdministrator?.doorKeeperChief?.message}
    />
  );
}

function ReceptionTelephoneField() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CondominiumInformationFields>();
  return (
    <TelephoneInput
      label="Telefone Portaria"
      {...register("condominiumAdministrator.receptionTelephone")}
      error={errors.condominiumAdministrator?.receptionTelephone?.message}
    />
  );
}

CondominiumInformation.Container = Container;
CondominiumInformation.Name = NameField;
CondominiumInformation.AdministratorName = AdministratorNameField;
CondominiumInformation.AdministratorContact = AdministratorContactField;
CondominiumInformation.AdministratorAddress = AdministratorAddressField;
CondominiumInformation.AdministratorTelephone = AdministratorTelephoneField;
CondominiumInformation.AdministratorEmail = AdministratorEmailField;
CondominiumInformation.Council = CouncilField;
CondominiumInformation.DoorkeeperChief = DoorkeeperChiefField;
CondominiumInformation.ReceptionTelephone = ReceptionTelephoneField;
CondominiumInformation.Item = Item;
