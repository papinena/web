import type { CSSProperties, ReactNode, ComponentProps } from "react";
import {
  Avatar as UIAvatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { useImageReadToken } from "~/hooks/useImageReadToken";
import type { PostAuthorProps } from "~/interfaces/post";
import { cn } from "~/lib/utils";

// --- Sub-components ---

interface SubComponentProps {
  author: PostAuthorProps | null;
  className?: string;
}

interface AvatarProps extends SubComponentProps {
  style?: CSSProperties;
  imageProps?: ComponentProps<typeof AvatarImage>;
  fallbackProps?: ComponentProps<typeof AvatarFallback>;
}

function PostAuthorAvatar({
  author,
  className,
  style,
  imageProps,
  fallbackProps,
}: AvatarProps) {
  const { buildUrl } = useImageReadToken();
  const isExternalUrl =
    author?.avatar?.startsWith("http") || author?.avatar?.startsWith("https");
  const avatarUrl = author?.avatar
    ? isExternalUrl
      ? author.avatar
      : buildUrl(author?.avatar)
    : undefined;

  return (
    <UIAvatar
      style={{ width: 40, height: 40, ...style }}
      aria-label={author?.name || "Avatar"}
      className={className}
    >
      <AvatarImage className="object-cover" src={avatarUrl} {...imageProps} />
      <AvatarFallback {...fallbackProps}>{author?.name?.[0]}</AvatarFallback>
    </UIAvatar>
  );
}

function PostAuthorName({ author, className }: SubComponentProps) {
  return <Text className={cn("font-bold", className)}>{author?.name}</Text>;
}

function PostAuthorBlock({ author, className }: SubComponentProps) {
  return <Text className={className}>Bloco: {author?.block}</Text>;
}

function PostAuthorAparment({ author, className }: SubComponentProps) {
  return <Text className={className}>Apartamento: {author?.apartment}</Text>;
}

// --- Main Component ---

interface PostAuthorPropsWithChildren {
  children: ReactNode;
  className?: string;
}

interface PostAuthorComposition {
  Avatar: typeof PostAuthorAvatar;
  Name: typeof PostAuthorName;
  Block: typeof PostAuthorBlock;
  Apartment: typeof PostAuthorAparment;
}

export const PostAuthor: React.FC<PostAuthorPropsWithChildren> &
  PostAuthorComposition = ({ children, className }) => {
  return <Box className={cn("gap-2 items-center", className)}>{children}</Box>;
};

PostAuthor.Avatar = PostAuthorAvatar;
PostAuthor.Name = PostAuthorName;
PostAuthor.Block = PostAuthorBlock;
PostAuthor.Apartment = PostAuthorAparment;
