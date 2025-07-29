import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateUserSchema } from '~/parsers/create-user';
import { useMutation } from '@tanstack/react-query';
import { createUser } from '~/services/create-user';
import { useState, type ChangeEvent } from 'react';
import { type z } from 'zod';
import type { Tag } from '~/interfaces/tag';
import { getSasToken } from '~/services/get-sas-token';
import { uploadImage } from '~/services/upload-image';

type UserFormType = z.infer<typeof CreateUserSchema>;

const defaultValues: UserFormType = {
  name: '',
  lastName: '',
  apartment: '',
  telephone: '',
  email: '',
  confirmEmail: '',
  password: '',
  confirmPassword: '',
  condominiumId: '',
  tags: [],
  photo: '',
};

const STORAGE_KEY = 'user-form-fields';

export function useRegisterUser({
  onSuccess,
}: { onSuccess?: () => void } = {}) {
  const [fields, setFields] = useState<UserFormType>(() => {
    if (typeof window === 'undefined') return defaultValues;
    const storedValues = localStorage.getItem(STORAGE_KEY);
    if (!storedValues) return defaultValues;

    return JSON.parse(storedValues);
  });

  const [selectedTheme, setSelectedTheme] = useState<Tag[]>([]);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const { data: tokenData, error: tokenError } = await getSasToken();

        if (tokenError) {
          throw new Error(tokenError.message);
        }

        if (tokenData) {
          const imageUrl = await uploadImage(
            tokenData.containerUri,
            tokenData.sasToken,
            file,
          );
          methods.setValue('photo', imageUrl);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  function handleSelectedTheme(t: Tag) {
    setSelectedTheme(s => {
      const i = s.findIndex(v => v.id === t.id);
      if (i > -1) return s.filter(v => v.id !== t.id);
      return s.concat([t]);
    });
  }

  function setLocalStorageFields(f: UserFormType) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(f));
  }

  const methods = useForm({
    defaultValues: fields,
    resolver: zodResolver(CreateUserSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createUser,
    onSuccess,
  });

  const onSave = methods.handleSubmit(data => {
    const dataToSave = {
      ...data,
      tags: selectedTheme.map(t => String(t.label)),
    };
    setFields(dataToSave);
    setLocalStorageFields(dataToSave);
    mutate(dataToSave);
  });

  return {
    methods,
    onSave,
    isPending: isPending || isUploading,
    selectedTheme,
    handleSelectedTheme,
    preview,
    handleFileChange,
  };
}
