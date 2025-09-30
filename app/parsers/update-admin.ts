import z from "zod";

export const UpdateAdminSchema = z.object({
  employee: z
    .object({
      name: z.string().min(4, "Mínimo de 4 caracteres"),
      lastName: z.string().min(4, "Mínimo de 4 caracteres"),
      birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
      photo: z.string().nullable().optional(),
      telephone: z
        .string()
        .regex(
          /^\(\d{2}\) \d{5}-\d{4}$/,
          "O telefone deve estar no formato (XX) XXXXX-XXXX"
        ),
      position: z.string().min(2, { message: "Mínimo de 2 caracteres" }),
      isResident: z.boolean({ error: "Obrigatório" }).or(z.undefined()),
      block: z.string().optional(),
      apartment: z.string().optional(),
      email: z.email({ message: "Email inválido" }).optional(),
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
  condominium: z
    .object({
      name: z.string().min(2, { message: "Mínimo de 2 caracteres" }),
      usefulInformation: z.string().optional(),
    })
    .optional(),
  condominiumAdministrator: z
    .object({
      name: z.string().min(2, { message: "Mínimo de 2 caracteres" }),
      contact: z.string().optional(),
      address: z.string().optional(),
      telephone: z.string().optional(),
      counsil: z.string().optional(),
      email: z.email("Email inválido").optional().or(z.literal("")),
      doorKeeperChief: z.string().optional(),
      receptionTelephone: z.string().optional(),
    })
    .optional(),
  /*
  employees: z
    .array(
      z.object({
        name: z.string().min(2, { message: "Mínimo de 2 caracters" }),
        email: z.email(),
      })
    )
    .min(1, { message: "Mínimo de um funcionário" })
    .optional(),*/
});

export type UpdateAdminType = z.infer<typeof UpdateAdminSchema>;
