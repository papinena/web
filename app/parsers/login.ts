import { z } from "zod";

export const LoginSchema = z.object({
  email: z.email({ message: "O e-mail é inválido" }),
  password: z
    .string({ message: "A senha é obrigatória" })
    .min(1, "A senha é obrigatória"),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  tokenId: z.string(),
  userType: z.enum(["user", "employee"]),
});

export type LoginType = z.infer<typeof LoginSchema>;
export type LoginResponseType = z.infer<typeof LoginResponseSchema>;
