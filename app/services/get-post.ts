import type { UserPostAPIProps } from "~/interfaces/post";
import { api, apiRequest } from "~/utils/api";

interface ApiResponse {
  status: "success" | "error";
  message: string;
  data?: {
    post: {
      status: "success" | "error";
      message: string;
      data: UserPostAPIProps;
    };
    recommendedPosts: {
      status: "success" | "error";
      message: string;
      data: UserPostAPIProps[];
    };
  };
}

export async function getPost(postId: string) {
  try {
    const { BASE_URL } = api();

    const url = new URL(`${BASE_URL}/post/${postId}`);
    const response = await apiRequest(url.toString());
    const responseData: ApiResponse = await response.json();

    if (responseData.status === "error") {
      throw new Error(responseData.message || "Failed to get post");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error getting post:", error);
    throw new Error("An unexpected error occurred while fetching the post.");
  }
}
