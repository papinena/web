import type { ApiResponse } from "~/interfaces/api-response";
import type { UserPostAPIProps } from "~/interfaces/post";
import { api, apiRequest } from "~/utils/api";

export async function searchPosts(term: string) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/search/posts`);
    url.searchParams.append("term", term);

    const response = await apiRequest(url.toString());
    const responseData: ApiResponse<UserPostAPIProps[]> = await response.json();

    if (responseData.status === "error" || !response.ok) {
      throw new Error(responseData.message || "Failed to search posts");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error searching posts:", error);
    throw new Error("An unexpected error occurred while searching for posts.");
  }
}
