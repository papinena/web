import { api, apiRequest } from "~/utils/api";

export async function deletePost(postId: string) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/post/${postId}`);
    const response = await apiRequest(url.toString(), {
      method: "DELETE",
    });

    if (response.status >= 300 || response.status < 200) {
      const responseData = await response.json();
      throw new Error(responseData.message || "Failed to delete post");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("An unexpected error occurred while deleting the post.");
  }
}
