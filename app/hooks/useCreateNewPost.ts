
import { useMutation } from "@tanstack/react-query";
import { createNewPost } from "~/services/create-new-post";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";
import type { CreatePostType } from "~/parsers/create-post";

export function useCreateNewPost({
  onSuccess,
}: {
  onSuccess?: (postId: string) => void;
}) {
  const mutation = useMutation({
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
    onSuccess,
  });

  return { mutation };
}
