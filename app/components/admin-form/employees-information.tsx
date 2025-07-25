import { InputWithLabel } from "../input-with-label";
import { SectionContainer } from "../section-container";
import { SectionTitle } from "../section-title";
import { Box } from "../ui/box";
import { Text } from "../ui/text";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Item } from "../register/item";
import { EmailInput } from "../register/email-input";
import { Button } from "../ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import type { CreateAdminType } from "~/parsers/create-admin";

export function EmployeesInformation() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CreateAdminType>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
    rules: { minLength: 1 },
  });

  return (
    <SectionContainer>
      <Box className="flex flex-row items-start gap-1.5 justify-start w-full">
        <SectionTitle className="flex-none">Funcionários</SectionTitle>
      </Box>
      <Text className="text-[10px]">
        (autorizados a postar pelo condomínio)
      </Text>
      <Box className="w-full flex flex-col gap-4">
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
      </Box>
    </SectionContainer>
  );
}
