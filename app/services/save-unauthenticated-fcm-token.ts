import { apiRequest, api } from "~/utils/api";
import type { ApiResponse } from "~/interfaces/api-response";

interface SaveUnauthenticatedFcmTokenPayload {
  token: string;
  provider: "FCM";
  email: string;
}

export async function saveUnauthenticatedFcmToken(
  token: string,
  email: string
) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/notification/token/unauthenticated`);

    const payload: SaveUnauthenticatedFcmTokenPayload = {
      token,
      provider: "FCM",
      email,
    };

    // Note: The 'includeAuth' parameter is false for this unauthenticated request
    const response = await apiRequest(
      url.toString(),
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false
    );

    if (response.status !== 204) {
      const responseData: ApiResponse<any> = await response.json();
      return responseData;
    }

    console.log("Unauthenticated FCM token saved successfully");
    return { data: null, status: "success" };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Error saving unauthenticated FCM token:", errorMessage);
    return { data: null, error: { message: errorMessage } };
  }
}
