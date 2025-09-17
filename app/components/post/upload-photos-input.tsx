import { type ChangeEvent, useState } from "react";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";

export function UploadPhotosInput({
  onFilesChange,
  initialPreviews = [],
  initialFiles = [],
}: {
  onFilesChange: (files: File[]) => void;
  initialPreviews?: string[];
  initialFiles?: File[];
}) {
  const [previews, setPreviews] = useState<string[]>(initialPreviews);
  const [files, setFiles] = useState<File[]>(initialFiles);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (files.length >= 5) {
        return;
      }

      const newFiles = [...files];
      const newPreviews = [...previews];
      for (const file of e.target.files) {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      }

      setFiles(newFiles);
      setPreviews(newPreviews);
      onFilesChange(newFiles);
    }
  };

  const handleRemoveImage = (index: number) => {
    URL.revokeObjectURL(previews[index]);

    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange(newFiles);
  };

  return (
    <>
      <Label
        htmlFor="photo-upload-input"
        className="aspect-square max-w-sm rounded-2xl border border-gray-300 cursor-pointer flex flex-wrap justify-center items-center gap-2 p-2"
      >
        {previews.length > 0 &&
          previews.map((preview, index) => (
            <Box key={index} className="relative h-full flex-1">
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                className="h-full w-full rounded-2xl object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleRemoveImage(index);
                }}
                className="absolute cursor-pointer top-1 right-1 rounded-full p-1 h-6 w-6 flex items-center justify-center"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            </Box>
          ))}
        {previews.length < 5 && (
          <Box className="flex-col p-3 items-center justify-center h-full flex-1">
            <PlusIcon className="w-10 h-10 text-gray-400" />
            <Text>+ foto</Text>
            <Text className="text-sm text-gray-300">
              {5 - previews.length} restantes
            </Text>
          </Box>
        )}
      </Label>
      <Input
        id="photo-upload-input"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        value=""
        multiple
      />
    </>
  );
}
