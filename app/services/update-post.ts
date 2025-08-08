import { api, apiRequest } from "~/utils/api";
import type { CreatePostType } from "~/parsers/create-post";
import type { PostAPIProps } from "./get-post";

interface ApiResponse {
  status: "success" | "error";
  message: string;
  data?: PostAPIProps;
}

export async function updatePost(postId: string, data: CreatePostType) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/post/${postId}`);
    const response = await apiRequest(url.toString(), {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    const responseData: ApiResponse = await response.json();

    if (responseData.status === "error" || response.status !== 200) {
      throw new Error(responseData.message || "Failed to update post");
    }

    return responseData;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("An unexpected error occurred while updating the post.");
  }
}
