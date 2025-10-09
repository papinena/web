import { api, apiRequest } from "~/utils/api";

const { BASE_URL } = api();

export async function socialLogin({
  token,
  type = "user",
}: {
  token: string;
  type?: "user" | "employee";
}): Promise<
  | {
      data: {
        isNew: boolean;
        profile: {
          name: string | null;
          lastName?: string;
          avatar?: string | null;
          provider: "apple" | "google";
          providerId: string;
          email: string;
        };
      };
      error: undefined;
    }
  | { error: any; data: undefined }
> {
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
    return { error: json, data: undefined };
  }

  const json = await res.json();

  return { data: json.data, error: undefined };
}
