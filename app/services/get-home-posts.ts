import { api, apiRequest } from "~/utils/api";
import type { PostAPIProps } from "./get-post";

interface ApiResponse {
  status: "success" | "error";
  message: string;
  userPosts: {
    status: string;
    message: string;
    data: PostAPIProps[];
  };
}

export async function getHomePosts(params?: Record<string, any>) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/home`);

    // Append query parameters if they exist
    if (params) {
      Object.keys(params).forEach((key) =>
        url.searchParams.append(key, params[key])
      );
    }

    const response = await apiRequest(url.toString());
    const responseData: ApiResponse = await response.json();

    if (responseData.status === "error" || !response.ok) {
      throw new Error(responseData.message || "Failed to fetch home posts");
    }

    console.log(responseData);
    return responseData;
  } catch (error) {
    console.error("Error fetching home posts:", error);
    throw new Error(
      "An unexpected error occurred while fetching the home posts."
    );
  }
}
