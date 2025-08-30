import type { ChangeEvent } from "react";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { XIcon } from "lucide-react";

export function UploadPhotosInput({
  previews,
  handleFileChange,
  handleRemoveImage,
}: {
  previews: string[];
  handleFileChange(e: ChangeEvent<HTMLInputElement>): void;
  handleRemoveImage(index: number): void;
}) {
  return (
    <>
      <Label
        htmlFor="photo-upload-input"
        className="aspect-square max-w-sm rounded-2xl border border-gray-300 cursor-pointer flex flex-wrap justify-center items-center gap-2 p-2"
      >
        {previews.length > 0 ? (
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
          ))
        ) : (
          <Box className="flex-col p-3 items-center">
            <Image className="h-full flex-1 ml-3 w-full" src="/image 27.svg" />
            <Text>+ foto</Text>
            <Text className="text-sm text-gray-300">até 5 fotos</Text>
          </Box>
        )}
      </Label>
      <Input
        id="photo-upload-input"
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileChange}
      />
    </>
  );
}
