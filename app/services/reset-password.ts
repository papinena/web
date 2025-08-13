import { apiRequest, api } from "~/utils/api";
import type { ApiResponse } from "~/interfaces/api-response";
import type { z } from "zod";
import type { ResetPasswordSchema } from "~/routes/password/reset";

type ResetPasswordPayload = z.infer<typeof ResetPasswordSchema> & {
  token: string;
};

export async function resetPassword(payload: ResetPasswordPayload) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/auth/reset-password`);

    const response = await apiRequest(
      url.toString(),
      {
        method: "POST",
        body: JSON.stringify({
          newPassword: payload.password,
          token: payload.token,
          email: payload.email,
        }),
      },
      false // This is an unauthenticated endpoint
    );

    if (response.status === 204) {
      return {
        data: { status: "success", message: "Password reset successfully." },
        error: null,
      };
    }

    const responseData: ApiResponse<null> = await response.json();
    throw new Error(responseData.message || "Failed to reset password.");
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "An unexpected error occurred.";
    console.error("Reset password error:", errorMessage);
    return { data: null, error: { message: errorMessage } };
  }
}
