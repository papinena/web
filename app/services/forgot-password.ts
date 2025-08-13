import { apiRequest, api } from "~/utils/api";
import type { ApiResponse } from "~/interfaces/api-response";

interface ForgotPasswordPayload {
  email: string;
}

export async function forgotPassword(payload: ForgotPasswordPayload) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/auth/forgot-password`);

    const response = await apiRequest(
      url.toString(),
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      false // This is an unauthenticated endpoint
    );

    // If the response is 204 No Content, it's a success.
    if (response.status === 204) {
      return { data: { status: "success", message: "Password reset email sent." }, error: null };
    }

    // If the response is not 204, it's likely an error with a JSON body.
    const responseData: ApiResponse<null> = await response.json();
    if (responseData.status === "error" || !response.ok) {
      throw new Error(responseData.message || "Failed to send password reset email.");
    }

    // This part should ideally not be reached if the API is consistent,
    // but it's here as a fallback.
    return { data: responseData, error: null };

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Forgot password error:", errorMessage);
    return { data: null, error: { message: errorMessage } };
  }
}
