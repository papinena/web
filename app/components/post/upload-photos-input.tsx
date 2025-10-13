import { type ChangeEvent, useState, type MouseEvent } from "react";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { cn } from "~/lib/utils";

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
  const [selectedPreview, setSelectedPreview] = useState<string | null>(
    initialPreviews[0] ?? null
  );

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

      if (!selectedPreview) setSelectedPreview(newPreviews[0]);

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

  const thumbnails = previews.filter((p) => p !== selectedPreview) || [];

  function handleRemoveMainImage(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    e.stopPropagation();
    const index = previews.findIndex((p) => p === selectedPreview);
    URL.revokeObjectURL(previews[index]);

    const newFiles = files.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviews(newPreviews);
    onFilesChange(newFiles);
    setSelectedPreview(newPreviews[0]);
  }

  return (
    <Box className="flex-col max-w-md max-h-md gap-2">
      {/* Main Image */}
      {selectedPreview ? (
        <Box className="w-full aspect-square rounded-lg overflow-hidden relative">
          <Image
            src={selectedPreview}
            alt="Main post image"
            className="w-full h-full object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            onClick={handleRemoveMainImage}
            className="absolute cursor-pointer top-1 right-1 rounded-full p-1 h-6 w-6 flex items-center justify-center"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </Box>
      ) : (
        <Label
          htmlFor="photo-upload-input"
          className="w-full aspect-square rounded-lg border border-gray-300 cursor-pointer flex flex-col items-center justify-center"
        >
          <PlusIcon className="w-10 h-10 text-gray-400" />
          <Text>+ foto</Text>
          <Text className="text-sm text-gray-300">
            {5 - previews.length} restantes
          </Text>
        </Label>
      )}

      {/* Thumbnails */}
      <Box className="flex gap-2">
        {thumbnails.slice(0, 4).map((preview, index) => (
          <Box
            key={preview}
            className={cn(
              "w-24 aspect-square rounded-lg overflow-hidden cursor-pointer border-2 relative",
              selectedPreview === preview
                ? "border-blue-primary"
                : "border-transparent"
            )}
            onClick={() => setSelectedPreview(preview)}
          >
            <Image
              src={preview}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const originalIndex = previews.findIndex((p) => p === preview);
                handleRemoveImage(originalIndex);
              }}
              className="absolute cursor-pointer top-1 right-1 rounded-full p-1 h-6 w-6 flex items-center justify-center"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          </Box>
        ))}
        {previews.length < 5 && previews.length > 0 && (
          <Label
            htmlFor="photo-upload-input"
            className="w-24 aspect-square rounded-lg border border-gray-300 cursor-pointer flex flex-col items-center justify-center"
          >
            <PlusIcon className="w-10 h-10 text-gray-400" />
            <Text>+ foto</Text>
          </Label>
        )}
      </Box>

      <Input
        id="photo-upload-input"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        value=""
        multiple
      />
    </Box>
  );
}
