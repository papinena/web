import { api, apiRequest } from "~/utils/api";
import type { UserAPIProps } from "~/interfaces/user";
import type { Tag } from "~/interfaces/tag";
import { UserMapper } from "~/mappers/user";
import type { ApiResponse } from "~/interfaces/api-response";
import type { CondominiumAPIProps } from "~/interfaces/condominium";

type UserData = ApiResponse<UserAPIProps>;
type UserTagsData = ApiResponse<Tag[]>;
type TagsData = ApiResponse<Tag[]>;
type CondominiumData = ApiResponse<CondominiumAPIProps>;

type GetUserEditInfoResponse = ApiResponse<{
  userTags: UserTagsData;
  tags: TagsData;
  user: UserData;
  condominium: CondominiumData;
}>;

export async function getUserEditInfo() {
  try {
    const { BASE_URL } = api();
    const url = new URL(`${BASE_URL}/user/edit`);
    const response = await apiRequest(url.toString());
    const responseData: GetUserEditInfoResponse = await response.json();

    if (responseData.status === "error" || !response.ok) {
      throw new Error(responseData.message || "Failed to fetch user info");
    }

    const tags = responseData.data.tags.data;
    const userTags = responseData.data.userTags.data;
    const condominium = responseData.data.condominium.data;
    const user = UserMapper.toUI(responseData.data.user.data);

    console.log(condominium);

    return {
      user,
      tags,
      userTags,
      condominium,
    };
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw new Error(
      "An unexpected error occurred while fetching user information."
    );
  }
}
