import type { FeedbackType } from "~/components/feedback-dialog";
import type { ApiResponse } from "~/interfaces/api-response";
import { api, apiRequest } from "~/utils/api";

export async function createFeedback(data: FeedbackType) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/feedback`);
    const response = await apiRequest(url.toString(), {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseData: ApiResponse<any> = await response.json();

    if (response.status >= 400 && response.status <= 500) {
      throw new Error(responseData.message || "Failed to update user");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("An unexpected error occurred while updating the user.");
  }
}
