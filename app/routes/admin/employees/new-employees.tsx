import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouteContainer } from "~/components/route-container";
import { Box } from "~/components/ui/box";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {
  CreateEmployeesSchema,
  type CreateEmployeesType,
} from "~/parsers/create-employees";
import { InputWithLabel } from "~/components/input-with-label";
import { ErrorMessage } from "~/components/error-message";
import { useEmployee } from "~/hooks/use-employee";
import { PlusIcon, XIcon } from "lucide-react";
import { Item } from "~/components/register/item";
import { useAuth } from "~/hooks/useAuth";
import { TelephoneInput } from "~/components/register/telephone-input";
import { ButtonWithSpinner } from "~/components/button-with-spinner";
import { useNavigate } from "react-router";

export default function NewEmployees() {
  const [formError, setFormError] = useState<string>("");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateEmployeesType>({
    resolver: zodResolver(CreateEmployeesSchema),
    defaultValues: {
      employees: [{ name: "", email: "", phone: "" }],
    },
  });
  const { authData } = useAuth();
  const condominiumId = Number(authData?.employee?.condominiumId);
  const navigate = useNavigate();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "employees",
  });

  const { createEmployeesMutation: mutation } = useEmployee({
    onCreateEmployeesSuccess: (data) => {
      if (data.error) {
        setFormError(data.error.message);
        return;
      }

      reset();
      navigate("/admin/employees");
    },
    onCreateEmployeesError: (error) => {
      setFormError(error.message);
    },
  });

  const onSubmit = (data: CreateEmployeesType) => {
    setFormError("");
    mutation.mutate({ employees: data.employees, condominiumId });
  };

  return (
    <RouteContainer>
      <Box className="flex-col flex-1 bg-white rounded-2xl p-3 gap-3">
        <Text variant="title">Gerenciamento de Funcionários</Text>
        <Text>
          Inclua os funcionários autorizados a publicar em nome do condomínio e
          gerenciar os moradores habilitados para utilizar o Vizis.{" "}
        </Text>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4 mt-4"
        >
          {fields.map((field, index) => (
            <Box key={field.id} className="flex-col gap-2">
              <Item className="gap-2 items-end">
                <InputWithLabel
                  label={`Funcionário ${index + 1}`}
                  {...register(`employees.${index}.name`)}
                  error={errors.employees?.[index]?.name?.message}
                />
              </Item>
              <Item>
                <InputWithLabel
                  label="Email"
                  {...register(`employees.${index}.email`)}
                  error={errors.employees?.[index]?.email?.message}
                />
                <TelephoneInput
                  label="Telefone"
                  {...register(`employees.${index}.phone`)}
                  error={errors.employees?.[index]?.phone?.message}
                />
                {fields.length > 1 && (
                  <Button variant="destructive" onClick={() => remove(index)}>
                    <XIcon />
                  </Button>
                )}
              </Item>
            </Box>
          ))}

          <Button
            type="button"
            onClick={() => append({ name: "", email: "", phone: "" })}
            className="w-fit mx-auto"
          >
            <PlusIcon />
          </Button>

          <ErrorMessage show={!!errors.employees?.root?.message}>
            {errors.employees?.root?.message}
          </ErrorMessage>

          <ErrorMessage show={!!formError}>{formError}</ErrorMessage>

          <ButtonWithSpinner
            type="submit"
            className="max-w-72 mx-auto w-full"
            variant={"admin"}
            disabled={mutation.isPending}
            loading={mutation.isPending}
          >
            <Text className="text-neutral-150">
              {mutation.isPending
                ? "Adicionando..."
                : "Adicionar Funcionário(s)"}
            </Text>
          </ButtonWithSpinner>
        </form>
      </Box>
    </RouteContainer>
  );
}
