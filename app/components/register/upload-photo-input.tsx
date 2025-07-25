import { Image } from "~/components/ui/image";
import { type ChangeEvent } from "react";
import { Label } from "~/components/ui/label";
import { Input } from "../ui/input";
import { Text } from "../ui/text";
import { Box } from "../ui/box";

export function UploadPhotoInput({
  preview,
  handleFileChange,
}: {
  preview: string | null;
  handleFileChange(e: ChangeEvent<HTMLInputElement>): void;
}) {
  return (
    <>
      <Label
        htmlFor="photo-upload-input"
        className="h-32 w-32 bg-gray-400 rounded-2xl cursor-pointer  flex flex-col justify-center items-center"
      >
        {preview ? (
          <Image
            src={preview}
            alt="Preview"
            className="max-w-full w-full h-full flex-1 rounded-2xl object-cover"
          />
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
        onChange={handleFileChange}
      />
    </>
  );
}
