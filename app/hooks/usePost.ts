import {
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { deletePost } from "~/services/delete-post";
import { updatePost } from "~/services/update-post";
import { createNewPost } from "~/services/create-new-post";
import { getHomePosts } from "~/services/get-home-posts";
import type { CreatePostType } from "~/parsers/create-post";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";

export function usePost() {
  const queryClient = useQueryClient();

  const useListPosts = (params?: { limit?: number }) => {
    return useInfiniteQuery({
      queryKey: ["posts", params],
      queryFn: ({ pageParam }) =>
        getHomePosts({ pageParam, limit: params?.limit }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // If the last page has no data, there are no more pages
        if (lastPage.userPosts.data.length === 0) {
          return undefined;
        }
        // Otherwise, increment the page number
        return allPages.length + 1;
      },
    });
  };

  const deletePostMutation = useMutation({
    mutationFn: (postId: string) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-publications"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async ({
      postId,
      data,
      files,
    }: {
      postId: string;
      data: CreatePostType;
      files: File[];
    }) => {
      let filenames: { filename: string; type: "IMAGE" | "VIDEO" }[] = [];
      let tokenData: { containerUri: string; sasToken: string } | undefined,
        tokenError: { status: string; message: string } | undefined;

      if (files.length > 0) {
        const sasTokenData = await getSasToken();
        tokenData = sasTokenData.data;
        tokenError = sasTokenData.error;

        if (tokenError) throw new Error(tokenError.message);
        if (!tokenData) throw new Error("Token data is undefined");

        const uploadPromises = files.map((file) =>
          uploadImage(tokenData.containerUri, tokenData.sasToken, file)
        );
        const uploadedFilenames = await Promise.all(uploadPromises);
        filenames = uploadedFilenames.map((filename) => ({
          filename,
          type: "IMAGE",
        }));
      }

      const res = await updatePost(postId, {
        ...data,
        description: data.description ?? null,
        media: filenames,
        social: `${data.instagram};${data.facebook}`,
      });

      if (res?.status === "success") {
        return res.data?.id ?? "";
      }

      if (tokenData && filenames.length > 0) {
        const deletePromises = filenames.map(({ filename }) =>
          deleteImage(tokenData.containerUri, tokenData.sasToken, filename)
        );
        await Promise.all(deletePromises);
      }
      throw new Error(res?.message || "Failed to update post");
    },
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({ queryKey: ["my-publications"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const createPostMutation = useMutation({
    mutationKey: ["CREATE_NEW_POST"],
    mutationFn: async (data: { form: CreatePostType; files: File[] }) => {
      let filenames: { filename: string; type: "IMAGE" | "VIDEO" }[] = [];
      let tokenData: { containerUri: string; sasToken: string } | undefined,
        tokenError: { status: string; message: string } | undefined;

      if (data.files.length > 0) {
        const sasTokenData = await getSasToken();
        tokenData = sasTokenData.data;
        tokenError = sasTokenData.error;

        if (tokenError) throw new Error(tokenError.message);
        if (!tokenData) throw new Error("Token data is undefined");

        const uploadPromises = data.files.map((file) =>
          uploadImage(tokenData.containerUri, tokenData.sasToken, file)
        );
        const uploadedFilenames = await Promise.all(uploadPromises);
        filenames = uploadedFilenames.map((filename) => ({
          filename,
          type: "IMAGE",
        }));
      }

      const res = await createNewPost({
        ...data.form,
        description: data.form.description ?? null,
        media: filenames,
        social: `${data.form.instagram};${data.form.facebook}`,
      });

      if (res.status === "success") {
        return res.data?.id ?? "";
      }

      if (tokenData && filenames.length > 0) {
        const deletePromises = filenames.map(({ filename }) =>
          deleteImage(tokenData.containerUri, tokenData.sasToken, filename)
        );
        await Promise.all(deletePromises);
      }
      throw new Error(res.message + res.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-publications"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return {
    useListPosts,
    deletePostMutation,
    updatePostMutation,
    createPostMutation,
  };
}
