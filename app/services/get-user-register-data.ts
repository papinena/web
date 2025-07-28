import { api, apiRequest } from "~/utils/api";
import type { Condominium } from "~/interfaces/condominium";
import type { Tag } from "~/interfaces/tag";

interface UserRegisterDataResponse {
  condominiums: {
    data: Condominium[];
  };
  tags: {
    data: Tag[];
  };
}

export async function getUserRegisterData(): Promise<{
  condominiums: Condominium[];
  tags: Tag[];
}> {
  const { BASE_URL } = api();
  const response = await apiRequest(`${BASE_URL}/register/user`);
  const data: UserRegisterDataResponse = await response.json();
  return { condominiums: data.condominiums.data, tags: data.tags.data };
}