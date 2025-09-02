import { api, apiRequest } from "~/utils/api";
import type { EmployeeType } from "~/parsers/create-employees";
import type { ApiResponse } from "~/interfaces/api-response";

type Props = {
  employees: EmployeeType[];
  condominiumId: number;
};

export async function createEmployees({ employees, condominiumId }: Props) {
  // Assuming the endpoint is /employees. This might need adjustment.
  const { BASE_URL } = api();
  const res = await apiRequest(`${BASE_URL}/admin/employees`, {
    body: JSON.stringify({
      employees: employees?.map((e) => ({
        last_name: "",
        telephone: "",
        position: "",
        is_resident: false,
        email: e.email,
        name: e.name,
        password: "0123456",
        is_register_completed: false,
      })),
      condominiumId,
    }),
    method: "POST",
  });

  const json = (await res.json()) as ApiResponse<{}>;
  if (res.status >= 400 && res.status <= 500) {
    throw new Error(json.message);
  }

  return { data: json.data };
}
