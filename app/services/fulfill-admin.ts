import type { ApiResponse } from "~/interfaces/api-response";
import type { EmployeeAPIProps } from "~/interfaces/employee";
import { api, apiRequest } from "~/utils/api";

export async function fulfillAdmin(data: Partial<EmployeeAPIProps>) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/register/admin/fulfill`);
    const response = await apiRequest(url.toString(), {
      method: "PUT",
      body: JSON.stringify({ employee: data }),
    });

    const responseData: ApiResponse<EmployeeAPIProps> = await response.json();

    if (responseData.status === "error" || !response.ok) {
      const errorMessage = responseData.message || "Failed to update admin";
      throw new Error(errorMessage);
    }

    return responseData.data;
  } catch (error) {
    console.error("Error updating admin:", error);
    throw error;
  }
}
