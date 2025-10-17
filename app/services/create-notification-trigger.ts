import { apiRequest, api } from "~/utils/api";
import type { ApiResponse } from "~/interfaces/api-response";

type Payload = {
  payload: {};
  eventType: "USER-REGISTERED";
};

export async function createNotificationTrigger(
  payload: Payload,
  headers?: Headers
) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/notification/trigger`);

    const response = await apiRequest(url.toString(), {
      method: "POST",
      body: JSON.stringify(payload),
      headers,
    });

    if (response.status >= 300 && response.status <= 500) {
      const responseData: ApiResponse<null> = await response.json();
      throw new Error(responseData.message || "Failed to save FCM token");
    }

    console.log("FCM token saved successfully");
    return { error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Error saving FCM token:", errorMessage);
    return { data: null, error: { message: errorMessage } };
  }
}
