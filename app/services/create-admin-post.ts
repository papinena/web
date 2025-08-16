import type { ApiResponse } from "~/interfaces/api-response";
import { api, apiRequest } from "~/utils/api";

type PostMediaProps = {
  filename: string;
  type: "IMAGE" | "VIDEO";
};

type CreateAdminPostProps = {
  title: string;
  resume: string;
  description?: string;
  media: PostMediaProps[];
};

type PostAPIProps = {
  id: string;
  title: string;
  resume: string;
  description?: string;
  author_id: string;
  createdAt: string;
  updatedAt: string;
  media: PostMediaProps[];
};

export async function createAdminPost(data: CreateAdminPostProps) {
  try {
    const { BASE_URL } = api();
    const url = new URL(BASE_URL + "/user/new-post");

    const response = await apiRequest(url.toString(), {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseData: ApiResponse<PostAPIProps> = await response.json();

    return responseData;
  } catch (error) {
    console.error("Error creating new post:", error);
    throw new Error("An unexpected error occurred.");
  }
}
