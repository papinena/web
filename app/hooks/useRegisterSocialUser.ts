import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import type { UserAPIProps } from "~/interfaces/user";
import {
  CreateSocialUserSchema,
  type CreateSocialUserType,
} from "~/parsers/create-social-user";
import { createSocialUser } from "~/services/create-social-user";

interface UseRegisterSocialUserParams {
  onSuccess?: (data: UserAPIProps) => void;
  initialValues?: Partial<CreateSocialUserType> & {
    providerId: string;
    provider: "google";
  };
}

export function useRegisterSocialUser({
  onSuccess,
  initialValues,
}: UseRegisterSocialUserParams) {
  const methods = useForm<CreateSocialUserType>({
    resolver: zodResolver(CreateSocialUserSchema),
    defaultValues: { ...initialValues, tags: [] },
  });

  const {
    mutate: onSave,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async (data: CreateSocialUserType) => {
      const {
        status,
        message,
        data: res,
      } = await createSocialUser({
        user: data,
        socialAccount: {
          provider: initialValues?.provider ?? "google",
          providerId: initialValues?.providerId ?? "",
        },
      });
      if (status === "error") throw new Error(message);
      return res;
    },
    onSuccess,
  });

  return {
    methods,
    onSave: methods.handleSubmit((data) => onSave(data)),
    isPending,
    isError,
    error,
  };
}
