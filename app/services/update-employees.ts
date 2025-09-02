import { api, apiRequest } from "~/utils/api";
import type { ApiResponse } from "~/interfaces/api-response";

type Props = {
  data: { active: boolean };
  ids: string[];
};

export async function updateEmployees({ data, ids }: Props) {
  const { BASE_URL } = api();
  const res = await apiRequest(`${BASE_URL}/admin/employees`, {
    body: JSON.stringify({
      data,
      ids,
    }),
    method: "PATCH",
  });

  const json = (await res.json()) as ApiResponse<{}>;
  if (res.status >= 400 && res.status <= 500) {
    throw new Error(json.message);
  }

  return { data: json.data };
}
