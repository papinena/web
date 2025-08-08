import { api, apiRequest } from "~/utils/api";
import type { CreatePostType } from "~/parsers/create-post";

export async function updatePost(postId: string, data: CreatePostType) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/post/${postId}`);
    const response = await apiRequest(url.toString(), {
      method: "PUT",
      body: JSON.stringify(data),
    });

    if (response.status !== 200) {
      const responseData = await response.json();
      throw new Error(responseData.message || "Failed to update post");
    }
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("An unexpected error occurred while updating the post.");
  }
}
