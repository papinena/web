import type { ComponentProps } from "react";
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import { cn } from "~/lib/utils";

interface UserAvatarProps {
  avatarUrl?: string | null;
  fallbackText: string;
  imageClassName?: string;
  containerClassName?: string;
  imageProps?: ComponentProps<typeof AvatarImage>;
  fallbackProps?: ComponentProps<typeof AvatarFallback>;
}

export function UserAvatar({
  avatarUrl,
  fallbackText,
  imageClassName,
  containerClassName,
  imageProps,
  fallbackProps,
}: UserAvatarProps) {
  const { buildUrl } = useImageReadToken();

  return (
    <UIAvatar className={cn("h-12 w-12", containerClassName)}>
      <AvatarImage
        src={buildUrl(avatarUrl ?? "")}
        className={cn("object-cover", imageClassName)}
        {...imageProps}
      />
      <AvatarFallback {...fallbackProps}>
        {fallbackText.charAt(0)}
      </AvatarFallback>
    </UIAvatar>
  );
}
