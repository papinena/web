import type { EmployeePostAPIProps } from "~/interfaces/post";
import { api, apiRequest } from "~/utils/api";
import { AdminPostMapper } from "~/mappers/post";

interface ApiResponse {
  status: "success" | "error";
  message: string;
  data?: {
    post: {
      status: "success" | "error";
      message: string;
      data: EmployeePostAPIProps;
    };
  };
}

export async function getAdminPost(postId: string) {
  const { BASE_URL } = api();

  const url = new URL(`${BASE_URL}/post/${postId}/admin`);
  const response = await apiRequest(url.toString());
  const responseData: ApiResponse = await response.json();

  if (responseData.status === "error") {
    throw new Error(responseData.message || "Failed to get post");
  }

  if (!responseData.data?.post) {
    throw new Error("Post data is undefined");
  }

  return { post: AdminPostMapper.toDomain(responseData.data.post.data) };
}
