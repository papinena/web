import z from "zod";

export const FulFillEmployeeSchema = z
  .object({
    name: z.string().min(2, "Mínimo de 2 caracteres"),
    lastName: z.string().min(2, "Mínimo de 2 caracteres"),
    birthDate: z.string().optional(),
    telephone: z
      .string()
      .regex(
        /^\(\d{2}\) \d{5}-\d{4}$/,
        "O telefone deve estar no formato (XX) XXXXX-XXXX"
      ),
    isResident: z.boolean(),
    block: z.string().optional(),
    apartment: z.string().optional(),
    email: z.email("Email inválido"),
    avatar: z.any().optional(),
    password: z
      .string()
      .min(8, { error: "A senha deve ter no mínimo 8 caracteres" })
      .regex(/\d/, { error: "A senha deve conter ao menos um número" })
      .regex(/[^a-zA-Z0-9]/, {
        error: "A senha deve conter ao menos um caractere especial",
      }),
    confirmPassword: z
      .string()
      .min(8, { error: "A senha deve ter no mínimo 8 caracteres" })
      .regex(/\d/, { error: "A senha deve conter ao menos um número" })
      .regex(/[^a-zA-Z0-9]/, {
        error: "A senha deve conter ao menos um caractere especial",
      }),
  })
  .refine((schema) => schema.password === schema.confirmPassword, {
    message: "As senhas devem ser iguais",
    path: ["confirmPassword"],
  });

export type FulFillEmployeeType = z.infer<typeof FulFillEmployeeSchema>;
