import type { z } from "zod";
import type { CreateUserSchema } from "~/parsers/create-user";

export const userMapper = {
  toAPI: (data: z.infer<typeof CreateUserSchema>) => {
    return {
      name: data.name,
      last_name: data.lastName,
      birth_date: data.birthDate
        ? new Date(data.birthDate).toISOString()
        : undefined,
      telephone: data.telephone,
      email: data.email,
      block: data.block,
      apartment: data.apartment,
      password: data.password,
      condominiumId: Number(data.condominiumId),
    };
  },
};
