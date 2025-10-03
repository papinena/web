import type { CreatePostType } from "~/parsers/create-post";

export type UpdatePostType = CreatePostType & {
  createdAt?: string | Date;
};