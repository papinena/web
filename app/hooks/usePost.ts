import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "~/services/delete-post";

export function usePost() {
  const queryClient = useQueryClient();

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-publications"] });
    },
  });

  return { deletePostMutation };
}
