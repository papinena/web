import { z } from "zod";

export const CreateUserSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    lastName: z.string().min(1, "Sobrenome é obrigatório"),
    apartment: z.string().min(1, "Apartamento é obrigatório"),
    block: z.string().optional(),
    birthDate: z.string().optional(),
    photo: z.string().optional(),
    telephone: z.string().min(1, "Telefone é obrigatório"),
    email: z.email("Email inválido").transform((val) => val.toLowerCase()),
    confirmEmail: z
      .email("Email inválido")
      .transform((val) => val.toLowerCase()),
    password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
    condominiumId: z
      .string({ error: "Condomínio é obrigatório" })
      .min(1, "Condomínio é obrigatório"),
    tags: z
      .array(z.object({ id: z.number(), label: z.string() }))
      .min(3, { error: "Mínimo de 3 temas" }),
    terms: z.boolean({ error: "Termos de uso obrigatório" }),
  })
  .refine((data) => data.email === data.confirmEmail, {
    message: "Emails não conferem",
    path: ["confirmEmail"],
  })
  .refine((schema) => schema.terms, {
    message: "Termo de uso obrigatório",
    path: ["terms"],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Senhas não conferem",
    path: ["confirmPassword"],
  });
export type CreateUserType = z.infer<typeof CreateUserSchema>;
