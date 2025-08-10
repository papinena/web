import { api, apiRequest } from "~/utils/api";
import type { UserAPIProps } from "~/interfaces/user";
import type { Tag } from "~/interfaces/tag";
import { UserMapper } from "~/mappers/user";

interface UserData {
  status: string;
  message: string;
  data: UserAPIProps;
}

interface UserTagsData {
  status: string;
  message: string;
  data: Tag[];
}

interface TagsData {
  status: string;
  message: string;
  data: Tag[];
}

interface ApiResponse {
  status: "success" | "error";
  message: string;
  data: {
    user: UserData;
    userTags: UserTagsData;
    tags: TagsData;
  };
}

export async function getUserEditInfo() {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/user/edit`);
    const response = await apiRequest(url.toString());
    const responseData: ApiResponse = await response.json();

    if (responseData.status === "error" || !response.ok) {
      throw new Error(responseData.message || "Failed to fetch user info");
    }

    const tags = responseData.data.tags.data;
    const userTags = responseData.data.userTags.data;
    const user = UserMapper.toUI(responseData.data.user.data);

    return {
      user,
      tags,
      userTags,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error(
      "An unexpected error occurred while fetching user information."
    );
  }
}
