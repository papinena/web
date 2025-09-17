import { api, apiRequest } from "~/utils/api";
import type { UserAPIProps } from "~/interfaces/user";
import type { Tag } from "~/interfaces/tag";

interface UpdateUserPayload {
  user: Partial<UserAPIProps>;
  tags: string[];
}

interface ApiResponse {
  status: "success" | "error";
  user: {
    status: "success" | "error";
    message: string;
    data: UserAPIProps;
  };
  tags: {
    status: "success" | "error";
    message: string;
    data: Tag[];
  };
}

export async function updateUser(data: UpdateUserPayload) {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/user/edit`);
    const response = await apiRequest(url.toString(), {
      method: "PATCH",
      body: JSON.stringify(data),
    });

    const responseData: ApiResponse = await response.json();

    if (responseData.status === "error" || !response.ok) {
      throw new Error(responseData.user.message || "Failed to update user");
    }

    return responseData;
  } catch (error) {
    console.error("Error updating user:", error);
    throw new Error("An unexpected error occurred while updating the user.");
  }
}
