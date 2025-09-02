import { z } from "zod";

export const EmployeeSchema = z.object({
  name: z.string().min(1, { message: "Nome é obrigatório" }),
  email: z.email({ message: "E-mail inválido" }),
  phone: z.string().min(1, { message: "Telefone é obrigatório" }),
});

export const CreateEmployeesSchema = z.object({
  employees: z
    .array(EmployeeSchema)
    .min(1, "Adicione pelo menos um funcionário"),
});

export type CreateEmployeesType = z.infer<typeof CreateEmployeesSchema>;
export type EmployeeType = z.infer<typeof EmployeeSchema>;
