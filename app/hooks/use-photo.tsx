import { useState, type ChangeEvent } from "react";

type Props = {
  defaultValues: {
    preview?: string | null;
    file?: File | null;
  };
};

export function usePhoto({}: Props = {}) {
  const [preview, setPreview] = useState<string | null>(null);
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
  return { preview, file, handleFileChange };
}
