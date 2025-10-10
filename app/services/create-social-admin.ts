import { api, apiRequest } from "~/utils/api";
import type { CreateSocialUserType } from "~/parsers/create-social-user";
import type { ApiResponse } from "~/interfaces/api-response";
import type { UserAPIProps } from "~/interfaces/user";
import { UserMapper } from "~/mappers/user";

export async function createSocialUser(data: {
  user: CreateSocialUserType;
  socialAccount: {
    provider: "google" | "facebook" | "apple";
    providerId: string;
  };
}) {
  const url = new URL(api().BASE_URL + "/auth/social");
  const res = await apiRequest(url.toString(), {
    method: "POST",
    body: JSON.stringify({
      user: UserMapper.toAPI({
        ...data.user,
        condominiumId: Number(data.user.condominiumId),
        birthDate: data.user.birthDate ? new Date(data.user.birthDate) : null,
      }),
      socialAccount: data.socialAccount,
    }),
  });

  const json: ApiResponse<UserAPIProps> = await res.json();

  return json;
}
