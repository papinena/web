import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "~/lib/utils";
import { Box } from "./box";
import { useImageReadToken } from "~/hooks/useImageReadToken";

const PostImageRoot = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-full w-full shrink-0 overflow-hidden rounded-xl",
      className
    )}
    {...props}
  />
));
PostImageRoot.displayName = AvatarPrimitive.Root.displayName;

const PostImageSrc = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
));
PostImageSrc.displayName = AvatarPrimitive.Image.displayName;

const PostImageFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-xl bg-muted",
      className
    )}
    {...props}
  >
    <Box className="h-full w-full bg-gray-200" />
  </AvatarPrimitive.Fallback>
));
PostImageFallback.displayName = AvatarPrimitive.Fallback.displayName;

interface PostImageProps {
  filename: string;
  alt: string;
  className?: string;
}

export function PostImage({ filename, alt, className }: PostImageProps) {
  const { buildUrl } = useImageReadToken();
  return (
    <PostImageRoot className={className}>
      <PostImageSrc src={buildUrl(filename)} alt={alt} />
      <PostImageFallback />
    </PostImageRoot>
  );
}
