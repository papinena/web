import type { ApiResponse } from "~/interfaces/api-response";
import { api, apiRequest } from "~/utils/api";

const { BASE_URL } = api();

export async function socialLogin({
  token,
  type = "user",
}: {
  token: string;
  type?: "user" | "employee";
}) {
  const url = new URL(BASE_URL + "/auth/google");

  const body = {
    token,
    type,
  };

  const res = await apiRequest(
    url.toString(),
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    false // Don't include auth for login request
  );

  if (res.status >= 400 && res.status < 500) {
    const json = (await res.json()) as { status: string; message: string };
    return { error: json };
  }

  const json: ApiResponse<{
    isNew: boolean;
    profile: { email: string; name: string; avatar: string; googleId: string };
  }> = await res.json();

  return { data: json.data };
}
