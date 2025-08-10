import { apiRequest, api } from "~/utils/api";
import type { CreateUserSchema } from "~/parsers/create-user";
import type { z } from "zod";
import { UserMapper } from "~/mappers/user";

export async function createUser(data: z.infer<typeof CreateUserSchema>) {
  const { BASE_URL } = api();
  const body = JSON.stringify({
    user: UserMapper.toAPI(data),
    tags: data.tags?.map((t) => ({
      label: t,
    })),
  });

  const response = await apiRequest(`${BASE_URL}/register/user`, {
    method: "POST",
    body,
  });
  return (await response.json()) as
    | {
        status: "error" | "success";
        message: string;
      }
    | undefined;
}
