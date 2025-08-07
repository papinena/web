import { useState, useEffect } from "react";
import { Box } from "~/components/ui/box";
import { Image } from "~/components/ui/image";
import { cn } from "~/lib/utils";
import type { PostAPIProps } from "~/services/get-post";

type Media = PostAPIProps["media"][0];

interface ImageGalleryProps {
  media: Media[];
  buildUrl: (filename: string) => string;
}

export function ImageGallery({ media, buildUrl }: ImageGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  useEffect(() => {
    if (media.length > 0) {
      setSelectedMedia(media[0]);
    }
  }, [media]);

  const thumbnails = media.filter((m) => m.id !== selectedMedia?.id) || [];

  if (!selectedMedia) {
    return null;
  }

  return (
    <Box className="flex-col gap-2">
      {/* Main Image */}
      <Box className="w-full h-96 rounded-lg overflow-hidden">
        <Image
          src={buildUrl(selectedMedia.filename)}
          alt="Main post image"
          className="w-full h-full object-cover"
        />
      </Box>

      {/* Thumbnails */}
      {thumbnails.length > 0 && (
        <Box className="flex gap-2">
          {thumbnails.slice(0, 4).map((media) => (
            <Box
              key={media.id}
              className={cn(
                "w-1/4 h-32 rounded-lg overflow-hidden cursor-pointer border-2",
                selectedMedia.id === media.id
                  ? "border-blue-primary"
                  : "border-transparent"
              )}
              onClick={() => setSelectedMedia(media)}
            >
              <Image
                src={buildUrl(media.filename)}
                alt={`Thumbnail ${media.id}`}
                className="w-full h-full object-cover"
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
