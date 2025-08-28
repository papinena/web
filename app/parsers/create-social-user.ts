import { z } from "zod";
import { TagSchema } from "~/interfaces/tag";

export const CreateSocialUserSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  lastName: z.string().min(1, "Sobrenome é obrigatório"),
  email: z.string().email("Email inválido"),
  telephone: z.string().min(10, "Telefone inválido"),
  birthDate: z.string().min(1, "Data de nascimento é obrigatória"),
  condominiumId: z.string().min(1, "Condomínio é obrigatório"),
  apartment: z.string().optional(),
  block: z.string().optional(),
  tags: z.array(TagSchema).min(1, "Selecione ao menos um tema"),
  photo: z.string().optional(),
});

export type CreateSocialUserType = z.infer<typeof CreateSocialUserSchema>;
