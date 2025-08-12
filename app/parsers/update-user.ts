import { z } from "zod";

export const UpdateUserSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    lastName: z.string().min(1, "Sobrenome é obrigatório"),
    // email: z.email("Email inválido"),
    // confirmEmail: z.email("Email inválido"),
    birthDate: z.string({
      error: "Data de nascimento é obrigatória",
    }),
    telephone: z.string().min(1, "Telefone é obrigatório"),
    block: z.string().optional(),
    apartment: z.string().min(1, "Apartamento é obrigatório"),
    // password: z.string().optional(),
    // confirmPassword: z.string().optional(),
  })
  // .refine((data) => data.password === data.confirmPassword, {
  //   message: "As senhas não coincidem",
  //   path: ["confirmPassword"],
  // })
  // .refine((data) => data.email === data.confirmEmail, {
  //   message: "Os emails não coincidem",
  //   path: ["confirmEmail"],
  // });

export type UpdateUserType = z.infer<typeof UpdateUserSchema>;
