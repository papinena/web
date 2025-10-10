import z from "zod";

export const CreateSocialAdminSchema = z
  .object({
    providerId: z.string(),
    provider: z.enum(["apple", "google"]),
    employee: z
      .object({
        name: z.string().min(1, "Mínimo de 4 caracteres"),
        lastName: z.string().min(4, "Mínimo de 4 caracteres"),
        birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
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
      })

      .refine(
        (data) => {
          const birthDate = new Date(data.birthDate);
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
          }
          return age >= 18;
        },
        {
          message: "Você deve ter no mínimo 18 anos",
          path: ["birthDate"],
        }
      ),
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
  });

export type CreateSocialAdminType = z.infer<typeof CreateSocialAdminSchema>;
