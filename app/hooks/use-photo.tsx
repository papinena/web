import { useState, type ChangeEvent } from "react";

type Props = {
  defaultValues: {
    preview?: string | null;
    file?: File | null;
  };
};

export function usePhoto({ defaultValues }: Props = { defaultValues: {} }) {
  const [preview, setPreview] = useState<string | null>(
    defaultValues?.preview ?? null
  );
  const [file, setFile] = useState<File | null>(defaultValues?.file ?? null);

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
  return { preview, file, handleFileChange };
}
