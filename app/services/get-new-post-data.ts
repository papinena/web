import { api, apiRequest } from "~/utils/api";

const { BASE_URL } = api();

export async function getNewPostData() {
  const url = new URL(BASE_URL + "/user/new-post");

  const res = await apiRequest(
    url.toString(),
    {
      method: "GET",
    },
    true
  );

  if (res.status >= 400 && res.status < 500) {
    const json = (await res.json()) as { status: string; message: string };
    return { error: json };
  }

  const json = (await res.json()) as {
    status: "success" | "error";
    postTypes: {
      status: "success" | "error";
      message: string;
      data: { id: number; name: string }[];
    };
    categories: {
      status: "success" | "error";
      message: string;
      data: { id: number; name: string }[];
    };
  };
  return { data: json };
}
