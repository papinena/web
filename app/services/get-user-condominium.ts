import { apiRequest, api } from "~/utils/api";
import type { ApiResponse } from "~/interfaces/api-response";
import type {
  CondominiumAdministrator,
  CondominiumEmployee,
} from "~/interfaces/condominium-details";

interface CondominiumDetails {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  condominiumAdministratorId: number;
  condominiumAdministrator: CondominiumAdministrator;
  employees: CondominiumEmployee[];
}

export async function getUserCondominium() {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/user/condominium`);

    const response = await apiRequest(url.toString());

    if (response.status >= 300 || response.status < 200) {
      const errorData: ApiResponse<null> = await response.json();
      throw new Error(errorData.message || "Failed to fetch condominium data.");
    }

    const responseData: ApiResponse<CondominiumDetails> = await response.json();
    return responseData.data;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Error fetching condominium data:", errorMessage);
    throw new Error(errorMessage);
  }
}
