import { InputWithLabel } from "../input-with-label";
import { SectionContainer } from "../section-container";
import { SectionTitle } from "../section-title";
import { Textarea } from "../text-area";
import { Box } from "../ui/box";
import { useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Item } from "../register/item";
import { TelephoneInput } from "../register/telephone-input";
import { EmailInput } from "../register/email-input";
import type { CreateAdminType } from "~/parsers/create-admin";

export function CondominiumInformation() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateAdminType>();

  return (
    <SectionContainer>
      <SectionTitle>Sobre o condomínio</SectionTitle>
      <Box className="w-full flex flex-wrap gap-2">
        <Item className="flex-1">
          <InputWithLabel
            label="Nome do condomínio"
            {...register("condominium.name")}
            error={errors.condominium?.name?.message}
          />
        </Item>
        <Item>
          <InputWithLabel
            label="Administradora"
            {...register("condominiumAdministrator.name")}
            error={errors.condominiumAdministrator?.name?.message}
          />
          <InputWithLabel
            label="Contato"
            {...register("condominiumAdministrator.contact")}
            error={errors.condominiumAdministrator?.contact?.message}
          />
        </Item>
        <Item className="w-full">
          <InputWithLabel
            label="Endereço da Administradora"
            {...register("condominiumAdministrator.address")}
            error={errors.condominiumAdministrator?.address?.message}
          />
        </Item>
        <Item>
          <TelephoneInput
            label="Telefone"
            {...register("condominiumAdministrator.telephone")}
            error={errors.condominiumAdministrator?.telephone?.message}
          />
          <EmailInput
            label="Email"
            {...register("condominiumAdministrator.email")}
            error={errors.condominiumAdministrator?.email?.message}
          />
        </Item>
        <Item className="w-full">
          <Box className="flex flex-1 w-full flex-col gap-1.5">
            <Label>Sub-síndico e Conselheiros</Label>
            <Textarea
              className="min-h-20"
              {...register("condominiumAdministrator.counsil")}
              error={errors.condominiumAdministrator?.counsil?.message}
            />
          </Box>
        </Item>
        <Item>
          <InputWithLabel
            label="Porteiro Chefe"
            {...register("condominiumAdministrator.doorKeeperChief")}
            error={errors.condominiumAdministrator?.doorKeeperChief?.message}
          />
          <TelephoneInput
            label="Telefone Portaria"
            {...register("condominiumAdministrator.receptionTelephone")}
            error={errors.condominiumAdministrator?.receptionTelephone?.message}
          />
        </Item>
      </Box>
    </SectionContainer>
  );
}
