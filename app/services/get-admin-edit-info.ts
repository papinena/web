import { api, apiRequest } from "~/utils/api";
import type { ApiResponse } from "~/interfaces/api-response";
import type { CondominiumAPIProps } from "~/interfaces/condominium";
import type { EmployeeAPIProps } from "~/interfaces/employee";
import { CondominiumAdministratorMapper } from "~/mappers/condominium-administrator";
import type { CondominiumAdministratorAPIProps } from "~/interfaces/condominium-administrator";

type GetAdminEditInfoResponse = ApiResponse<{
  employee: ApiResponse<EmployeeAPIProps>;
  condominium: ApiResponse<CondominiumAPIProps>;
  condominiumAdministrator: ApiResponse<CondominiumAdministratorAPIProps>;
  employees: ApiResponse<EmployeeAPIProps[]>;
}>;

import { EmployeeMapper } from "~/mappers/employee";

export async function getAdminEditInfo() {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/admin/edit`);
    const response = await apiRequest(url.toString());
    const responseData: GetAdminEditInfoResponse = await response.json();

    if (responseData.status === "error" || !response.ok) {
      throw new Error(responseData.message || "Failed to fetch admin info");
    }

    const employee = EmployeeMapper.toUI(responseData.data.employee.data);
    const condominium = responseData.data.condominium.data;
    const condominiumAdministrator = CondominiumAdministratorMapper.toUI(
      responseData.data.condominiumAdministrator.data
    );
    const employees = responseData.data.employees.data.map(EmployeeMapper.toUI);

    return {
      employee,
      condominium,
      condominiumAdministrator,
      employees,
    };
  } catch (error) {
    console.error("Error fetching admin info:", error);
    throw new Error(
      "An unexpected error occurred while fetching admin information."
    );
  }
}
