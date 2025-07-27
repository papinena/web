import { api, apiRequest } from "~/utils/api";

export async function getUserRegister() {
  const { BASE_URL } = api();
  const response = await apiRequest(`${BASE_URL}/register/user`);
  const data = await response.json();
  return data.condominiums.data;
}
