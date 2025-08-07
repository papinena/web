import { api, apiRequest } from "~/utils/api";
import { z } from "zod";

const PostMediaType = ["IMAGE", "VIDEO"] as const;
const PostPriority = ["HIGH", "MEDIUM", "LOW", "NORMAL"] as const;

const CreateNewPostSchema = z.object({
  title: z.string(),
  resume: z.string(),
  description: z
    .string()
    .optional()
    .transform((val) => val ?? null),
  expiresOn: z.coerce.date(),
  social: z.string(),
  priority: z.enum(PostPriority).optional(),
  types: z.array(z.number()).optional(),
  categories: z.array(z.number()).optional(),
  media: z
    .array(
      z.object({
        filename: z.string(),
        type: z.enum(PostMediaType),
      })
    )
    .optional(),
});

type CreateNewPostType = z.infer<typeof CreateNewPostSchema>;

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

type PostAPIProps = {
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
  types: PostTypeProps[];
  categories: PostCategoryProps[];
  media: PostMediaProps[];
};

export async function createNewPost(data: CreateNewPostType) {
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
