import { api, apiRequest } from "~/utils/api";

type PostMediaProps = {
  id: string;
  filename: string;
  type: "IMAGE" | "VIDEO";
  postId: string;
  createdAt: string;
  updatedAt: string;
};

type PostCategoryProps = {
  id: number;
  name: string;
  is_default: boolean;
};

type PostTypeProps = {
  id: number;
  name: string;
  is_default: boolean;
};

type PostAuthorProps = {
  name: string;
  avatar: string | null;
  apartment: string;
  block: string;
  telephone: string;
};

export type PostAPIProps = {
  id: string;
  title: string;
  resume: string;
  description?: string;
  expiresOn: string;
  social: string;
  priority: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author: PostAuthorProps;
  types: PostTypeProps[];
  categories: PostCategoryProps[];
  media: PostMediaProps[];
};

interface ApiResponse {
  status: "success" | "error";
  message: string;
  data?: PostAPIProps;
}

export async function getPost(postId: string) {
  try {
    const { BASE_URL } = api();

    const url = new URL(`${BASE_URL}/post/${postId}`);
    const response = await apiRequest(url.toString());
    const responseData: ApiResponse = await response.json();

    if (responseData.status === "error") {
      throw new Error(responseData.message || "Failed to get post");
    }

    return responseData.data;
  } catch (error) {
    console.error("Error getting post:", error);
    throw new Error("An unexpected error occurred while fetching the post.");
  }
}
