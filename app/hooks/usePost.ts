import type { UpdatePostType } from "~/interfaces/update-post";
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
import { DateFormatter } from "~/utils/date-formatter";

export function usePost({
  onUpdateSuccess,
}: { onUpdateSuccess?(): void } = {}) {
  const queryClient = useQueryClient();

  const useListPosts = (params?: { limit?: number }) => {
    return useInfiniteQuery({
      queryKey: ["posts", params],
      queryFn: ({ pageParam }) =>
        getHomePosts({ pageParam, limit: params?.limit }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // If the last page has no data, there are no more pages

        if (!lastPage.userPosts.pagination.hasNextPage) {
          return undefined;
        }

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
    }: {
      postId: string;
      data: UpdatePostType;
    }) => {
      const files = data.files;
      let filenames: { filename: string; type: "IMAGE" | "VIDEO" }[] = [];
      let tokenData: { containerUri: string; sasToken: string } | undefined,
        tokenError: { status: string; message: string } | undefined;

      if (files && files.length > 0) {
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

      const baseDate = new Date(data.createdAt || new Date());
      const expiresOn =
        data.expiresOn === 9999
          ? new Date("9999-12-31T00:00:00.000Z")
          : DateFormatter.addMonths(baseDate, data.expiresOn);

      const res = await updatePost(postId, {
        ...data,
        types: data.postTypes.map((t) => t.id),
        categories: data.categories.map((t) => t.id),
        description: data.description,
        media: filenames,
        social: `${data.instagram};${data.facebook}`,
        expiresOn,
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
      queryClient.resetQueries({ queryKey: ["update-user-post", postId] });
      queryClient.resetQueries({
        queryKey: ["update-user-post-images", postId],
      });
      onUpdateSuccess?.();
    },
  });

  const createPostMutation = useMutation({
    mutationKey: ["CREATE_NEW_POST"],
    mutationFn: async (data: { form: CreatePostType }) => {
      let filenames: { filename: string; type: "IMAGE" | "VIDEO" }[] = [];
      let tokenData: { containerUri: string; sasToken: string } | undefined,
        tokenError: { status: string; message: string } | undefined;
      const files = data.form.files;

      if (files && files.length > 0) {
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

      const expiresOn = new Date();

      if (data.form.expiresOn === 9999) {
        expiresOn.setFullYear(9999, 11, 31);
      } else {
        expiresOn.setMonth(expiresOn.getMonth() + data.form.expiresOn);
      }

      const res = await createNewPost({
        ...data.form,
        types: data.form.postTypes.map((t) => t.label),
        categories: data.form.categories.map((t) => t.label),
        description: data.form.description,
        media: filenames,
        social: `${data.form.instagram};${data.form.facebook}`,
        expiresOn,
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
