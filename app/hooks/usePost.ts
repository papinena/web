import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "~/services/delete-post";
import { updatePost } from "~/services/update-post";
import type { CreatePostType } from "~/parsers/create-post";

export function usePost() {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-publications"] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: ({
      postId,
      data,
    }: {
      postId: string;
      data: CreatePostType;
    }) => updatePost(postId, data),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["my-publications"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  return { deletePostMutation, updatePostMutation };
}
