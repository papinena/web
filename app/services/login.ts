import type { LoginType, LoginResponseType } from "~/parsers/login";
import { api, apiRequest } from "~/utils/api";

const { BASE_URL } = api();

export async function login(data: LoginType): Promise<{
  data?: LoginResponseType & { user?: any; employee?: any };
  error?: { message: string; status: string };
}> {
  const url = new URL(BASE_URL + "/auth/login");

  const body = {
    email: data.email,
    password: data.password,
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

  return { data: await res.json() };
}
