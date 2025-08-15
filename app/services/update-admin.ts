import { api, apiRequest } from "~/utils/api";
import type { EmployeeAPIProps } from "~/interfaces/employee";
import type { CondominiumAPIProps } from "~/interfaces/condominium";
import type { CondominiumAdministratorAPIProps } from "~/interfaces/condominium-administrator";
import type { ApiResponse } from "~/interfaces/api-response";

export interface UpdateAdminPayload {
  employee: Partial<EmployeeAPIProps>;
  employees?: { name: string; email: string }[];
  condominiumAdministrator?: Partial<CondominiumAdministratorAPIProps>;
  condominium?: Partial<CondominiumAPIProps>;
}

type UpdateAdminResponse = ApiResponse<{
  employee: ApiResponse<EmployeeAPIProps>;
  condominium: ApiResponse<CondominiumAPIProps> | null;
  condominiumAdministrator: ApiResponse<CondominiumAdministratorAPIProps> | null;
  employees: ApiResponse<{ count: number }> | null;
}>;

export async function updateAdmin(data: UpdateAdminPayload) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/admin/edit`);
    const response = await apiRequest(url.toString(), {
      method: "PUT",
      body: JSON.stringify(data),
    });

    const responseData: UpdateAdminResponse = await response.json();

    if (responseData.status === "error" || !response.ok) {
      const errorMessage =
        responseData.data?.employee?.message ||
        responseData.message ||
        "Failed to update admin";
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error;
  }
}
