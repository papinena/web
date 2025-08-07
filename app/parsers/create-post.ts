import { z } from "zod";

export const CreatePostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  resume: z.string().min(1, "Resumo é obrigatório"),
  description: z.string().optional(),
  categories: z.array(z.number()).min(1, "Selecione ao menos uma categoria"),
  postTypes: z.array(z.number()).min(1, "Selecione ao menos um tipo"),
  expiresOn: z.date({ error: "Selecione um prazo de validade" }),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
});

export type CreatePostType = z.infer<typeof CreatePostSchema>;
