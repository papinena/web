import { api, apiRequest } from '~/utils/api';

const { BASE_URL } = api();

export async function getImageReadToken(): Promise<{
  data?: { sasToken: string; containerUri: string };
  error?: { message: string; status: string };
}> {
  const url = new URL(BASE_URL + '/image-read/token/read');

  const res = await apiRequest(
    url.toString(),
    {
      method: 'GET',
    },
    true,
  );

  if (res.status >= 400 && res.status < 500) {
    const json = (await res.json()) as { status: string; message: string };
    return { error: json };
  }

  const json = await res.json();
  return { data: json.data };
}
