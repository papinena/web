import {
  useFieldArray,
  useFormContext,
  type FieldValues,
} from "react-hook-form";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { InputWithLabel } from "~/components/input-with-label";
import { Item } from "~/components/register/item";
import { SectionContainer } from "~/components/section-container";
import { SectionTitle } from "~/components/section-title";
import { EmailInput } from "~/components/register/email-input";
import { Text } from "~/components/ui/text";
import { PlusIcon, XIcon } from "lucide-react";
import React from "react";

type EmployeesInformationFields = {
  employees: {
    name: string;
    email: string;
  }[];
} & FieldValues;

export function EmployeesInformation() {
  return null;
}

function Container({ children }: { children: React.ReactNode }) {
  return (
    <SectionContainer>
      <Box className="flex flex-row items-start gap-1.5 justify-start w-full">
        <SectionTitle className="flex-none">Funcionários</SectionTitle>
      </Box>
      <Text className="text-[10px]">
        (autorizados a postar pelo condomínio)
      </Text>
      <Box className="w-full flex flex-col gap-4">{children}</Box>
    </SectionContainer>
  );
}

function Fields() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<EmployeesInformationFields>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
    rules: { minLength: 1 },
  });

  return (
    <>
      {fields.map((field, index) => (
        <Box key={field.id}>
          <Item className="gap-2 items-end">
            <InputWithLabel
              label="Nome"
              {...register(`employees.${index}.name`)}
              error={errors.employees?.[index]?.name?.message}
            />
            <EmailInput
              label="Email"
              {...register(`employees.${index}.email`)}
              error={errors.employees?.[index]?.email?.message}
            />
            <Button variant="destructive" onClick={() => remove(index)}>
              <XIcon />
            </Button>
          </Item>
        </Box>
      ))}
      {errors.employees?.root?.message && (
        <Text className="text-red-500 text-sm">
          {errors.employees?.root?.message}
        </Text>
      )}
      <Button onClick={() => append({ name: "", email: "" })}>
        <PlusIcon />
      </Button>
    </>
  );
}

EmployeesInformation.Container = Container;
EmployeesInformation.Fields = Fields;
