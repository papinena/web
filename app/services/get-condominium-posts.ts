import type { ApiResponse } from "~/interfaces/api-response";
import type { EmployeePostAPIProps } from "~/interfaces/post";
import { api, apiRequest } from "~/utils/api";

export async function getCondominiumPosts({
  page = 1,
  limit = 10,
}: {
  page?: number;
  limit?: number;
}) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/posts/condominium`);

    url.searchParams.append("page", String(page));
    url.searchParams.append("limit", String(limit));

    const response = await apiRequest(url.toString());
    const responseData: ApiResponse<EmployeePostAPIProps[]> =
      await response.json();

    if (responseData.status === "error" || !response.ok) {
      throw new Error(
        responseData.message || "Failed to fetch condominium posts"
      );
    }

    console.log("res", responseData);
    return responseData;
  } catch (error) {
    console.error("Error fetching condominium posts:", error);
    throw new Error(
      "An unexpected error occurred while fetching the condominium posts."
    );
  }
}
