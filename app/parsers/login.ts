import { z } from "zod";

export const EmployeeSchema = z.object({
  id: z.string(),
  name: z.string(),
  last_name: z.string(),
  email: z.email().transform(val => val.toLowerCase()),
  telephone: z.string(),
  position: z.string(),
  is_resident: z.boolean(),
  block: z.string().nullable(),
  apartment: z.string().nullable(),
  password: z.string(),
  is_register_completed: z.boolean(),
  active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  permission: z.string(),
  condominiumId: z.number(),
});

export const LoginSchema = z.object({
  email: z.email({ message: "O e-mail é obrigatório" }).transform(val => val.toLowerCase()),
  password: z
    .string({ message: "A senha é obrigatória" })
    .min(1, "A senha é obrigatória"),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  tokenId: z.string(),
  userType: z.enum(["user", "employee"]),
  user: z.any().optional(),
  employee: EmployeeSchema.optional(),
});

export type LoginType = z.infer<typeof LoginSchema>;
export type LoginResponseType = z.infer<typeof LoginResponseSchema>;
export type EmployeeType = z.infer<typeof EmployeeSchema>;
