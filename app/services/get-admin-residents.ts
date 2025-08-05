import { api, apiRequest } from "~/utils/api";

interface User {
  id: string;
  name: string;
  last_name: string;
  birth_date: string;
  telephone: string;
  email: string;
  block: string;
  apartment: string;
  is_approved: boolean;
  active: boolean;
  avatar?: string;
  condominiumId: number;
  created_at: string;
  updated_at: string;
  permission: string;
}

interface CondominiumUsersResponse {
  condominiumUsers: {
    status: string;
    message: string;
    data: User[];
  };
}

export async function getAdminResidents(
  condominiumId: number
): Promise<CondominiumUsersResponse> {
  const { BASE_URL } = api();
  const response = await apiRequest(
    `${BASE_URL}/admin/residents?condominiumId=${condominiumId}`
  );
  const data: CondominiumUsersResponse = await response.json();
  return data;
}
