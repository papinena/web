import z from "zod";
import { DateFormatter } from "~/utils/date-formatter";

export const CreateAdminSchema = z
  .object({
    employee: z.object({
      name: z.string().min(1, "Mínimo de 4 caracteres"),
      lastName: z.string().min(4, "Mínimo de 4 caracteres"),
      birthDate: z
        .string()
        .min(1, "Data de nascimento é obrigatória")
        .refine((data) => {
          const dobDate = DateFormatter.parse(data, "dd/MM/yyyy");
          const age = DateFormatter.differenceInYears(new Date(), dobDate);
          return age >= 18;
        }, "Você deve ter no mínimo 18 anos"),
      photo: z.string().optional(),
      telephone: z
        .string()
        .regex(
          /^\(\d{2}\) \d{5}-\d{4}$/,
          "O telefone deve estar no formato (XX) XXXXX-XXXX"
        ),
      position: z.string().min(2, { error: "Mínimo de 2 caracteres" }),
      isResident: z.boolean({ error: "Obrigatório" }),
      block: z.string().optional(),
      apartment: z.string().optional(),
      email: z
        .email({ error: "Email inválido" })
        .transform((val) => val.toLowerCase()),
      confirmEmail: z
        .email({ error: "Email inválido" })
        .transform((val) => val.toLowerCase()),
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
    }),

    condominium: z.object({
      name: z.string().min(2, { error: "Mínimo de 2 caracteres" }),
      usefulInformation: z.string().optional(),
    }),
    condominiumAdministrator: z.object({
      name: z.string().min(2, { error: "Mínimo de 2 caracteres" }),
      contact: z.string().optional(),
      address: z.string().optional(),
      telephone: z.string().optional(),
      counsil: z.string().optional(),
      email: z
        .email("Email inválido")
        .transform((val) => val.toLowerCase())
        .optional()
        .or(z.literal("")),
      doorKeeperChief: z.string().optional(),
      receptionTelephone: z.string().optional(),
    }),
    terms: z.boolean({ error: "Termos de uso obrigatório" }),
    employees: z
      .array(
        z.object({
          name: z.string().min(1, { error: "Mínimo de 2 caracters" }),
          email: z.email().transform((val) => val.toLowerCase()),
        })
      )
      .optional(),
  })
  .refine((schema) => schema.terms, {
    message: "Termo de uso obrigatório",
    path: ["terms"],
  })
  .refine(
    (schema) => schema.employee.password === schema.employee.confirmPassword,
    {
      message: "As senhas devem ser iguais",
      path: ["confirmPassword"],
    }
  )
  .refine((schema) => schema.employee.confirmEmail === schema.employee.email, {
    message: "O email deve ser igual",
    path: ["confirmEmail"],
  });

export type CreateAdminType = z.infer<typeof CreateAdminSchema>;
