import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAdminPost } from "~/services/create-admin-post";
import type { CreateAdminPostType } from "~/parsers/create-admin-post";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";

export function useAdminPost() {
  const queryClient = useQueryClient();

  const createAdminPostMutation = useMutation({
    mutationKey: ["CREATE_ADMIN_POST"],
    mutationFn: async (data: {
      form: CreateAdminPostType;
      files: File[];
    }) => {
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

      const res = await createAdminPost({
        ...data.form,
        description: data.form.description ?? null,
        media: filenames,
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
      queryClient.invalidateQueries({ queryKey: ["admin-posts"] });
    },
  });

  return {
    createAdminPostMutation,
  };
}
