import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserSchema } from "~/parsers/create-user";
import { useMutation } from "@tanstack/react-query";
import { createUser } from "~/services/create-user";
import { useState, type ChangeEvent } from "react";
import { type z } from "zod";
import { getSasToken } from "~/services/get-sas-token";
import { uploadImage } from "~/services/upload-image";
import { deleteImage } from "~/services/delete-image";
import { DateFormatter } from "~/utils/date-formatter";
import { firebaseService } from "~/lib/firebase";
import { saveUnauthenticatedFcmToken } from "~/services/save-unauthenticated-fcm-token";

type UserFormType = z.infer<typeof CreateUserSchema>;

const defaultValues: Omit<UserFormType, "condominiumId"> & {
  condominiumId?: number;
} = {
  name: "",
  lastName: "",
  apartment: "",
  telephone: "",
  email: "",
  confirmEmail: "",
  password: "",
  confirmPassword: "",
  tags: [],
  photo: "",
};

const STORAGE_KEY = "user-form-fields";

export function useRegisterUser({
  initialValues,
  onSuccess,
}: {
  onSuccess?: () => void;
  initialValues?: Partial<typeof defaultValues>;
} = {}) {
  const [fields, setFields] = useState<UserFormType>(() => {
    if (typeof window === "undefined") return defaultValues;
    const storedValues = localStorage.getItem(STORAGE_KEY);
    if (!storedValues) return { ...defaultValues, ...initialValues };

    return JSON.parse(storedValues);
  });

  const [preview, setPreview] = useState<string | null>(
    initialValues?.photo ?? null
  );
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFile(file);
    }
  };

  function setLocalStorageFields(f: UserFormType) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
  }

  const methods = useForm({
    defaultValues: fields,
    resolver: zodResolver(CreateUserSchema),
  });

  const { mutate, isError, error, isPending } = useMutation({
    mutationFn: async (data: UserFormType) => {
      let filename = "";
      let tokenData,
        tokenError: { status: string; message: string } | undefined;

      if (file) {
        const { data, error } = await getSasToken();
        tokenData = data;
        tokenError = error;

        if (tokenError) {
          throw new Error(tokenError.message);
        }

        if (tokenData) {
          filename = await uploadImage(
            tokenData.containerUri,
            tokenData.sasToken,
            file
          );
        }
      }

      const dataToSave = {
        ...data,
        birthDate: data.birthDate ? DateFormatter.parse(data.birthDate) : null,
        photo: filename,
      };

      const res = await createUser(dataToSave);

      if (res?.status === "error") {
        tokenData &&
          filename &&
          (await deleteImage(
            tokenData.containerUri,
            tokenData.sasToken,
            filename
          ));
        throw new Error(res.message);
      }
      return res.data;
    },
    onSuccess: async (data) => {
      if (data?.email) {
        try {
          const fcmToken = await firebaseService.setupForUnauthenticatedUser();
          if (fcmToken) {
            await saveUnauthenticatedFcmToken(fcmToken, data.email);
          }
        } catch (error) {
          console.error(
            "Failed to setup or save FCM token on registration:",
            error
          );
        }
      }
      onSuccess?.();
    },
  });

  const onSave = methods.handleSubmit((data) => {
    const dataToSave = {
      ...data,
    };
    setFields(dataToSave);
    setLocalStorageFields(dataToSave);
    mutate(dataToSave);
  });

  function resetLocalStorageFields() {
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    methods,
    onSave,
    error,
    isPending,
    isError,
    preview,
    handleFileChange,
    resetLocalStorageFields,
  };
}
