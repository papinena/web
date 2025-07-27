import { apiRequest, api } from "~/utils/api";
import type { CreateUserSchema } from "~/parsers/create-user";
import type { z } from "zod";
import { userMapper } from "~/mappers/user";

export async function createUser(data: z.infer<typeof CreateUserSchema>) {
  const { BASE_URL } = api();
  const response = await apiRequest(`${BASE_URL}/register/user`, {
    method: "POST",
    body: JSON.stringify(userMapper.toAPI(data)),
  });
  return response.json();
}

