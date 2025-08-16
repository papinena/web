import { api, apiRequest } from "~/utils/api";
import { z } from "zod";

const PostMediaType = ["IMAGE", "VIDEO"] as const;

const CreateAdminPostSchema = z.object({
  title: z.string(),
  resume: z.string(),
  description: z
    .string()
    .optional()
    .transform((val) => val ?? null),
  urgent: z.boolean().optional(),
  notify: z.boolean().optional(),
  media: z
    .array(
      z.object({
        filename: z.string(),
        type: z.enum(PostMediaType),
      })
    )
    .optional(),
});

type CreateAdminPostType = z.infer<typeof CreateAdminPostSchema>;

interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data?: T;
}

type PostMediaProps = {
  id: string;
  filename: string;
  type: "IMAGE" | "VIDEO";
  postId: string;
  createdAt: string;
  updatedAt: string;
};

type PostAPIProps = {
  id: string;
  title: string;
  resume: string;
  description?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  media: PostMediaProps[];
};

export async function createAdminPost(data: CreateAdminPostType) {
  try {
    const { BASE_URL } = api();
    const url = new URL(BASE_URL + "/admin/new-post");

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
