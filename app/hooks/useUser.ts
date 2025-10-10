import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateUser } from "~/services/update-user";
import { getUserEditInfo } from "~/services/get-user-edit-info";
import { CreateUserSchema, type CreateUserType } from "~/parsers/create-user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useAuth } from "./useAuth";
import { UpdateUserSchema, type UpdateUserType } from "~/parsers/update-user";
import { UserMapper } from "~/mappers/user";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";
import { DateFormatter } from "~/utils/date-formatter";
import { deleteUser } from "~/services/delete-account";
import { useAuthStore } from "~/stores/auth";
import { useNavigate } from "react-router";

export function useUser({ onSuccess }: { onSuccess?: () => void } = {}) {
  const { authData, setAuthUserData } = useAuth();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const deleteAccountMutation = useMutation({
    mutationKey: ["DELETE-USER"],
    mutationFn: deleteUser,
    onSuccess: () => {
      setTimeout(() => {
        queryClient.removeQueries();
        logout();
        navigate("/");
      }, 3000);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const methods = useForm<CreateUserType>({
    resolver: zodResolver(CreateUserSchema),
    defaultValues: authData?.user,
  });

  const updateUserForm = ({
    defaultValues,
    values,
  }: {
    defaultValues?: any;
    values?: any;
  }) =>
    useForm<UpdateUserType>({
      resolver: zodResolver(UpdateUserSchema),
      defaultValues: defaultValues,
      values,
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
          ...UserMapper.toAPI({
            ...data,
            birthDate: DateFormatter.parse(data.birthDate),
          }),
          avatar: avatarFilename,
        },
        tags: data.tags.map((t) => t.label),
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
    onError: (err) => {
      console.log(err);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const newFile = e.target.files[0];
      setFile(newFile);
    } else {
      setFile(null);
    }
  };

  const handleRemoveImage = () => {
    setFile(null);
  };

  return {
    methods,
    updateUserMutation,
    file,
    setFile,
    handleFileChange,
    handleRemoveImage,
    useUserEditInfo,
    updateUserForm,
    deleteAccountMutation,
  };
}
