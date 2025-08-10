import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "~/services/update-user";
import { getUserEditInfo } from "~/services/get-user-edit-info";
import { CreateUserSchema, type CreateUserType } from "~/parsers/create-user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import type { Tag } from "~/interfaces/tag";
import { useAuth } from "./useAuth";
import { UpdateUserSchema, type UpdateUserType } from "~/parsers/update-user";
import { UserMapper } from "~/mappers/user";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";

export function useUser({ onSuccess }: { onSuccess?: () => void }) {
  const { authData, setAuthUserData } = useAuth();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [selectedTheme, setSelectedTheme] = useState<Tag[]>([]);

  const methods = useForm<CreateUserType>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: authData?.user,
  });

  const updateUserForm = ({ defaultValues }: { defaultValues?: any }) =>
    useForm<UpdateUserType>({
      resolver: zodResolver(UpdateUserSchema),
      defaultValues: defaultValues,
    });

  const useUserEditInfo = () => {
    return useQuery({
      queryKey: ["user-edit-info"],
      queryFn: getUserEditInfo,
    });
  };

  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserType) => {
      let avatarFilename: string | undefined;
      let tokenData: { containerUri: string; sasToken: string } | undefined,
        tokenError: { status: string; message: string } | undefined;

      if (file) {
        const sasTokenData = await getSasToken();
        tokenData = sasTokenData.data;
        tokenError = sasTokenData.error;

        if (tokenError) throw new Error(tokenError.message);
        if (!tokenData) throw new Error("Token data is undefined");

        avatarFilename = await uploadImage(
          tokenData.containerUri,
          tokenData.sasToken,
          file
        );
      }

      const payload = {
        user: {
          ...UserMapper.toAPI(data),
          avatar: avatarFilename,
        },
        tags: selectedTheme.map((t) => t.id),
      };

      const res = await updateUser(payload);

      if (res.status === "error") {
        if (tokenData && avatarFilename) {
          await deleteImage(
            tokenData.containerUri,
            tokenData.sasToken,
            avatarFilename
          );
          throw new Error("Algo deu errado"); // Re-throw the error to be handled by react-query
        }
      }
      return res;
    },
    onSuccess: (data) => {
      // Update the user data in local storage and in auth store
      setAuthUserData(data.user.data);

      queryClient.invalidateQueries({ queryKey: ["user-edit-info"] });
      onSuccess?.();
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleSelectedTheme = (theme: Tag) => {
    setSelectedTheme((prev) =>
      prev.some((t) => t.id === theme.id)
        ? prev.filter((t) => t.id !== theme.id)
        : [...prev, theme]
    );
  };

  return {
    methods,
    updateUserMutation,
    selectedTheme,
    handleSelectedTheme,
    file,
    handleFileChange,
    useUserEditInfo,
    updateUserForm,
    setSelectedTheme,
  };
}
