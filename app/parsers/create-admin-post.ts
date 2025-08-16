import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/svg+xml",
];

const fileSchema = z
  .instanceof(File)
  .refine(
    (file) => file.size <= MAX_FILE_SIZE,
    `O tamanho máximo da imagem é 5MB.`
  )
  .refine(
    (file) => ACCEPTED_IMAGE_TYPES.includes(file.type),
    "Apenas os formatos .jpg, .jpeg, .png e .svg são suportados."
  );

export const CreateAdminPostSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  resume: z.string().min(1, "Resumo é obrigatório"),
  description: z.string().optional(),
  important: z.boolean().optional(),
  photos: z.array(fileSchema).max(5, "Máximo de 5 imagens").optional(),
});

export type CreateAdminPostType = z.infer<typeof CreateAdminPostSchema>;