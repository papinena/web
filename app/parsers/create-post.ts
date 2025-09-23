import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(1, "Título é obrigatório")
    .max(25, { error: "Máximo de 25 caracteres" }),
  resume: z
    .string()
    .min(1, "Resumo é obrigatório")
    .max(70, { error: "Máximo de 70 caracteres" }),
  description: z.string().optional(),
  categories: z
    .array(
      z.object({
        id: z.number(),
        label: z.string(),
      })
    )
    .min(1, { error: "Selecione ao menos uma categoria" }),
  postTypes: z
    .array(
      z.object({
        id: z.number(),
        label: z.string(),
      })
    )
    .min(1, "Selecione ao menos um tipo"),
  includeTelephone: z.boolean().optional(),
  expiresOn: z.number({ error: "Selecione um prazo de validade" }),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  files: z.array(z.file()).optional(),
});

export type CreatePostType = z.infer<typeof CreatePostSchema>;
