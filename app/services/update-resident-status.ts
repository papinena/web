import { api, apiRequest } from "~/utils/api";

interface UpdateResidentStatusRequest {
  ids: string[];
  data: {
    is_approved: boolean;
  };
}

export async function updateResidentStatus(
  request: UpdateResidentStatusRequest
) {
  const { BASE_URL } = api();
  const res = await apiRequest(`${BASE_URL}/admin/residents`, {
    method: "PATCH",
    body: JSON.stringify(request),
  });

  if (res.status >= 400 && res.status < 500) {
    const json = (await res.json()) as { status: string; message: string };
    return {
      error: {
        message: "Algo deu errado. Entre em contato com o suporte",
        code: JSON.stringify(json),
      },
    };
  }

  return { error: null };
}
