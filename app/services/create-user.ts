import { apiRequest, api } from "~/utils/api";
import type { CreateUserType } from "~/parsers/create-user";
import { UserMapper } from "~/mappers/user";
import type { ApiResponse } from "~/interfaces/api-response";
import type { UserAPIProps } from "~/interfaces/user";

export async function createUser(
  data: Omit<CreateUserType, "birthDate"> & { birthDate: Date | null }
) {
  const { BASE_URL } = api();
  const body = JSON.stringify({
    user: UserMapper.toAPI(data),
    tags: data.tags?.map((t) => ({
      id: t.id,
      label: t.label,
    })),
  });

  const response = await apiRequest(
    `${BASE_URL}/register/user`,
    {
      method: "POST",
      body,
    },
    false
  );

  return (await response.json()) as ApiResponse<UserAPIProps>;
}
