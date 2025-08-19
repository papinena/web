import { api, apiRequest } from "~/utils/api";
import type { UserPostAPIProps } from "~/interfaces/post";

interface ApiResponse {
  status: "sucess" | "error";
  message: string;
  data: UserPostAPIProps[];
}

export async function getAdminMyPublications() {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/admin/my-publications`);
    const response = await apiRequest(url.toString());
    const responseData: ApiResponse = await response.json();

    if (responseData.status === "error") {
      throw new Error(responseData.message || "Failed to get publications");
    }

    return responseData;
  } catch (error) {
    console.error("Error getting publications:", error);
    throw new Error(
      "An unexpected error occurred while fetching the publications."
    );
  }
}
