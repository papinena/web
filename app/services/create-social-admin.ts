import { api, apiRequest } from "~/utils/api";
import type { ApiResponse } from "~/interfaces/api-response";
import type { UserAPIProps } from "~/interfaces/user";
import { EmployeeMapper } from "~/mappers/employee";
import type { CreateSocialAdminType } from "~/parsers/create-social-admin";
import type { CondominiumAPIProps } from "~/interfaces/condominium";
import type { EmployeeAPIProps } from "~/interfaces/employee";
import type { CondominiumAdministratorAPIProps } from "~/interfaces/condominium-administrator";
import type { SocialAccountAPIProps } from "~/interfaces/social-account";

type CreateSocialAdminData = Omit<CreateSocialAdminType, "employee"> & {
  employee: Omit<CreateSocialAdminType["employee"], "photo" | "birthDate">;
};

export async function createSocialAdmin(data: CreateSocialAdminData) {
  const url = new URL(api().BASE_URL + "/auth/social/admin");
  const res = await apiRequest(url.toString(), {
    method: "POST",
    body: JSON.stringify({
      employees: data.employees?.map((e) => ({
        last_name: "",
        telephone: "",
        position: "",
        is_resident: false,
        email: e.email,
        name: e.name,
        password: "0123456",
        is_register_completed: false,
      })),
      employee: {
        ...EmployeeMapper.toAPI(data.employee),
        permission: "ADMIN",
      },
      socialAccount: {
        provider: data.provider,
        providerId: data.providerId,
      },
      condominium: data.condominium,
      condominiumAdministrator: data.condominiumAdministrator,
    }),
  });

  const json: ApiResponse<{
    condominium: CondominiumAPIProps;
    employee: EmployeeAPIProps;
    token: { token: string; tokenId: string };
    condominiumAdministrator: CondominiumAdministratorAPIProps;
    socialAccount: SocialAccountAPIProps;
  }> = await res.json();

  if (res.status >= 300 && res.status <= 500) {
    return {
      data: null,
      error: { status: "error", message: "Algo deu errado" },
    };
  }

  if (json.status === "error") {
    return { error: json, data: null };
  }

  return { data: json.data, error: null };
}
