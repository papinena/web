import type { EmployeePostAPIProps, UserPostAPIProps } from "~/interfaces/post";
import { api, apiRequest } from "~/utils/api";
import type { Pagination } from "~/interfaces/pagination";

interface ApiResponse {
  status: "success" | "error";
  message: string;
  userPosts: {
    status: string;
    message: string;
    data: UserPostAPIProps[];
    pagination: Pagination;
  };
  employeesPosts: {
    status: string;
    message: string;
    data: EmployeePostAPIProps[];
    pagination: Pagination;
  };
}

export async function getHomePosts({ pageParam = 1, limit = 5 }) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/home`);

    // Append query parameters
    url.searchParams.append("page", String(pageParam));
    url.searchParams.append("limit", String(limit));

    const response = await apiRequest(url.toString());
    const responseData: ApiResponse = await response.json();

    if (responseData.status === "error" || !response.ok) {
      throw new Error(responseData.message || "Failed to fetch home posts");
    }

    return responseData;
  } catch (error) {
    console.error("Error fetching home posts:", error);
    throw new Error(
      "An unexpected error occurred while fetching the home posts."
    );
  }
}
