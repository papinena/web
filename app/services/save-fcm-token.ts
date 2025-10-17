import { apiRequest, api } from "~/utils/api";
import type { ApiResponse } from "~/interfaces/api-response";

// The specific structure of the data object in a successful response
interface FcmTokenResponseData {
  id: string;
  token: string;
  provider: "FCM";
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface SaveFcmTokenPayload {
  token: string;
  provider: "FCM";
}

export async function saveFcmToken(token: string, headers?: Headers) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/notification/token`);

    const payload: SaveFcmTokenPayload = {
      token,
      provider: "FCM",
    };

    const response = await apiRequest(url.toString(), {
      method: "POST",
      body: JSON.stringify(payload),
      headers,
    });

    const responseData: ApiResponse<FcmTokenResponseData> =
      await response.json();

    if (responseData.status === "error" || !response.ok) {
      throw new Error(responseData.message || "Failed to save FCM token");
    }

    console.log("FCM token saved successfully");
    return { data: responseData, error: null };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Error saving FCM token:", errorMessage);
    return { data: null, error: { message: errorMessage } };
  }
}
