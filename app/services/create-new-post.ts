import { api, apiRequest } from "~/utils/api";
import { z } from "zod";
import type { UserPostAPIProps } from "~/interfaces/post";
import type { ApiResponse } from "~/interfaces/api-response";

const PostMediaType = ["IMAGE", "VIDEO"] as const;
const PostPriority = ["HIGH", "MEDIUM", "LOW", "NORMAL"] as const;

const CreateNewPostSchema = z.object({
  title: z.string(),
  resume: z.string(),
  description: z.string().optional(),
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

export async function createNewPost(data: CreateNewPostType) {
  try {
    const { BASE_URL } = api();
    const url = new URL(BASE_URL + "/user/new-post");

    const response = await apiRequest(url.toString(), {
      method: "POST",
      body: JSON.stringify(data),
    });

    const responseData: ApiResponse<UserPostAPIProps> = await response.json();

    return responseData;
  } catch (error) {
    console.error("Error creating new post:", error);
    throw new Error("An unexpected error occurred.");
  }
}
