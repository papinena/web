import { api, apiRequest } from "~/utils/api";

export async function deleteUser() {
  const url = new URL(api().BASE_URL + "/user/account");
  const res = await apiRequest(url.toString(), {
    method: "DELETE",
  });

  if (res.status >= 300 && res.status <= 500) {
    return {
      error: { status: "error", message: "Algo deu errado" },
    };
  }

  return { error: null };
}
