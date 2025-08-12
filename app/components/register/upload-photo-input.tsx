import { Image } from "~/components/ui/image";
import { type ChangeEvent, useState } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Box } from "../ui/box";
import { Button } from "../ui/button";
import { XIcon } from "lucide-react";

export function UploadPhotoInput({
  preview: initialPreview,
  handleFileChange,
  handleRemoveImage,
}: {
  preview: string | null;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage?: () => void;
}) {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isRemoved, setIsRemoved] = useState(false);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalPreview(reader.result as string);
        setIsRemoved(false);
      };
      reader.readAsDataURL(file);
    }
    handleFileChange(e);
  };

  const onRemoveImage = () => {
    setLocalPreview(null);
    setIsRemoved(true);
    if (handleRemoveImage) {
      handleRemoveImage();
    }
  };

  const displayPreview = isRemoved ? null : localPreview || initialPreview;

  return (
    <>
      <Label
        htmlFor="photo-upload-input"
        className="h-32 w-32 bg-gray-400 rounded-2xl cursor-pointer flex flex-col justify-center items-center"
      >
        {displayPreview ? (
          <Box className="relative h-full w-full">
            <Image
              src={displayPreview}
              alt="Preview"
              className="max-w-full w-full h-full flex-1 rounded-2xl object-cover"
            />
            {
              <Button
                type="button"
                variant="destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onRemoveImage();
                }}
                className="absolute cursor-pointer top-1 right-1 rounded-full p-1 h-6 w-6 flex items-center justify-center"
              >
                <XIcon className="w-4 h-4" />
              </Button>
            }
          </Box>
        ) : (
          <Box className="flex-col p-3 items-center">
            <Image className="h-full flex-1 ml-3 w-full" src="/image 27.svg" />
            <Text>+ foto</Text>
          </Box>
        )}
      </Label>
      <Input
        id="photo-upload-input"
        type="file"
        className="hidden"
        accept="image/*"
        onChange={onFileChange}
      />
    </>
  );
}
