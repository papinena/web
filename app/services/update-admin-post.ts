import { api, apiRequest } from "~/utils/api";
import type { EmployeePostAPIProps } from "~/interfaces/post";
import { AdminPostMapper } from "~/mappers/post";
import type { ApiResponse } from "~/interfaces/api-response";

export async function updateAdminPost(
  postId: string,
  data: EmployeePostAPIProps
) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/post/${postId}/admin`);
    const response = await apiRequest(url.toString(), {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    const responseData: ApiResponse<EmployeePostAPIProps> =
      await response.json();

    if (responseData.status === "error" || response.status !== 200) {
      throw new Error(responseData.message || "Failed to update post");
    }

    if (!responseData.data) throw new Error("Data is undefined");

    return {
      status: responseData.status,
      post: AdminPostMapper.toDomain(responseData.data),
    };
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("An unexpected error occurred while updating the post.");
  }
}
