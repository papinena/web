import type { ApiResponse } from "~/interfaces/api-response";
import { api, apiRequest } from "~/utils/api";

const { BASE_URL } = api();

export async function socialAppleLogin({
  user,
  token,
  type = "user",
}: {
  user?: { name: string; lastName: string; email: string };
  token: string;
  type?: "user" | "employee";
}) {
  const url = new URL(`${BASE_URL}/auth/apple`);

  const body = {
    token,
    type,
    user,
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
    profile: {
      name: string | null;
      lastName?: string;
      avatar?: string | null;
      provider: "apple" | "google";
      providerId: string;
      email: string;
    };
  }> = await res.json();

  return { data: json.data };
}
